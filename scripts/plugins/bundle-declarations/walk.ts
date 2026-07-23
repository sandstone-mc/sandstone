/**
 * Helpers for walking the source tree.
 */
import { readdir, stat } from 'fs/promises'
import { join } from 'path'

/** Recursively yield every `*.d.ts` file under `dir`. */
export async function* walkDtsFiles(dir: string): AsyncGenerator<string> {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) yield* walkDtsFiles(full)
    else if (entry.isFile() && entry.name.endsWith('.d.ts')) yield full
  }
}

/** Recursively yield the relative path of every subdirectory of `dir`. */
export async function* walkDirs(dir: string): AsyncGenerator<string> {
  let entries
  try {
    entries = await readdir(dir, { withFileTypes: true })
  } catch {
    return
  }
  for (const entry of entries) {
    if (
      entry.isDirectory() &&
      !entry.name.startsWith('.') &&
      entry.name !== 'node_modules'
    ) {
      yield entry.name
      yield* walkDirs(join(dir, entry.name))
    }
  }
}

/**
 * Collect the set of `srcDir/<sub>/` directories that have an `index.ts`.
 * Used by the bundler to know which paths can be resolved to `index.js`.
 */
export async function findIndexDirs(srcDir: string): Promise<Set<string>> {
  const out = new Set<string>()
  for await (const dir of walkDirs(srcDir)) {
    try {
      await stat(join(srcDir, dir, 'index.ts'))
      out.add(dir)
    } catch {
      // No index.ts
    }
  }
  return out
}