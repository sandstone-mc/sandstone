/**
 * Standalone type generation script with retry logic for stale types.
 */

import { join } from 'path'
import { rm } from 'fs/promises'

const rootDir = join(import.meta.dir, '..')
const typesDir = join(rootDir, 'types')

/**
 * Run TypeScript compiler to generate declarations in types/.
 *
 * If an "Excessive complexity" error is detected (stale types issue),
 * deletes the types directory and retries once.
 */
async function runTsc(isRetry = false): Promise<void> {
  const tsc = Bun.spawn(['bun', 'tsc', '-p', 'tsconfig.build.json'], {
    cwd: rootDir,
    stdout: 'inherit',
    stderr: 'pipe',
  })

  const stderrText = await new Response(tsc.stderr).text()
  const exitCode = await tsc.exited

  if (exitCode !== 0) {
    if (!isRetry && stderrText.includes('Excessive complexity')) {
      console.log('Detected stale types (Excessive complexity error), cleaning and retrying...')
      await rm(typesDir, { recursive: true, force: true })
      return runTsc(true)
    }

    if (stderrText) {
      console.error(stderrText)
    }
    throw new Error(`TypeScript compilation failed with exit code ${exitCode}`)
  }

  if (stderrText) {
    console.error(stderrText)
  }
}

runTsc().catch((err) => {
  console.error('Type generation error:', err)
  process.exit(1)
})
