/**
 * Source-map helpers: rewrite the `sources` paths after we move files
 * from `types/` to `dist/_internal/types/`, and emit a fresh source map
 * for the bundled `dist/_internal/index.d.ts` so IDE ctrl-click navigation
 * can follow declarations back to `src/sandstone.ts`.
 */
import { readFile } from 'fs/promises'
import { SourceMapGenerator } from 'source-map-js'
import { collectExportedSymbols } from './symbols'

/**
 * Rewrite the `sources` paths in a `.d.ts.map` JSON after `copyDtsFiles`
 * moves the file two directories deeper (`types/` → `dist/_internal/types/`).
 */
export function rewriteSourcePathsInMap(content: string): string {
  const map = JSON.parse(content)
  if (Array.isArray(map.sources)) {
    map.sources = map.sources.map((s: string) =>
      s.startsWith('../') ? '../../' + s : s,
    )
  }
  return JSON.stringify(map)
}

/**
 * Shift every generated-line mapping in a `.d.ts.map` by `lineDelta` lines.
 * Used after `copyDtsFiles` prepends N lines of consolidated imports — the
 * map's mappings string was produced by `tsc` against the original file,
 * so without this shift IDE ctrl-click would land N lines below the real
 * declaration (e.g. `Score` ctrl-click landing on `unaryOperation`).
 *
 * The shift is implemented by prepending `lineDelta` empty `;`-separated
 * segments to `mappings`, which adds `lineDelta` empty generated lines
 * at the top. All existing mappings retain their relative order; their
 * absolute generated line numbers increase by `lineDelta`.
 */
export function shiftMappingsByLines(content: string, lineDelta: number): string {
  if (lineDelta === 0) return content
  if (lineDelta < 0) {
    throw new Error(`shiftMappingsByLines: negative lineDelta (${lineDelta}) not supported`)
  }
  const map = JSON.parse(content)
  if (typeof map.mappings !== 'string') return content
  map.mappings = ';'.repeat(lineDelta) + map.mappings
  return JSON.stringify(map)
}

/**
 * Count the number of generated lines added to a file by a text
 * transformation. If `before` has `B` lines and `after` has `A` lines,
 * the delta is `A - B` (positive when lines were added).
 */
export function lineDelta(before: string, after: string): number {
  return after.split('\n').length - before.split('\n').length
}

/**
 * Generate a source map for the bundled `dist/_internal/index.d.ts` that
 * maps each exported symbol back to its source position in
 * `src/sandstone.ts`. This gives the IDE precise ctrl-click navigation for
 * the destructured-from-`commandsProxy` and `packMethodsProxy` exports,
 * which `tsc` collapses into a single combined declaration in
 * `types/sandstone.d.ts` and therefore can't be resolved through the
 * default chain alone.
 */
export async function generateMainIndexMap(
  bundledDtsPath: string,
  sandstoneTsPath: string,
  sourceFile: string,
): Promise<string> {
  const [bundled, src] = await Promise.all([
    collectExportedSymbols(bundledDtsPath),
    collectExportedSymbols(sandstoneTsPath),
  ])

  const bundledByName = new Map<string, { line: number; col: number }>()
  for (const s of bundled) bundledByName.set(s.name, s)

  const generator = new SourceMapGenerator({ file: 'index.d.ts' })
  for (const s of src) {
    const b = bundledByName.get(s.name)
    if (!b) continue
    generator.addMapping({
      generated: { line: b.line, column: b.col },
      source: sourceFile,
      original: { line: s.line, column: s.col },
    })
  }

  return generator.toString()
}