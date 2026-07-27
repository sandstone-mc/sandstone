/**
 * Fixes import paths in TypeScript declaration files using MagicString
 * string-level edits, so line/column layout is preserved.
 *
 * - Converts path aliases (sandstone/*) to relative paths
 * - Adds .js extensions to relative imports
 * - Handles directory imports with /index.js
 *
 * Why string-level: the previous AST + TS-printer approach reformatted
 * nodes it didn't touch (multi-line type literals got split back to one
 * line per branch), which shifted every downstream line in the file and
 * broke the per-file `.d.ts.map` produced by `tsc`. MagicString edits
 * preserve every original byte that we don't change.
 */

import { posix } from 'path'
import { MagicString } from 'magic-string'

/**
 * Fixes import paths in a .d.ts file.
 *
 * @param source - The source code of the .d.ts file
 * @param fileDir - The directory containing this file (absolute path)
 * @param distDir - The root dist directory (absolute path)
 * @param indexDirs - Set of relative paths (from distDir) that have index.ts files
 */
export function fixDtsImports(
  source: string,
  fileDir: string,
  distDir: string,
  indexDirs: Set<string>,
): { content: string; modified: boolean } {
  // Normalize paths to use forward slashes
  const normalizedFileDir = fileDir.replace(/\\/g, '/')
  const normalizedDistDir = distDir.replace(/\\/g, '/')

  /**
   * Resolves an import path, converting sandstone/* to relative and adding extensions.
   */
  function resolveModulePath(importPath: string): string | undefined {
    // Handle sandstone/* path aliases
    if (importPath.startsWith('sandstone/')) {
      const subPath = importPath.slice('sandstone/'.length).replace(/\.ts$/, '')

      if (indexDirs.has(subPath)) {
        const targetDir = posix.join(normalizedDistDir, 'types', subPath)
        let relPath = posix.relative(normalizedFileDir, targetDir)
        if (!relPath.startsWith('.')) relPath = './' + relPath
        if (relPath.endsWith('/')) relPath = relPath.slice(0, -1)
        return `${relPath}/index.js`
      }

      const targetFile = posix.join(normalizedDistDir, 'types', `${subPath}.d.ts`)
      let relPath = posix.relative(normalizedFileDir, targetFile)
      if (!relPath.startsWith('.')) relPath = './' + relPath
      return relPath.replace(/\.d\.ts$/, '.js')
    }

    if (importPath === 'sandstone') {
      let relPath = posix.relative(normalizedFileDir, normalizedDistDir)
      if (!relPath.startsWith('.')) relPath = './' + relPath
      return `${relPath}/index.js`
    }

    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
        return undefined
      }

      const cleanPath = importPath.replace(/\.ts$/, '')

      if (isIndexDir(cleanPath, fileDir, distDir, indexDirs)) {
        return `${cleanPath}/index.js`
      }

      return `${cleanPath}.js`
    }

    return undefined
  }

  // Scan source for import/export/import() specifiers using regex. We only
  // touch the quoted string inside the specifier position; surrounding text
  // is left intact so column counts and line layout are preserved.
  const edits: Array<{ start: number; end: number; replacement: string }> = []
  const specifierRegex = /(?<=(?:from\s+|import\s*\(\s*))(["'])((?:\\.|(?!\1).)*)\1/g
  for (const match of source.matchAll(specifierRegex)) {
    const quote = match[1]
    const path = match[2]
    const newPath = resolveModulePath(path)
    if (newPath && newPath !== path) {
      // Replace the entire quoted segment (quote + path + quote).
      const start = match.index! + (match[0].indexOf(quote))
      const end = start + 1 + path.length + 1
      edits.push({ start, end, replacement: `${quote}${newPath}${quote}` })
    }
  }

  if (edits.length === 0) {
    return { content: source, modified: false }
  }

  const ms = new MagicString(source)
  // Apply edits in reverse order so earlier offsets remain valid.
  for (const edit of edits) {
    ms.overwrite(edit.start, edit.end, edit.replacement)
  }
  return { content: ms.toString(), modified: true }
}

/**
 * Checks if a relative import path resolves to a directory with an index file.
 */
function isIndexDir(
  importPath: string,
  fromFileDir: string,
  distDir: string,
  indexDirs: Set<string>,
): boolean {
  const fromRelative = fromFileDir.replace(distDir, '').replace(/\\/g, '/').replace(/^\//, '')
  const fromParts = fromRelative.split('/').filter(Boolean)

  const importParts = importPath.split('/')
  const currentParts = [...fromParts]

  for (const part of importParts) {
    if (part === '..') {
      currentParts.pop()
    } else if (part !== '.') {
      currentParts.push(part)
    }
  }

  const resolvedPath = currentParts.join('/')
  const normalizedPath = resolvedPath.replace(/^types\//, '')
  return indexDirs.has(normalizedPath)
}
