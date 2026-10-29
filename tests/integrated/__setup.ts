import * as path from 'node:path'
import { mkdir, readdir, rm, writeFile } from 'node:fs/promises'
import { afterAll, beforeAll, test as bunTest } from 'bun:test'
import { createSandstonePack, type SandstonePack } from '../../dist/exports/index.js'
import type { _RawTestMCFunctionClass, TestDirectives, TestMCFunctionClass } from 'sandstone/test'
import { Client, readEndpoint, NULL_LOGGER } from 'sandstone-cli/connect'
import type { EndpointFile } from 'sandstone-cli/connect'
import {
  buildTestManifest,
  renderTestEvent,
  formatDiagnostic,
  type ErrorTrace,
  type TestEvent,
  type TestsManifest,
} from 'sandstone-cli/test'
import chalk from 'chalk-template'

const PROJECT_ROOT = path.resolve(import.meta.dir, '.server')
const DATA_PACK_DIR_NAME = 'integrated_tests'
const MC_WORLD_DATAPACKS = path.join(PROJECT_ROOT, '.sandstone', 'mc-server', 'world', 'datapacks')

function resolveCliBin() {
  try {
    const cliPkgPath = require.resolve('sandstone-cli/package.json')
    const cliBin = require(cliPkgPath).bin?.sand
    if (typeof cliBin === 'string') {
      return require.resolve(cliBin, { paths: [path.dirname(cliPkgPath)] })
    }
  } catch {}
  return path.resolve(import.meta.dir, '../../../sandstone-cli/lib/index.js')
}
const CLI_BIN = resolveCliBin()

const STARTUP_DEADLINE_MS = 120_000
const SHUTDOWN_GRACE_MS = 240_000

type TestResultBase = Omit<Extract<TestEvent, { event: 'test_result' }>, 'event'>

type TestResult = TestResultBase & (
  | {
      buildSucceeded: false,
    }
  | {
      buildSucceeded: true,
      pack: SandstonePack,
      tests: _RawTestMCFunctionClass[],
      files: Record<string, string>,
      raw: Record<string, string>,
    }
)

interface RegisterTestOptions {
  description?: string
  optional?: boolean
}

type CreateFn = (body: () => void, directives?: TestDirectives) => TestMCFunctionClass

interface BuildEntry {
  buildCb: (create: CreateFn, pack: SandstonePack) => TestMCFunctionClass
  resolve: (r: TestResult) => void
  description?: string
  optional?: boolean
}

let expectedTotal = 0
let daemonProc: Bun.Subprocess | null = null
let daemonReady: Promise<{ url: string }> | null = null
let ensureLiveMCCalled = false
const registeredTests = new Map<string, BuildEntry>()
let runStarted = false
let runFinished: Promise<void> | null = null
let lastTestResultAtMs: number | null = null
let testsRunningAtMs: number | null = null
let graceTimer: ReturnType<typeof setTimeout> | null = null
let graceTimerScheduled = false

function getOrSetExpectedTotal(value?: number) {
  if (value !== undefined && expectedTotal === 0) expectedTotal = value
  return expectedTotal
}

async function ensureDaemonReady(): Promise<void> {
  if (daemonReady !== null) return
  await clearWorldDatapacks()
  const existing = await readEndpoint(PROJECT_ROOT)
  let adopted = false
  if (existing !== null) {
    try {
      const probe = await Client.open({
        endpoint: existing,
        requestTimeoutMs: 5_000,
        logger: NULL_LOGGER,
      })
      probe.close()
      daemonReady = Promise.resolve({ url: existing.url })
      adopted = true
    } catch {}
  }
  if (adopted) {
    console.log(chalk`{blue [test]} Connected to existing test server`)
  } else {
    console.log(chalk`{blue [test]} Test server starting up...`)
    daemonReady = startDaemon()
    await daemonReady
    console.log(chalk`{blue [test]} Test server now ready & connected`)
  }
}

function triggerFinishRunIfReady(): void {
  if (registeredTests.size >= getOrSetExpectedTotal() && !runStarted) {
    finishRun().catch(() => {})
  }
}

export function ensureLiveMC() {
  ensureLiveMCCalled = true
  if (daemonReady !== null) return

  beforeAll(async () => {
    await ensureDaemonReady()
  }, STARTUP_DEADLINE_MS)

  afterAll(async () => {
    if (daemonProc !== null) {
      console.log(chalk`{blue [test]} Shutting down test server...`)
    }
    if (runFinished !== null) {
      try { await runFinished } catch {}
    }
    if (daemonProc !== null) {
      console.log(chalk`{blue [test]} Test server finished shutting down`)
    }
  }, SHUTDOWN_GRACE_MS)
}

/**
 * Call this at the bottom of `index.test.ts` (after every
 * `register*Tests()` call) to signal that all tests are registered
 * and the run can start. Replaces the old `expectedCount` mechanic —
 * the grace timer / count-watching is fragile under Bun's
 * concurrent runner (N>20 tests queue up and never register before
 * the timer fires). Explicit start is reliable.
 */
export function startTests() {
  if (runStarted) return
  runStarted = true
  if (runFinished === null) finishRun().catch(() => {})
}

export function registerTest(name: string, buildCb: (create: CreateFn, pack: SandstonePack) => TestMCFunctionClass, options?: RegisterTestOptions): Promise<TestResult> {
  if (registeredTests.has(name)) {
    throw new Error(`Duplicate test name: ${name}`)
  }

  if (runStarted) {
    const message = 'Registration arrived after run started'
    console.log(chalk`{red [test failed]} ${name}: ${message}`)
    return Promise.resolve({
      buildSucceeded: false,
      name,
      passed: false,
      optional: false,
      ticks_elapsed: 0,
      error: { message },
      description: options?.description,
    })
  }

  const promise = new Promise<TestResult>((resolve) => {
    const fullName = name.includes(':') ? name : `${DATA_PACK_DIR_NAME}:${name}`
    registeredTests.set(fullName, {
      buildCb,
      resolve,
      description: options?.description,
      optional: options?.optional,
    })

    // Run start is driven exclusively by `startTests()` from
    // `index.test.ts` — the auto-start heuristic (count vs
    // expectedTotal) was fragile and now obsolete.
  })

  return promise
}

export function test(
  description: string,
  testName: string,
  buildCb: (create: CreateFn, pack: SandstonePack) => TestMCFunctionClass,
  assertCb: (r: TestResult) => void | Promise<void>,
  timeoutMs = 120_000,
) {
  if (!ensureLiveMCCalled) {
    throw new Error(`test("${testName}") called before ensureLiveMC(). ensureLiveMC must be called once, before any test() registrations.`)
  }

  // Register the test SYNCHRONOUSLY at call time (not inside the test
  // body). This way every `test(...)` call lands in `registeredTests`
  // before `startTests()` fires, regardless of how Bun schedules the
  // test bodies. The test body just waits for the result.
  const resultPromise = registerTest(testName, buildCb, { description })

  bunTest.concurrent(description, async () => {
    if (daemonReady === null) throw new Error('daemonReady was not set before test body ran')
    await daemonReady
    const r = await resultPromise
    await assertCb(r)
  }, timeoutMs)
}

async function startDaemon() {
  await ensureTestingPackDir()

  // Mirror the template's host config (`sandstone-template/sandstone.config.ts`)
  // — integrated host with packtest disabled + the additionalMods jar.
  // Passed via CLI args instead of a `sandstone.config.ts` so the
  // test project doesn't need its own config file.
  const hostConfig = JSON.stringify({
    mods: {
      packtest: false,
      additionalMods: [{
        url: 'https://github.com/sandstone-mc/packtest-mod/releases/download/2.7.0/packtest-2.7.0.jar',
      }],
    },
  })

  const proc = Bun.spawn([
    CLI_BIN,
    'connect',
    '--host-type', 'integrated',
    '--host-config', hostConfig,
  ], {
    cwd: PROJECT_ROOT,
    stdout: 'pipe',
    stderr: 'pipe',
    env: { ...process.env, CONNECT_RELOAD: '0' },
  })
  daemonProc = proc

  if (proc.stderr !== null && typeof proc.stderr !== 'number') {
    pipeStream(proc.stderr).catch(() => {})
  }

  return await waitForEndpointMarker(proc)
}

async function waitForEndpointMarker(proc: Bun.Subprocess) {
  return new Promise<{ url: string }>((resolve, reject) => {
    const deadline = setTimeout(() => {
      reject(new Error(`sand connect did not report endpoint file within ${STARTUP_DEADLINE_MS}ms`))
      try { proc.kill('SIGTERM') } catch {}
    }, STARTUP_DEADLINE_MS)

    if (proc.stdout === null || typeof proc.stdout === 'number') {
      clearTimeout(deadline)
      reject(new Error('sand connect stdout is not piped (cannot detect endpoint marker)'))
      try { proc.kill('SIGTERM') } catch {}
      return
    }

    readLineStream(proc.stdout!, (line) => {
      const stripped = Bun.stripANSI(line)
      if (stripped.includes('[connect] endpoint file:')) {
        clearTimeout(deadline)
        readEndpoint(PROJECT_ROOT)
          .then((endpoint: EndpointFile | null) => {
            if (!endpoint) {
              reject(new Error('Endpoint marker seen but .sandstone/connect.url could not be parsed'))
              try { proc.kill('SIGTERM') } catch {}
              return
            }
            resolve({ url: endpoint.url })
          })
          .catch(reject)
      }
    }).catch(() => {})

    proc.exited.then((code) => {
      if (code !== 0 && code !== null) {
        clearTimeout(deadline)
        reject(new Error(`sand connect exited with code ${code} before reporting endpoint`))
      }
    }).catch(() => {})
  })
}

async function readLineStream(
  stream: ReadableStream<Uint8Array>,
  onLine: (line: string) => void,
) {
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

async function pipeStream(stream: ReadableStream<Uint8Array>) {
  await readLineStream(stream, () => {})
}

async function ensureTestingPackDir() {
  await mkdir(MC_WORLD_DATAPACKS, { recursive: true }).catch(() => {})
}

async function clearWorldDatapacks() {
  let entries: string[]
  try {
    entries = await readdir(MC_WORLD_DATAPACKS)
  } catch {
    return
  }
  await Promise.all(entries.map((entry) => rm(path.join(MC_WORLD_DATAPACKS, entry), { recursive: true, force: true })))
}

async function finishRun() {
  runFinished = (async () => {
    while (daemonReady === null) {
      await new Promise<void>((r) => setTimeout(r, 50))
    }
    await daemonReady
    const endpointFile = await readEndpoint(PROJECT_ROOT)
    if (!endpointFile) {
      throw new Error('Endpoint file missing after daemon reported ready')
    }

    const client = await Client.open({
      endpoint: endpointFile,
      requestTimeoutMs: 30_000,
      logger: NULL_LOGGER,
    })

    try {
      console.log(chalk`{blue [test]} Building tests...`)

      const pack = createSandstonePack({
        workingDir: PROJECT_ROOT,
        namespace: 'integrated_tests',
        packUid: 'integ0001',
        packOptions: {
          datapack: {
            packFormat: 121,
            description: [{ text: 'Sandstone integrated tests', color: 'gold' }],
          },
        },
        enableTests: true,
      })

      for (const [name, entry] of registeredTests.entries()) {
        const sizeBefore = pack.Test.tests.size
        const create: CreateFn = (body, directives) =>
          pack.Test.create(name, body, {
            description: entry.description,
            ...(directives !== undefined ? { directives } : {}),
          })
        try {
          entry.buildCb(create, pack)
        } catch (e) {
          const message = e instanceof Error ? e.message : String(e)
          console.log(chalk`{red [test failed]}`, name, e)
          entry.resolve({
            buildSucceeded: false,
            name,
            passed: false,
            optional: entry.optional ?? false,
            ticks_elapsed: 0,
            error: { message },
            description: entry.description,
          })
          continue
        }
        const created = pack.Test.tests.size - sizeBefore
        if (created !== 1) {
          const message = created === 0
            ? `Test was ignored: buildCb did not register any Test.create() call — expected exactly 1, got 0.`
            : `Test was ignored: buildCb registered ${created} TestMCFunctions — expected exactly 1.`
          console.log(chalk`{red [test failed]}`, name, message)
          entry.resolve({
            buildSucceeded: false,
            name,
            passed: false,
            optional: entry.optional ?? false,
            ticks_elapsed: 0,
            error: { message },
            description: entry.description,
          })
        }
      }

      const compiled = pack.compile()
      compiled.set('pack.mcmeta', JSON.stringify(pack.dataPack().packMcmeta, null, 2))

      const manifest: TestsManifest = buildTestManifest(pack)
      await writeFile(
        path.join(PROJECT_ROOT, '.sandstone', 'tests.json'),
        JSON.stringify(manifest, null, 2),
      )

      await mkdir(path.join(MC_WORLD_DATAPACKS, DATA_PACK_DIR_NAME), { recursive: true })

      const relFiles: Record<string, string> = {}
      for (const [absPath, content] of compiled.entries()) {
        const inDatapack = absPath.startsWith('datapack/') ? absPath.slice('datapack/'.length) : absPath
        await client.writeFile({
          path: path.posix.join('world', 'datapacks', DATA_PACK_DIR_NAME, inDatapack),
          data: content,
        })
        relFiles[inDatapack] = content
      }

      const testNodeByName = new Map<string, _RawTestMCFunctionClass>()
      for (const { resource } of pack.Test.tests) {
        testNodeByName.set(resource.name, resource)
      }

      const attach: AttachContext = {
        pack,
        files: relFiles,
        byName(name) {
          const resource = testNodeByName.get(name)
          if (resource === undefined) return undefined
          const [ns, id] = name.split(':')
          const mcPath = `data/${ns}/test/${id}.mcfunction`
          const mcContent = relFiles[mcPath]
          return {
            tests: [resource],
            raw: mcContent !== undefined ? { [name]: mcContent } : {},
          }
        },
      }

      console.log(chalk`{blue [test]} Build complete, resetting MC state...`)
      await client.clearSandstoneMCState()
      console.log(chalk`{blue [test]} MC State reset, reloading...`)
      await client.reloadResources()
      console.log(chalk`{blue [test]} Reload complete, testing...`)
      await runJsonTestProcess(registeredTests, attach)
    } finally {
      client.close()
    }
  })()

  try {
    await runFinished
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    console.log(chalk`{red [test failed]}`, e)
    for (const [name, entry] of registeredTests.entries()) {
      entry.resolve({
        buildSucceeded: false,
        name,
        passed: false,
        optional: entry.optional ?? false,
        ticks_elapsed: 0,
        error: { message },
        description: entry.description,
      })
    }
  }
}

interface AttachContext {
  pack: SandstonePack
  files: Record<string, string>
  byName: (name: string) => { tests: _RawTestMCFunctionClass[]; raw: Record<string, string> } | undefined
}

async function runJsonTestProcess(
  pending: Map<string, BuildEntry>,
  attach: AttachContext,
) {
  const proc = Bun.spawn(
    [
      CLI_BIN,
      'test',
      '--json',
      '--path', PROJECT_ROOT,
      // Test mcfunctions are written into the test server's world
      // datapacks dir, not the standard `.sandstone/output/`. Point
      // `sand test`'s runtime trace resolver at the right directory so
      // failure stacks point at real on-disk files.
      '--output-dir', path.join(MC_WORLD_DATAPACKS, DATA_PACK_DIR_NAME),
    ],
    {
    stdout: 'pipe',
    stderr: 'pipe',
    env: process.env,
  })

  if (proc.stderr !== null && typeof proc.stderr !== 'number') {
    pipeStream(proc.stderr).catch(() => {})
  }

  if (proc.stdout !== null && typeof proc.stdout !== 'number') {
    await readLineStream(proc.stdout, (line) => {
      if (!line.trim().startsWith('{')) return
      let event: TestEvent
      try {
        event = JSON.parse(line)
      } catch {
        return
      }
      if (!isObject(event)) return

      if (event.event === 'status' && event.type === 'tests_running') {
        testsRunningAtMs = Date.now()
        return
      }

      if (event.event === 'server_log' || event.event === 'error' || event.event === 'test_log') {
        for (const rendered of renderTestEvent(event)) {
          process.stdout.write(`${rendered}\n`)
        }
        return
      }

      if (event.event !== 'test_result') return
      if (event.error !== undefined) {
        const trace: ErrorTrace[] = []
        if (event.error.server_trace !== undefined) trace.push(event.error.server_trace)
        if (event.error.build_trace !== undefined) trace.push(event.error.build_trace)
        process.stdout.write(`${formatDiagnostic(event.error.message, trace, {
          keyword: 'error',
          keywordColor: 'red',
          position: event.error.position,
        })}\n`)
      }

      const entry = pending.get(event.name)
      if (entry === undefined) return
      const now = Date.now()
      const baseline = lastTestResultAtMs ?? testsRunningAtMs
      const elapsedMs = baseline === null || baseline === undefined ? 0 : now - baseline
      lastTestResultAtMs = now
      console.log(chalk`\n{gray Test "${event.description ?? event.name}" finished. [{bold ${event.ticks_elapsed}t}] [{bold ${elapsedMs}ms} (inline)]}`)
      const extras = attach.byName(event.name)
      entry.resolve({
        ...event,
        buildSucceeded: true,
        pack: attach.pack,
        files: attach.files,
        tests: extras?.tests ?? [],
        raw: extras?.raw ?? {},
      })
    }).catch(() => {})
  }

  const code = await proc.exited
  if (code !== 0 && code !== null) {
    const message = `sand test --json exited with code ${code}`
    console.log(chalk`{red [test failed]} ${message}`)
    for (const [name, entry] of pending.entries()) {
      entry.resolve({
        buildSucceeded: false,
        name,
        passed: false,
        optional: entry.optional ?? false,
        ticks_elapsed: 0,
        error: { message },
        description: entry.description,
      })
    }
  }
}

function isObject(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

process.on('exit', () => {
  try {
    if (daemonProc !== null && daemonProc.exitCode === null) {
      daemonProc.kill('SIGTERM')
    }
  } catch {}
})
