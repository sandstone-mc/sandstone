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
import * as ts from '@typescript/typescript6'

import { fixDtsImports } from '../fix-dts-imports'

import { hoistTrailingTypeReExports } from './hoisting'
import { rewriteImportsTransformer } from './transformer'
import { groupImportsForMain } from './import-grouping'
import { mergeImportDecls } from './merge'
import { walkDtsFiles } from './walk'
import type { CollectedImport } from './inline-imports'
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

  // Find namespace import declarations (`import * as ns from './path'`) and
  // use them to rewrite merged destructure-of-namespace exports
  // (`export declare const X: typeof ns.X, Y: typeof ns.Y, Z: typeof ns.Z`)
  // into explicit re-exports. Without this, TS compiler sees the names as
  // declared at the export line in the bundled d.ts and LSP `definition`
  // returns that — the IDE user lands in a bundled file with no real
  // source. With re-exports, LSP follows to the namespace's source.
  const nsImportPaths = new Map<string, string>()
  for (const stmt of updated.statements) {
    if (!ts.isImportDeclaration(stmt)) continue
    const ns = stmt.importClause?.namedBindings
    if (!ns || !ts.isNamespaceImport(ns)) continue
    const ms = stmt.moduleSpecifier
    if (!ts.isStringLiteral(ms)) continue
    nsImportPaths.set(ns.name.text, ms.text)
  }

  const rewrittenStmts: ts.Statement[] = []
  for (const stmt of updated.statements) {
    if (!ts.isVariableStatement(stmt)) {
      rewrittenStmts.push(stmt)
      continue
    }
    const isExported = (stmt.modifiers ?? []).some(
      (m) => m.kind === ts.SyntaxKind.ExportKeyword,
    )
    if (!isExported || stmt.declarationList.declarations.length < 2) {
      rewrittenStmts.push(stmt)
      continue
    }

    // Walk each decl. Partition into:
    //   - ns decls: `X: typeof ns.X` where ns is a known namespace import.
    //     These go into `export { ... } from './ns-path'` so the LSP follows
    //     them to the actual source file.
    //   - other decls: kept as-is in a regular VariableStatement.
    const nsDecls = new Map<string, { decls: ts.VariableDeclaration[]; target: string }>()
    const otherDecls: ts.VariableDeclaration[] = []
    for (const d of stmt.declarationList.declarations) {
      // TypeQuery exprName can be an Identifier (`typeof ns`) or a
      // QualifiedName (`typeof ns.prop`). Handle both.
      let nsName: string | null = null
      let propName: string | null = null
      if (d.type && ts.isTypeQueryNode(d.type)) {
        const en = d.type.exprName
        if (ts.isIdentifier(en)) {
          nsName = en.text
          propName = en.text
        } else if (
          ts.isQualifiedName(en) &&
          ts.isIdentifier(en.left) &&
          ts.isIdentifier(en.right)
        ) {
          nsName = en.left.text
          propName = en.right.text
        }
      }
      if (
        ts.isIdentifier(d.name) &&
        nsName !== null &&
        propName === d.name.text &&
        nsImportPaths.has(nsName)
      ) {
        const target = nsImportPaths.get(nsName)!
        if (!nsDecls.has(nsName)) nsDecls.set(nsName, { decls: [], target })
        nsDecls.get(nsName)!.decls.push(d)
      } else {
        otherDecls.push(d)
      }
    }

    if (otherDecls.length > 0) {
      // Keep a VariableStatement with the remaining decls. If the original
      // had a type annotation on the declaration list (rare), preserve it.
      rewrittenStmts.push(
        ts.factory.createVariableStatement(
          stmt.modifiers,
          ts.factory.createVariableDeclarationList(otherDecls, stmt.declarationList.flags),
        ),
      )
    }
    for (const { decls: nsDeclList, target } of nsDecls.values()) {
      const specifiers = nsDeclList.map((d) =>
        ts.factory.createExportSpecifier(
          false,
          undefined,
          ts.factory.createIdentifier((d.name as ts.Identifier).text),
        ),
      )
      rewrittenStmts.push(
        ts.factory.createExportDeclaration(
          undefined,
          false,
          ts.factory.createNamedExports(specifiers),
          ts.factory.createStringLiteral(target),
        ),
      )
    }
  }
  const updated2 = ts.factory.updateSourceFile(updated, rewrittenStmts)

  const emitted = ts.createPrinter().printFile(updated2)
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