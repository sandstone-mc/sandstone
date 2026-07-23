/**
 * Generate `dist/_internal/index.d.ts` — the bundled main re-export file.
 * Combines:
 *   - module-specifier rewrites for every import/export statement
 *   - inline-import rewrites (`import("...").X` → bare `X`)
 *   - hoisting of trailing `export { X } from "..."` re-exports to the
 *     top of the file as `import type { X } from "..."` declarations
 *   - merging of hoisted + inline imports into a single deduped block
 */
import { readFile } from 'fs/promises'
import { join, relative } from 'path'
import * as ts from 'typescript'

import { fixDtsImports } from '../fix-dts-imports'

import { hoistTrailingTypeReExports } from './hoisting'
import { rewriteImportsTransformer, CollectedImport } from './transformer'
import { groupImportsForMain } from './import-grouping'
import { mergeImportDecls } from './merge'
import { walkDtsFiles } from './walk'
import {
  collectNamesFromStatement,
  hasExportModifier,
} from './symbols'

export async function generateMainIndexDts(
  typesDir: string,
  distDir: string,
  indexDirs: Set<string>,
): Promise<string> {
  const sandstoneDtsPath = join(typesDir, 'sandstone.d.ts')
  const cleaned = (await readFile(sandstoneDtsPath, 'utf8')).replace(
    /\n?\/\/# sourceMappingURL=sandstone\.d\.ts\.map\n?$/,
    '\n',
  )
  const fixed = fixDtsImports(cleaned, distDir, distDir, indexDirs)
  const sf = ts.createSourceFile(
    sandstoneDtsPath,
    fixed.content,
    ts.ScriptTarget.Latest,
    true,
  )

  const compilerOptions: ts.CompilerOptions = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    strict: true,
    skipLibCheck: true,
    esModuleInterop: true,
  }

  const canonicalFile = await buildCanonicalFileMap(typesDir)
  const collected = new Set<CollectedImport>()
  const transformResult = ts.transform(sf, [
    rewriteImportsTransformer(distDir, typesDir, canonicalFile, compilerOptions, collected),
  ])
  const transformed = transformResult.transformed[0]

  const { importDecls, stmts } = hoistTrailingTypeReExports(transformed)
  const merged = mergeImportDecls(importDecls, groupImportsForMain(collected))
  const updated = ts.factory.updateSourceFile(transformed, [...merged, ...stmts])
  // Synthesized ImportDeclaration nodes have `parent = undefined`, which
  // makes the printer's comment iterator crash. Set parents explicitly
  // so the printer can walk up to find the source text.
  for (const node of merged) {
    ;(node as unknown as { parent: ts.Node }).parent = updated
  }

  const emitted = ts.createPrinter().printFile(updated)
  transformResult.dispose()

  return `${emitted}

// Additional exports from subpaths (not in public API)
export * from './types/variables/index.js'
export * from './types/core/index.js'
export * from './types/commands/index.js'
export * from './types/flow/index.js'
export * from './types/pack/index.js'
export * from './types/arguments/index.js'

//# sourceMappingURL=index.d.ts.map
`
}

/**
 * Build `name → canonical file` for every exported symbol across
 * `types/`. Used by the transformer to know where each type lives.
 */
async function buildCanonicalFileMap(
  typesDir: string,
): Promise<Map<string, string>> {
  const out = new Map<string, string>()
  for await (const dtsPath of walkDtsFiles(typesDir)) {
    const rel = relative(typesDir, dtsPath).replace(/\\/g, '/').replace(/\.d\.ts$/, '')
    const sf = ts.createSourceFile(
      dtsPath,
      await readFile(dtsPath, 'utf8').catch(() => ''),
      ts.ScriptTarget.Latest,
      true,
    )
    const names = new Set<string>()
    for (const stmt of sf.statements) {
      if (ts.isExportDeclaration(stmt)) {
        if (stmt.exportClause && ts.isNamedExports(stmt.exportClause)) {
          for (const el of stmt.exportClause.elements) names.add(el.name.text)
        }
      } else if (ts.canHaveModifiers(stmt) && hasExportModifier(stmt)) {
        collectNamesFromStatement(stmt, names)
      }
    }
    for (const n of names) if (!out.has(n)) out.set(n, `./types/${rel}.js`)
  }
  return out
}