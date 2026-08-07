import fs from 'node:fs'
import path from 'node:path'

type CaseName = 'control' | 'selector'

type Options = {
  compiler: 'ts6' | 'ts7'
  rounds: number
  warmups: number
  json: boolean
}

type Sample = {
  case: CaseName
  wallMs: number
  totalMs: number
  checkMs: number
  memoryKiB: number
  types: number
  instantiations: number
}

type Round = {
  round: number
  order: `${CaseName}-${CaseName}`
  control: Sample
  selector: Sample
}

const ROOT = path.resolve(import.meta.dir, '..')
const BENCHMARK_DIR = path.join(ROOT, '.temp', 'selector-type-benchmark')
const NODE = Bun.which('node')

const packageVersion = (packageName: string): string => {
  const packageJson = path.join(
    ROOT,
    'node_modules',
    ...packageName.split('/'),
    'package.json',
  )
  return JSON.parse(fs.readFileSync(packageJson, 'utf8')).version
}

const COMPILERS = {
  ts6: {
    entry: path.join(
      ROOT,
      'node_modules',
      '@typescript',
      'typescript6',
      'bin',
      'tsc6',
    ),
    version: packageVersion('@typescript/typescript6'),
  },
  ts7: {
    entry: path.join(ROOT, 'node_modules', 'typescript', 'bin', 'tsc'),
    version: packageVersion('typescript'),
  },
} as const

const FIXTURES: Record<CaseName, string> = {
  control: `import { MCFunction, tellraw } from 'sandstone'

MCFunction('test', () => {
  tellraw('@a', 'Hello, world!')
})
`,
  selector: `import { MCFunction, Selector, tellraw } from 'sandstone'

MCFunction('test', () => {
  tellraw(
    Selector('@a', {
      advancements: {
        'story/obtain_armor': {
          iron_helmet: true,
        },
      },
    }),
    'Hello, world!',
  )
})
`,
}

const usage = `Usage: bun scripts/benchmark-selector-types.ts [options]

Options:
  --compiler C  Compiler to measure: ts6 or ts7 (default: ts7)
  --rounds N    Measured AB/BA pairs (default: 10)
  --warmups N   Discarded AB/BA pairs (default: 2)
  --json        Emit machine-readable JSON
  --help        Show this message
`

const readCount = (flag: string, raw: string | undefined, allowZero = false): number => {
  const value = Number(raw)
  if (!Number.isInteger(value) || value < (allowZero ? 0 : 1)) {
    throw new Error(`${flag} expects ${allowZero ? 'a non-negative' : 'a positive'} integer`)
  }
  return value
}

const parseOptions = (args: string[]): Options => {
  const options: Options = {
    compiler: 'ts7',
    rounds: 10,
    warmups: 2,
    json: false,
  }

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index]
    if (argument === '--compiler') {
      const compiler = args[index + 1]
      if (compiler !== 'ts6' && compiler !== 'ts7') {
        throw new Error('--compiler expects "ts6" or "ts7"')
      }
      options.compiler = compiler
      index += 1
    } else if (argument === '--rounds') {
      options.rounds = readCount(argument, args[index + 1])
      index += 1
    } else if (argument === '--warmups') {
      options.warmups = readCount(argument, args[index + 1], true)
      index += 1
    } else if (argument === '--json') {
      options.json = true
    } else if (argument === '--help') {
      console.log(usage)
      process.exit(0)
    } else {
      throw new Error(`Unknown option: ${argument}\n\n${usage}`)
    }
  }

  return options
}

const prepareFixtures = () => {
  const declarationEntry = path.join(ROOT, 'dist', 'exports', 'index.d.ts')
  if (!fs.existsSync(declarationEntry)) {
    throw new Error('Built declarations are missing. Run `bun dev:build --silent` first.')
  }

  fs.mkdirSync(BENCHMARK_DIR, { recursive: true })
  for (const [name, source] of Object.entries(FIXTURES) as [CaseName, string][]) {
    fs.writeFileSync(path.join(BENCHMARK_DIR, `${name}.ts`), source)
    fs.writeFileSync(
      path.join(BENCHMARK_DIR, `tsconfig.${name}.json`),
      JSON.stringify(
        {
          compilerOptions: {
            target: 'ESNext',
            module: 'ESNext',
            moduleResolution: 'Bundler',
            strict: true,
            noEmit: true,
            skipLibCheck: true,
          },
          files: [`${name}.ts`],
        },
        null,
        2,
      ),
    )
  }
}

const metric = (output: string, label: string, unit = ''): number => {
  const match = output.match(new RegExp(`^${label}:\\s+([0-9.]+)${unit}$`, 'm'))
  if (!match) {
    throw new Error(`Could not read "${label}" from TypeScript diagnostics:\n${output}`)
  }
  return Number(match[1])
}

const runCase = async (
  name: CaseName,
  compiler: Options['compiler'],
): Promise<Sample> => {
  if (!NODE) {
    throw new Error('Node.js is required to run the installed TypeScript compiler.')
  }
  const started = performance.now()
  const compilerEntry = COMPILERS[compiler].entry
  const child = Bun.spawn(
    [
      NODE,
      compilerEntry,
      '-p',
      path.join(BENCHMARK_DIR, `tsconfig.${name}.json`),
      '--extendedDiagnostics',
      '--pretty',
      'false',
    ],
    {
      cwd: ROOT,
      stdout: 'pipe',
      stderr: 'pipe',
    },
  )
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ])
  const wallMs = performance.now() - started

  if (exitCode !== 0) {
    throw new Error(
      `TypeScript failed for ${name} (exit ${exitCode}):\n${stdout}${stderr}`,
    )
  }

  return {
    case: name,
    wallMs,
    totalMs: metric(stdout, 'Total time', 's') * 1_000,
    checkMs: metric(stdout, 'Check time', 's') * 1_000,
    memoryKiB: metric(stdout, 'Memory used', 'K'),
    types: metric(stdout, 'Types'),
    instantiations: metric(stdout, 'Instantiations'),
  }
}

const median = (values: number[]): number => {
  const sorted = [...values].sort((left, right) => left - right)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 1
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2
}

const runPair = async (
  round: number,
  compiler: Options['compiler'],
): Promise<Round> => {
  const order: [CaseName, CaseName] = round % 2 === 1
    ? ['control', 'selector']
    : ['selector', 'control']
  const samples = new Map<CaseName, Sample>()
  for (const name of order) {
    samples.set(name, await runCase(name, compiler))
  }

  return {
    round,
    order: order.join('-') as Round['order'],
    control: samples.get('control')!,
    selector: samples.get('selector')!,
  }
}

const main = async () => {
  const options = parseOptions(Bun.argv.slice(2))
  prepareFixtures()

  for (let warmup = 1; warmup <= options.warmups; warmup += 1) {
    await runPair(warmup, options.compiler)
  }

  const rounds: Round[] = []
  for (let round = 1; round <= options.rounds; round += 1) {
    rounds.push(await runPair(round, options.compiler))
  }

  const wallRatios = rounds.map(({ control, selector }) => selector.wallMs / control.wallMs)
  const totalRatios = rounds.map(({ control, selector }) => selector.totalMs / control.totalMs)
  const summary = {
    environment: {
      bun: Bun.version,
      compiler: options.compiler,
      compilerVersion: COMPILERS[options.compiler].version,
      platform: `${process.platform}-${process.arch}`,
    },
    rounds: options.rounds,
    warmups: options.warmups,
    controlWallMedianMs: median(rounds.map(({ control }) => control.wallMs)),
    selectorWallMedianMs: median(rounds.map(({ selector }) => selector.wallMs)),
    controlCheckMedianMs: median(rounds.map(({ control }) => control.checkMs)),
    selectorCheckMedianMs: median(rounds.map(({ selector }) => selector.checkMs)),
    pairedWallRatioMedian: median(wallRatios),
    pairedTotalRatioMedian: median(totalRatios),
    selectorSlowerWallRounds: rounds.filter(
      ({ control, selector }) => selector.wallMs > control.wallMs,
    ).length,
    selectorSlowerTotalRounds: rounds.filter(
      ({ control, selector }) => selector.totalMs > control.totalMs,
    ).length,
    controlMemoryMedianKiB: median(rounds.map(({ control }) => control.memoryKiB)),
    selectorMemoryMedianKiB: median(rounds.map(({ selector }) => selector.memoryKiB)),
    controlTypesMedian: median(rounds.map(({ control }) => control.types)),
    selectorTypesMedian: median(rounds.map(({ selector }) => selector.types)),
    controlInstantiationsMedian: median(
      rounds.map(({ control }) => control.instantiations),
    ),
    selectorInstantiationsMedian: median(
      rounds.map(({ selector }) => selector.instantiations),
    ),
  }

  if (options.json) {
    console.log(JSON.stringify({ summary, rounds }, null, 2))
    return
  }

  console.log(
    `Selector type-check benchmark with ${options.compiler} `
      + `(${options.rounds} measured pairs, `
      + `${options.warmups} discarded warmup pairs)`,
  )
  console.log('round  order               control ms  selector ms  wall ratio')
  for (const round of rounds) {
    console.log(
      [
        String(round.round).padStart(5),
        round.order.padEnd(19),
        round.control.wallMs.toFixed(1).padStart(10),
        round.selector.wallMs.toFixed(1).padStart(11),
        `${(round.selector.wallMs / round.control.wallMs).toFixed(3)}x`.padStart(11),
      ].join('  '),
    )
  }
  console.log('')
  console.log(`Median wall ratio:  ${summary.pairedWallRatioMedian.toFixed(3)}x`)
  console.log(`Median compiler ratio: ${summary.pairedTotalRatioMedian.toFixed(3)}x`)
  console.log(
    `Wall slower rounds: ${summary.selectorSlowerWallRounds}/${summary.rounds}`,
  )
  console.log(
    `Compiler slower rounds: `
      + `${summary.selectorSlowerTotalRounds}/${summary.rounds}`,
  )
  console.log(
    `Check ms (control/selector): `
      + `${summary.controlCheckMedianMs}/${summary.selectorCheckMedianMs}`,
  )
  console.log(
    `Types (control/selector): `
      + `${summary.controlTypesMedian}/${summary.selectorTypesMedian}`,
  )
  console.log(
    `Instantiations (control/selector): `
      + `${summary.controlInstantiationsMedian}/${summary.selectorInstantiationsMedian}`,
  )
  console.log(
    `Memory KiB (control/selector): `
      + `${summary.controlMemoryMedianKiB}/${summary.selectorMemoryMedianKiB}`,
  )
}

await main()
