/**
 * Type generation with retry logic for stale types.
 *
 * Can be run standalone or imported by build.ts.
 */

import { join } from 'path'
import { rm } from 'fs/promises'

const rootDir = join(import.meta.dir, '..')
const typesDir = join(rootDir, 'types')

export interface RunTscOptions {
  /** Log function (defaults to console.log) */
  log?: (...args: unknown[]) => void
}

/**
 * Run TypeScript compiler to generate declarations in types/.
 *
 * If an "Excessive complexity" error is detected (stale types issue),
 * deletes the types directory and retries once.
 */
export async function runTsc(options: RunTscOptions = {}, isRetry = false): Promise<void> {
  const log = options.log ?? console.log

  const tsc = Bun.spawn(['bun', 'tsc', '-p', 'tsconfig.build.json'], {
    cwd: rootDir,
    stdout: 'pipe',
    stderr: 'pipe',
  })

  // TypeScript sends errors to stdout, not stderr
  const [stdoutText, stderrText] = await Promise.all([
    new Response(tsc.stdout).text(),
    new Response(tsc.stderr).text(),
  ])
  const exitCode = await tsc.exited

  if (exitCode !== 0) {
    if (!isRetry && stdoutText.includes('Excessive complexity')) {
      log('  Detected stale types (Excessive complexity error), cleaning and retrying...')
      await rm(typesDir, { recursive: true, force: true })
      return runTsc(options, true)
    }

    // Print the output since we captured it
    if (stdoutText) {
      console.log(stdoutText)
    }
    if (stderrText) {
      console.error(stderrText)
    }
    throw new Error(`TypeScript compilation failed with exit code ${exitCode}`)
  }

  // Print any output even on success
  if (stdoutText) {
    console.log(stdoutText)
  }
  if (stderrText) {
    console.error(stderrText)
  }
}

// Run standalone if executed directly
if (import.meta.main) {
  runTsc().catch((err) => {
    console.error('Type generation error:', err)
    process.exit(1)
  })
}
