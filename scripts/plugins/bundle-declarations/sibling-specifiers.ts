/**
 * Rewrite `./X.js` module specifiers to `./X/index.js` when `./X/` is a
 * directory in the staged bundle. Eliminates reliance on bundler
 * resolution at runtime — the explicit `/index.js` path always resolves.
 *
 * Applies to both `import` and `export` declarations.
 *
 * String-level via MagicString so line layout is preserved (no TS-printer
 * reformatting downstream).
 */
import { statSync } from 'fs'
import path from 'path'
import { MagicString } from 'magic-string'

/**
 * Rewrite a sibling `.d.ts` file's module specifiers in place. Returns
 * the new source text (or the input unchanged if nothing was rewritten).
 */
export function rewriteSiblingSpecifiers(
  source: string,
  sourceFile: string,
): string {
  const fileDir = path.dirname(sourceFile)

  // Match `from "./X.js"` and `import("./X.js")` style specifiers.
  // We only rewrite the path inside the quotes.
  const edits: Array<{ start: number; end: number; replacement: string }> = []
  const re = /(?<=(?:from\s+|import\s*\(\s*))(["'])((?:\.{1,2}\/[^"']*?\.js))\1/g
  for (const match of source.matchAll(re)) {
    const quote = match[1]
    const specifier = match[2]
    const newSpecifier = rewritePath(specifier, fileDir)
    if (newSpecifier && newSpecifier !== specifier) {
      const start = match.index! + (match[0].indexOf(quote))
      const end = start + 1 + specifier.length + 1
      edits.push({ start, end, replacement: `${quote}${newSpecifier}${quote}` })
    }
  }

  if (edits.length === 0) return source

  const ms = new MagicString(source)
  for (const edit of edits) {
    ms.overwrite(edit.start, edit.end, edit.replacement)
  }
  return ms.toString()
}

function rewritePath(specifier: string, fileDir: string): string | null {
  if (!specifier.startsWith('./') || !specifier.endsWith('.js')) return null
  const dir = specifier.slice(2, -3)
  if (!dir || dir.includes('..')) return null
  const dirPath = path.join(fileDir, dir)
  try {
    if (!statSync(dirPath).isDirectory()) return null
  } catch {
    return null
  }
  return `./${dir}/index.js`
}
