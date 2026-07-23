/**
 * Source-map helpers: rewrite the `sources` paths after we move files
 * from `types/` to `dist/_internal/types/`, and emit a fresh source map
 * for the bundled `dist/_internal/index.d.ts` so IDE ctrl-click navigation
 * can follow declarations back to `src/sandstone.ts`.
 */
import { readFile } from 'fs/promises'
import { SourceMapGenerator } from 'source-map-js'
import * as ts from 'typescript'
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