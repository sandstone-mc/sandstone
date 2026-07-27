/**
 * Verify that every relative import path in the bundled `dist/_internal/types/`
 * tree resolves to a real file. Catches library builder regressions like
 * `./variables.js` (which doesn't exist — only `./variables/index.js` does).
 *
 * Usage:
 *   bun scripts/check-import-paths.ts
 */

import { readdir, readFile, stat } from 'fs/promises'
import { dirname, join, relative } from 'path'

const DIST_TYPES = 'dist/_internal/types'

type Issue = { file: string; importPath: string; reason: string }

const walk = async function* (dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else if (entry.isFile() && entry.name.endsWith('.d.ts')) yield full
  }
}

const exists = async (path: string): Promise<boolean> => {
  try {
    await stat(path)
    return true
  } catch {
    return false
  }
}

/**
 * Resolve a relative import path from `fromFile` to a target file path
 * inside the bundle. Returns the resolved path or `null` if the path
 * clearly cannot resolve.
 */
const resolveImport = async (
  fromFile: string,
  importPath: string,
): Promise<string | null> => {
  if (!importPath.startsWith('./') && !importPath.startsWith('../')) return null
  const fromDir = dirname(fromFile)
  const base = join(fromDir, importPath)
  // Direct file match
  if (await exists(base)) return base
  // Try as directory with index.d.ts
  if (await exists(join(base, 'index.d.ts'))) return join(base, 'index.d.ts')
  // Try replacing .js with .d.ts (the .d.ts form)
  if (base.endsWith('.js')) {
    const dts = base.slice(0, -3) + '.d.ts'
    if (await exists(dts)) return dts
  }
  return null
}

const main = async () => {
  const issues: Issue[] = []
  let scannedFiles = 0
  let scannedImports = 0

  for await (const dtsPath of walk(DIST_TYPES)) {
    scannedFiles++
    const content = await readFile(dtsPath, 'utf8')
    // Match relative import specifiers: `from "./X"` / `from "../X"`,
    // `import("./X")` (inline), `import type("./X")` (inline type imports).
    const re = /(?<=(?:from\s+|import\s*\(\s*|import\s+type\s*\(\s*))(["'])(\.{1,2}\/[^"']+)\1/g
    for (const match of content.matchAll(re)) {
      const path = match[2]
      scannedImports++
      const resolved = await resolveImport(dtsPath, path)
      if (resolved === null) {
        issues.push({
          file: relative('.', dtsPath),
          importPath: path,
          reason: 'no matching file or directory/index.d.ts',
        })
      }
    }
  }

  process.stdout.write(`Scanned ${scannedFiles} .d.ts file(s), ${scannedImports} relative import(s).\n`)
  if (issues.length === 0) {
    process.stdout.write('\x1b[32mAll import paths resolve to real files.\x1b[0m\n')
    return
  }
  process.stdout.write(`\x1b[31m${issues.length} unresolvable import(s):\x1b[0m\n`)
  for (const i of issues) {
    process.stdout.write(`  ${i.file}\n    → ${i.importPath}  (${i.reason})\n`)
  }
  process.exit(1)
}

try {
  await main()
} catch (err) {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
}
