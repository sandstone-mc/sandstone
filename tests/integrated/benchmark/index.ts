import * as path from 'node:path'
import { spawn } from 'bun'
import { createRequire } from 'node:module'
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { createSandstonePack } from '../../../dist/exports/index.js'
import { Client, readEndpoint, pidAlive, NULL_LOGGER } from 'sandstone-cli/connect'
import type { EndpointFile } from 'sandstone-cli/connect'
import { INTEGRATED_HOST_CONFIG } from '../host-config'
import type { BenchmarkSpec, SandstonePack } from './types.js'
import chalk from 'chalk-template'

export type { BenchmarkSpec, BenchmarkTarget } from './types.js'

const require = createRequire(import.meta.url)

const PROJECT_ROOT = path.resolve(import.meta.dir, '../.server')
const BENCH_DIR = import.meta.dir
const NAMESPACE = 'integrated_benchmarks'
const DATA_PACK_DIR_NAME = NAMESPACE
const MC_WORLD_DATAPACKS = path.join(PROJECT_ROOT, '.sandstone', 'mc-server', 'world', 'datapacks')

const SERVER_STARTUP_TIMEOUT_MS = 180_000

interface BenchReport {
  time_span_ms: number
  tick_span: number
  run_count: number
  targets: Array<{
    label: string
    function: string
    iterations_per_tick: number
    ms_per_tick: number
    ms_per_tick_stddev: number
    ms_per_tick_min: number
    ms_per_tick_max: number
    samples: number[]
  }>
}

function resolveCliBin(): string {
  try {
    const cliPkgPath = require.resolve('sandstone-cli/package.json')
    const cliBin = (require(cliPkgPath) as { bin?: { sand?: string } }).bin?.sand
    if (typeof cliBin === 'string') {
      return require.resolve(cliBin, { paths: [path.dirname(cliPkgPath)] })
    }
  } catch {}
  return path.resolve(import.meta.dir, '../../../sandstone-cli/lib/index.js')
}

const CLI_BIN = resolveCliBin()

async function readLineStream(
  stream: ReadableStream<Uint8Array>,
  onLine: (line: string) => void,
): Promise<void> {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let buf = ''
  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      buf += decoder.decode(value, { stream: true })
      const lines = buf.split('\n')
      buf = lines.pop() ?? ''
      for (const line of lines) onLine(line)
    }
    if (buf.length > 0) onLine(buf)
  } finally {
    reader.releaseLock()
  }
}

async function ensureServer(): Promise<{ client: Client, owned: boolean }> {
  const existing = await readEndpoint(PROJECT_ROOT)
  if (existing && await pidAlive(existing.pid)) {
    try {
      const client = await Client.open({
        endpoint: existing,
        requestTimeoutMs: 5_000,
        logger: NULL_LOGGER,
      })
      console.log(chalk`{blue [bench]} Connected to the existing test server`)
      return { client, owned: false }
    } catch {}
  }

  console.log(chalk`{blue [bench]} Test server starting up...`)
  const proc = spawn({
    cmd: [
      CLI_BIN,
      'connect',
      '--host-type', 'integrated',
      '--host-config', JSON.stringify(INTEGRATED_HOST_CONFIG),
    ],
    cwd: PROJECT_ROOT,
    stdout: 'ignore',
    stderr: 'ignore',
    detached: true,
  })
  proc.unref()

  const endpoint = await waitForEndpoint()
  const client = await Client.open({
    endpoint,
    requestTimeoutMs: 30_000,
    logger: NULL_LOGGER,
  })
  console.log(chalk`{blue [bench]} Test server ready`)
  return { client, owned: true }
}

async function waitForEndpoint(): Promise<EndpointFile> {
  const deadline = Date.now() + SERVER_STARTUP_TIMEOUT_MS
  for (;;) {
    const endpoint = await readEndpoint(PROJECT_ROOT)
    if (endpoint && await pidAlive(endpoint.pid)) {
      return endpoint
    }
    if (Date.now() >= deadline) {
      throw new Error(`The test server did not come up within ${SERVER_STARTUP_TIMEOUT_MS / 1000}s.`)
    }
    await new Promise<void>((resolve) => { setTimeout(resolve, 250) })
  }
}

async function stopServer(): Promise<void> {
  const proc = spawn({
    cmd: [CLI_BIN, 'connect', '--shutdown'],
    cwd: PROJECT_ROOT,
    stdout: 'ignore',
    stderr: 'ignore',
  })
  await proc.exited
}

async function deployBenchmarkPack(
  client: Client,
  pack: SandstonePack,
): Promise<void> {
  const compiled = pack.compile()
  compiled.set('pack.mcmeta', JSON.stringify(pack.dataPack().packMcmeta, null, 2))

  await mkdir(path.join(MC_WORLD_DATAPACKS, DATA_PACK_DIR_NAME), { recursive: true })

  for (const [absPath, content] of compiled) {
    const inDatapack = absPath.startsWith('datapack/') ? absPath.slice('datapack/'.length) : absPath
    await client.writeFile({
      path: path.posix.join('world', 'datapacks', DATA_PACK_DIR_NAME, inDatapack),
      data: content,
    })
  }

  console.log(chalk`{blue [bench]} Deployed ${compiled.size} files to world/datapacks/${DATA_PACK_DIR_NAME}`)
}

function printReport(report: BenchReport): void {
  const [a, b] = report.targets
  console.log('')
  console.log(chalk`{blue [bench]} {bold ${report.run_count} run${report.run_count === 1 ? '' : 's'}}, ${report.tick_span} ticks over ${(report.time_span_ms / 1000).toFixed(2)}s each`)
  console.log('')

  for (const target of report.targets) {
    const spread = report.run_count > 1 ? ` ±${target.ms_per_tick_stddev.toFixed(3)}` : ''
    console.log(chalk`  {bold ${target.label.toUpperCase()}}  {cyan ${target.function}}  {dim ${target.iterations_per_tick} calls/tick}  {bold ${target.ms_per_tick.toFixed(3)}} ms/tick${spread}`)
  }

  if (a && b && a.ms_per_tick !== b.ms_per_tick) {
    const slower = a.ms_per_tick > b.ms_per_tick ? a : b
    const faster = slower === a ? b : a
    console.log('')
    console.log(chalk`  → {bold ${slower.label.toUpperCase()}} is {bold ${(slower.ms_per_tick / faster.ms_per_tick).toFixed(2)}×} slower than {bold ${faster.label.toUpperCase()}}`)
  }
}

async function runBenchmark(
  configPath: string,
  extraArgs: string[],
): Promise<BenchReport | undefined> {
  const proc = Bun.spawn(
    [CLI_BIN, 'bench', '--json', '--path', PROJECT_ROOT, ...extraArgs, configPath],
    { stdout: 'pipe', stderr: 'pipe', env: process.env },
  )

  if (proc.stderr !== null && typeof proc.stderr !== 'number') {
    readLineStream(proc.stderr, (line) => {
      if (line.trim()) process.stderr.write(`${line}\n`)
    }).catch(() => {})
  }

  if (proc.stdout !== null && typeof proc.stdout !== 'number') {
    await readLineStream(proc.stdout, (line) => {
      if (!line.trim().startsWith('{')) return
      let event: { event?: string, message?: string, result?: BenchReport }
      try {
        event = JSON.parse(line)
      } catch {
        return
      }
      if (event.event === 'status') {
        console.log(chalk`{blue [bench]} ${event.message}`)
      } else if (event.event === 'error') {
        console.error(chalk`{red Error:} ${event.message}`)
      }
    }).catch(() => {})
  }

  const code = await proc.exited
  if (code !== 0 && code !== null) {
    throw new Error(`sand bench exited with code ${code}`)
  }

  const reportPath = path.join(PROJECT_ROOT, '.sandstone', 'bench-result.json')
  if (!existsSync(reportPath)) return undefined
  return JSON.parse(await Bun.file(reportPath).text()) as BenchReport
}

async function main(): Promise<void> {
  const name = process.argv[2]
  if (!name) {
    console.error(chalk`{red Error:} Usage: bun test:bench <benchmark-name>`)
    process.exit(2)
  }

  const benchmarkPath = path.join(BENCH_DIR, `${name}.ts`)
  if (!existsSync(benchmarkPath)) {
    console.error(chalk`{red Error:} No benchmark named "{bold ${name}}" (expected ${benchmarkPath})`)
    process.exit(2)
  }

  const { client, owned } = await ensureServer()

  try {
    const pack = createSandstonePack({
      workingDir: PROJECT_ROOT,
      namespace: NAMESPACE,
      packUid: 'bench0001',
      packOptions: {
        datapack: {
          packFormat: 121,
          description: [{ text: 'Sandstone integrated benchmarks', color: 'gold' }],
        },
      },
    })

    const module = await import(benchmarkPath)
    const spec = module.default as BenchmarkSpec | undefined
    if (!spec || typeof spec.a !== 'function' || typeof spec.b !== 'function') {
      throw new Error(`${name}.ts must default-export an object with an "a" and a "b" function.`)
    }

    const a = spec.a(pack)
    const b = spec.b(pack)
    const setup = spec.setup?.(pack)
    const cleanup = spec.cleanup?.(pack)

    await deployBenchmarkPack(client, pack)

    console.log(chalk`{blue [bench]} Reloading server resources...`)
    await client.reloadResources()

    const config = {
      a: a.name,
      b: b.name,
      iterationsPerTick: spec.iterationsPerTick,
      setup: setup?.name,
      cleanup: cleanup?.name,
    }
    const configPath = path.join(PROJECT_ROOT, '.sandstone', 'bench.json')
    await mkdir(path.dirname(configPath), { recursive: true })
    await writeFile(configPath, JSON.stringify(config, null, 2))

    console.log(chalk`{blue [bench]} Benchmarking {cyan ${a.name}} against {cyan ${b.name}}`)
    console.log('')

    const report = await runBenchmark(configPath, process.argv.slice(3))
    if (report) {
      printReport(report)
    }
  } finally {
    client.close()
    if (owned) {
      console.log(chalk`{blue [bench]} Shutting down test server...`)
      await stopServer()
    }
  }
}

await main()
