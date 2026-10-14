import { spawn } from 'bun'
import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const PROJECT_ROOT = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  '..',
  'tests/integrated/.server',
)

// Resolve `sand` — first try the linked `sandstone-cli` (workspace flow),
// fall back to the direct sibling-repo path.
function resolveSand(): string {
  try {
    const cliPkgPath = require.resolve('sandstone-cli/package.json')
    const cliBin = (require(cliPkgPath) as { bin?: { sand?: string } }).bin?.sand
    if (typeof cliBin === 'string') {
      return require.resolve(cliBin, { paths: [path.dirname(cliPkgPath)] })
    }
  } catch {}
  return path.resolve(
    path.dirname(new URL(import.meta.url).pathname),
    '../../sandstone-cli/lib/index.js',
  )
}

async function up(): Promise<void> {
  await fs.mkdir(PROJECT_ROOT, { recursive: true })
  const sand = resolveSand()
  // Detached process — its stdout/stderr go to a log file under the pack dir
  // so the user can tail it without it being attached to the shell.
  const proc = spawn({
    cmd: [sand, 'connect'],
    cwd: PROJECT_ROOT,
    stdout: 'ignore',
    stderr: 'ignore',
    detached: true,
  })
  // Detach from the parent process group so the daemon survives the parent.
  proc.unref()
  console.log(`Spawned sand connect (pid=${proc.pid}) in ${PROJECT_ROOT}`)
}

async function down(): Promise<void> {
  const sand = resolveSand()
  const proc = spawn({
    cmd: [sand, 'connect', '--shutdown'],
    cwd: PROJECT_ROOT,
    stdout: 'inherit',
    stderr: 'inherit',
  })
  const code = await proc.exited
  process.exit(code ?? 0)
}

const cmd = process.argv[2]
if (cmd === 'up') {
  await up()
} else if (cmd === 'down') {
  await down()
} else {
  console.error(`Usage: bun scripts/test-server.ts <up|down>`)
  process.exit(2)
}