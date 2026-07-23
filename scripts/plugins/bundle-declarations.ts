/**
 * Bundles TypeScript declaration files into a single output file.
 *
 * Reads the declaration files from types/ and collapses them into a single
 * dist/_internal/index.d.ts file that re-exports everything, then generates
 * dist/exports/index.d.ts as the public entry point.
 *
 * Throughout, paths and declarations are computed via the TypeScript
 * compiler API — never regex over the source text — so we don't drift from
 * how tsc itself understands the program.
 */

import { readdir, readFile, writeFile, mkdir, stat } from 'fs/promises'
import { statSync } from 'fs'
import path from 'path'
import { SourceMapGenerator } from 'source-map-js'
import * as ts from 'typescript'
import { fixDtsImports } from './fix-dts-imports'

// ---------------------------------------------------------------------------
// Source-map rewriting
// ---------------------------------------------------------------------------

function rewriteSourcePathsInMap(content: string): string {
  const map = JSON.parse(content)
  if (Array.isArray(map.sources)) {
    map.sources = map.sources.map((s: string) => (s.startsWith('../') ? '../../' + s : s))
  }
  return JSON.stringify(map)
}

// ---------------------------------------------------------------------------
// Recursive .d.ts copy
// ---------------------------------------------------------------------------

async function copyDtsFiles(
  srcDir: string,
  destDir: string,
  rootSrcDir: string,
  rootDestDir: string,
  indexDirs: Set<string>,
): Promise<void> {
  const entries = await readdir(srcDir, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name)
    const destPath = join(destDir, entry.name)

    if (entry.isDirectory()) {
      await mkdir(destPath, { recursive: true })
      await copyDtsFiles(srcPath, destPath, rootSrcDir, rootDestDir, indexDirs)
      continue
    }

    if (!entry.name.endsWith('.d.ts')) continue
    if (entry.name === 'sandstone.d.ts') continue
    // Skip source maps; we'll regenerate
    if (entry.name.endsWith('.d.ts.map')) continue

    const content = await readFile(srcPath, 'utf8')
    const fixed = fixDtsImports(content, dirname(destPath), rootDestDir, indexDirs)

    // Rewrite `./X.js` specifiers that point at directories so they're
    // `./X/index.js` (no reliance on bundler resolution).
    const rewrittenSpecifiers = rewriteSiblingSpecifiers(fixed.content, destPath)

    // Inline-import rewrite: replace `import("...").X` with bare `X`,
    // collecting top-level `import type { X } from "..."` statements.
    const collected = new Set<{ name: string; module: string }>()
    const rewritten = rewriteInlineImports(rewrittenSpecifiers, collected)
    const importStmts = printImportDeclarations(
      groupImportsForSibling(collected, dirname(destPath)),
    )
    const withImports = importStmts + rewritten

    // Copy source map if present
    const srcMapPath = srcPath + '.map'
    try {
      const mapContent = await readFile(srcMapPath, 'utf8')
      await writeFile(destPath + '.map', rewriteSourcePathsInMap(mapContent))
    } catch {
      // No source map
    }

    await writeFile(destPath, withImports)
  }
}

import { join, relative, dirname } from 'path'

// ---------------------------------------------------------------------------
// Inline-import rewrite (replaces `import("...").X` with bare `X`)
// ---------------------------------------------------------------------------

/**
 * Walk the AST, replacing every `import("...").Name` (or `.Name.member`)
 * with a bare type reference. Collects `import type { Name } from "..."`
 * statements to prepend.
 */
function rewriteInlineImports(
  source: string,
  collected: Set<{ name: string; module: string }>,
): string {
  const sf = ts.createSourceFile('_.ts', source, ts.ScriptTarget.Latest, true)
  const result = ts.transform(sf, [
    (context) => (sf) => {
      const visitor: ts.Visitor = (node) => {
        if (node.kind === ts.SyntaxKind.ImportType || ts.isImportTypeNode(node)) {
          const itNode = node as ts.ImportTypeNode
          if (ts.isLiteralTypeNode(itNode.argument) && ts.isStringLiteral(itNode.argument.literal)) {
            const qualifier = itNode.qualifier
            const module = itNode.argument.literal.text
            let name: string | null = null
            let replacement: ts.TypeNode | null = null

            if (qualifier && ts.isIdentifier(qualifier)) {
              name = qualifier.text
              replacement = ts.factory.createTypeReferenceNode(qualifier, itNode.typeArguments)
            } else if (qualifier) {
              const pae = qualifier as unknown as ts.PropertyAccessExpression
              if (pae.expression && pae.name && ts.isIdentifier(pae.expression) && ts.isIdentifier(pae.name)) {
                name = pae.expression.text
                const baseRef = ts.factory.createTypeReferenceNode(
                  pae.expression,
                  itNode.typeArguments,
                )
                replacement = ts.factory.createPropertyAccessExpression(
                  baseRef as unknown as ts.Expression,
                  pae.name,
                ) as unknown as ts.TypeNode
              }
            }
            if (name !== null && replacement !== null) {
              collected.add({ name, module })
              if (itNode.typeArguments && itNode.typeArguments.length) {
                const recursed = itNode.typeArguments.map(
                  (ta) => (ts.visitNode(ta, visitor) as ts.TypeNode) ?? ta,
                )
                replacement = ts.factory.createTypeReferenceNode(
                  (replacement as ts.TypeReferenceNode).typeName,
                  recursed,
                )
              }
              return replacement
            }
          }
        }
        return ts.visitEachChild(node, visitor, context)
      }
      // `visitEachChild` on a SourceFile visits all top-level statements
      // and uses the visitor's return values as replacements.
      return ts.visitEachChild(sf, visitor, context)
    },
  ])
  const out = ts.createPrinter().printFile(result.transformed[0])
  result.dispose()
  return out
}

// ---------------------------------------------------------------------------
// Sibling-file `./X.js` → `./X/index.js` rewrite
// ---------------------------------------------------------------------------

/**
 * Rewrite sibling-file `import "./X.js"` specifiers to `./X/index.js` when
 * `./X/` is a directory in the staged bundle, so paths don't rely on
 * bundler resolution. Mirrors what the main index already does via the
 * `groupImports`/`./types/` prefix.
 */
function rewriteSiblingSpecifiers(source: string, sourceFile: string): string {
  const sf = ts.createSourceFile('_.ts', source, ts.ScriptTarget.Latest, true)
  const fileDir = path.dirname(sourceFile)
  let modified = false

  const newStmts = sf.statements.map((stmt) => {
    if (
      ts.isImportDeclaration(stmt) &&
      stmt.moduleSpecifier &&
      ts.isStringLiteral(stmt.moduleSpecifier)
    ) {
      const orig = stmt.moduleSpecifier.text
      if (orig.startsWith('./') && orig.endsWith('.js')) {
        const dir = orig.slice(2, -3)
        if (dir && !dir.includes('..')) {
          const dirPath = path.join(fileDir, dir)
          try {
            if (statSync(dirPath).isDirectory()) {
              modified = true
              return ts.factory.updateImportDeclaration(
                stmt,
                stmt.modifiers,
                stmt.importClause,
                ts.factory.createStringLiteral(`./${dir}/index.js`),
                stmt.attributes,
              )
            }
          } catch {
            // not a directory; leave alone
          }
        }
      }
    }
    if (
      ts.isExportDeclaration(stmt) &&
      stmt.moduleSpecifier &&
      ts.isStringLiteral(stmt.moduleSpecifier)
    ) {
      const orig = stmt.moduleSpecifier.text
      if (orig.startsWith('./') && orig.endsWith('.js')) {
        const dir = orig.slice(2, -3)
        if (dir && !dir.includes('..')) {
          const dirPath = path.join(fileDir, dir)
          try {
            if (statSync(dirPath).isDirectory()) {
              modified = true
              return ts.factory.updateExportDeclaration(
                stmt,
                stmt.modifiers,
                stmt.isTypeOnly,
                stmt.exportClause,
                ts.factory.createStringLiteral(`./${dir}/index.js`),
                undefined,
              )
            }
          } catch {
            // not a directory; leave alone
          }
        }
      }
    }
    return stmt
  })

  if (!modified) return source
  return ts.createPrinter().printFile(
    ts.factory.updateSourceFile(sf, newStmts),
  )
}

// ---------------------------------------------------------------------------
// Group collected imports into top-level `import type { ... } from "..."`
// statements. Two variants: one for the main index (adds `./types/` prefix
// to relative paths since per-subpath files live under `_internal/types/`),
// and one for sibling files (paths stay sibling-relative).
// ---------------------------------------------------------------------------

function groupImportsForMain(
  collected: Set<{ name: string; module: string }>,
): ts.ImportDeclaration[] {
  return groupImports(collected, true)
}

function groupImportsForSibling(
  collected: Set<{ name: string; module: string }>,
  siblingDir: string,
): ts.ImportDeclaration[] {
  return groupImports(collected, false, siblingDir)
}

function groupImports(
  collected: Set<{ name: string; module: string }>,
  forMain: boolean,
  siblingDir: string | null = null,
): ts.ImportDeclaration[] {
  const byModule = new Map<string, string[]>()
  for (const { name, module } of collected) {
    // Skip self-references — the bundled main merges sandstone.d.ts into
    // itself, so `./sandstone.js` and `./types/sandstone.js` don't exist
    // as real files. Types collected from these must already be declared
    // elsewhere in the same file.
    if (
      module === './sandstone.js' ||
      module === './sandstone' ||
      module === './types/sandstone.js' ||
      module === './types/sandstone'
    ) {
      continue
    }
    const fixedModule = (() => {
      if (forMain) {
        // Bundled main: `./X` → `./types/X` since per-subpath files live
        // under `dist/_internal/types/`.
        if (module.startsWith('./') && !module.startsWith('./types/')) {
          return `./types/${module.slice(2)}`
        }
        return module
      }
      // Sibling file: `./X.js` → `./X/index.js` if `./X/` is a directory
      // in the staged bundle.
      if (siblingDir && module.startsWith('./') && module.endsWith('.js')) {
        const dir = module.slice(2, -3)
        if (dir && !dir.includes('..')) {
          const dirPath = path.join(siblingDir, dir)
          try {
            if (statSync(dirPath).isDirectory()) {
              return `./${dir}/index.js`
            }
          } catch {
            // not a directory; leave alone
          }
        }
      }
      return module
    })()
    const arr = byModule.get(fixedModule) ?? []
    if (!arr.includes(name)) arr.push(name)
    byModule.set(fixedModule, arr)
  }
  const out: ts.ImportDeclaration[] = []
  for (const [module, names] of byModule) {
    out.push(
      ts.factory.createImportDeclaration(
        undefined,
        ts.factory.createImportClause(
          true, // typeOnly
          undefined,
          ts.factory.createNamedImports(
            names.map((n) =>
              ts.factory.createImportSpecifier(
                false,
                undefined,
                ts.factory.createIdentifier(n),
              ),
            ),
          ),
        ),
        ts.factory.createStringLiteral(module),
        undefined,
      ),
    )
  }
  return out
}

/**
 * Serialize a list of import declarations to source text.
 */
function printImportDeclarations(decls: ts.ImportDeclaration[]): string {
  if (decls.length === 0) return ''
  const printer = ts.createPrinter()
  const sf = ts.createSourceFile('_.ts', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS)
  return (
    decls
      .map((d) => printer.printNode(ts.EmitHint.Unspecified, d, sf))
      .join('\n') + '\n'
  )
}

// ---------------------------------------------------------------------------
// Generating dist/_internal/index.d.ts using the TS API
// ---------------------------------------------------------------------------

async function generateMainIndexDts(
  typesDir: string,
  distDir: string,
  indexDirs: Set<string>,
): Promise<string> {
  const sandstoneDtsPath = join(typesDir, 'sandstone.d.ts')
  const content = await readFile(sandstoneDtsPath, 'utf8')
  const cleaned = content.replace(
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

  // Pre-compute name → file using the TS API
  const canonicalFile = new Map<string, string>()
  for await (const dtsPath of walkDtsFiles(typesDir)) {
    const rel = relative(typesDir, dtsPath).replace(/\\/g, '/').replace(/\.d\.ts$/, '')
    const text = await readFile(dtsPath, 'utf8').catch(() => '')
    const subSf = ts.createSourceFile(dtsPath, text, ts.ScriptTarget.Latest, true)
    const names = new Set<string>()
    for (const stmt of subSf.statements) {
      if (ts.isExportDeclaration(stmt)) {
        if (stmt.exportClause && ts.isNamedExports(stmt.exportClause)) {
          for (const el of stmt.exportClause.elements) names.add(el.name.text)
        }
      } else if (ts.canHaveModifiers(stmt) && hasExportModifier(stmt)) {
        collectNamesFromStatement(stmt, names)
      }
    }
    for (const n of names) {
      if (!canonicalFile.has(n)) canonicalFile.set(n, `./types/${rel}.js`)
    }
  }

  const collectedImports = new Set<{ name: string; module: string }>()
  const transformResult = ts.transform(sf, [
    rewriteImportsTransformer(distDir, typesDir, canonicalFile, compilerOptions, collectedImports),
  ])
  const transformed = transformResult.transformed[0]

  // Hoist the trailing `export { X, Y } from "./types/..."` re-exports to
  // the top of the file as `import type { X, Y } from "..."` declarations
  // (and keep value-side re-exports in place). Without hoisting, types like
  // `ObjectiveClass` are referenced before their declaration site — TS
  // gives up and reports `/*unresolved*/ any` for the type alias.
  const { importDecls, stmts } = hoistTrailingTypeReExports(transformed)
  const inlineImportDecls = groupImportsForMain(collectedImports)
  const merged = mergeImportDecls(importDecls, inlineImportDecls)
  // Re-prepend hoisted imports to the original source file's statements
  // (dropping the trailing re-exports). The new ImportDeclaration nodes
  // don't have a parent yet, so the printer's comment iterator can't walk
  // up to find the source text. We set parents explicitly here.
  const updated = ts.factory.updateSourceFile(
    transformed,
    [...merged, ...stmts],
  )
  for (const node of merged) (node as unknown as { parent: ts.Node }).parent = updated

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
 * TS transformer factory: rewrites every module specifier to its canonical
 * path inside the bundle, and rewrites every inline `import("...").Name`
 * expression to a bare `Name` reference.
 */
function rewriteImportsTransformer(
  bundleDir: string,
  typesDir: string,
  _canonicalFile: Map<string, string>,
  compilerOptions: ts.CompilerOptions,
  collectedImports: Set<{ name: string; module: string }>,
): ts.TransformerFactory<ts.SourceFile> {
  return (context) => (sourceFile) => {
    const visitor: ts.Visitor = (node) => {
      if (ts.isImportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        const resolved = resolveSpecifier(
          node.moduleSpecifier.text,
          bundleDir,
          typesDir,
          compilerOptions,
        )
        if (resolved !== null && resolved !== node.moduleSpecifier.text) {
          return ts.factory.updateImportDeclaration(
            node,
            node.modifiers,
            node.importClause,
            ts.factory.createStringLiteral(resolved),
            node.attributes,
          )
        }
        // Resolution failed — fall back to ./types/ prefix rewrite.
        const orig = node.moduleSpecifier.text
        if (orig.startsWith('./') && !orig.startsWith('./types/')) {
          const fixed = `./types/${orig.slice(2)}`
          return ts.factory.updateImportDeclaration(
            node,
            node.modifiers,
            node.importClause,
            ts.factory.createStringLiteral(fixed),
            node.attributes,
          )
        }
      }
      if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        const resolved = resolveSpecifier(
          node.moduleSpecifier.text,
          bundleDir,
          typesDir,
          compilerOptions,
        )
        if (resolved !== null && resolved !== node.moduleSpecifier.text) {
          return ts.factory.updateExportDeclaration(
            node,
            node.modifiers,
            node.isTypeOnly,
            node.exportClause,
            ts.factory.createStringLiteral(resolved),
            undefined,
          )
        }
        const orig = node.moduleSpecifier.text
        if (orig.startsWith('./') && !orig.startsWith('./types/')) {
          const fixed = `./types/${orig.slice(2)}`
          return ts.factory.updateExportDeclaration(
            node,
            node.modifiers,
            node.isTypeOnly,
            node.exportClause,
            ts.factory.createStringLiteral(fixed),
            undefined,
          )
        }
      }
      // Resolve inline `import("...").X` to bare `X` (with top-level
      // `import type { X } from "..."` prepended).
      if (node.kind === ts.SyntaxKind.ImportType || ts.isImportTypeNode(node)) {
        const itNode = node as ts.ImportTypeNode
        if (ts.isLiteralTypeNode(itNode.argument) && ts.isStringLiteral(itNode.argument.literal)) {
          const qualifier = itNode.qualifier
          const module = itNode.argument.literal.text
          let name: string | null = null
          let replacement: ts.TypeNode | null = null

          if (qualifier && ts.isIdentifier(qualifier)) {
            name = qualifier.text
            replacement = ts.factory.createTypeReferenceNode(qualifier, itNode.typeArguments)
          } else if (qualifier) {
            const pae = qualifier as unknown as ts.PropertyAccessExpression
            if (pae.expression && pae.name && ts.isIdentifier(pae.expression) && ts.isIdentifier(pae.name)) {
              name = pae.expression.text
              const baseRef = ts.factory.createTypeReferenceNode(
                pae.expression,
                itNode.typeArguments,
              )
              replacement = ts.factory.createPropertyAccessExpression(
                baseRef as unknown as ts.Expression,
                pae.name,
              ) as unknown as ts.TypeNode
            }
          }
          if (name !== null && replacement !== null) {
            // Skip self-references — `./sandstone.js` and
            // `./types/sandstone.js` don't exist as real files. Types
            // must already be declared elsewhere in the merged file.
            if (
              module === './sandstone.js' ||
              module === './sandstone' ||
              module === './types/sandstone.js' ||
              module === './types/sandstone'
            ) {
              return replacement
            }
            collectedImports.add({ name, module })
            // Skip self-references (`./sandstone.js`) — types must already
            // be declared elsewhere in the merged file.
            if (itNode.typeArguments && itNode.typeArguments.length) {
              const visited = itNode.typeArguments.map(
                (ta) => context.factory ?? ts.factory,
              )
              // Recurse by walking children
              const recursed = itNode.typeArguments.map((ta) => {
                const v = (ta as any).transform ? ta : ts.visitNode(ta, visitor as any)
                return v ?? ta
              })
              replacement = ts.factory.createTypeReferenceNode(
                (replacement as ts.TypeReferenceNode).typeName,
                recursed as ts.TypeNode[],
              )
            }
            return replacement
          }
        }
      }
      return ts.visitEachChild(node, visitor, context)
    }
    return ts.visitNode(sourceFile, visitor) as ts.SourceFile
  }
}

/**
 * Hoist trailing `export { X, Y } from "..."` declarations (which the
 * tsc-emitted sandstone.d.ts has) to top-of-file `import type { X, Y } from "..."`
 * statements. This ensures types referenced earlier in the file (e.g. in
 * destructured const declarations) can be resolved — otherwise TS gives up
 * and reports unresolved-type any.
 *
 * Returns the updated source file with hoisted imports prepended.
 */
function hoistTrailingTypeReExports(sf: ts.SourceFile): {
  importDecls: ts.ImportDeclaration[]
  stmts: ts.Statement[]
} {
  // Walk through statements, collect names from `export { X } from "..."`
  // declarations, and merge them into the existing top-of-file
  // `import type { ... } from "..."` statements for the same module. After
  // merging, the trailing re-export is dropped (its job is done by the
  // top-of-file import). De-duplicates so we don't end up with two
  // `import type { X } from "..."` lines for the same module.
  const importsByModule = new Map<
    string,
    { names: Set<string>; decl: ts.ImportDeclaration }
  >()
  const otherStmts: ts.Statement[] = []
  const trailingExports: { module: string; names: Set<string> }[] = []

  for (const stmt of sf.statements) {
    if (
      ts.isImportDeclaration(stmt) &&
      stmt.moduleSpecifier &&
      ts.isStringLiteral(stmt.moduleSpecifier) &&
      stmt.importClause?.isTypeOnly &&
      stmt.importClause.namedBindings &&
      ts.isNamedImports(stmt.importClause.namedBindings)
    ) {
      const module = stmt.moduleSpecifier.text
      const named = stmt.importClause.namedBindings
      const existing = importsByModule.get(module)
      if (existing) {
        for (const el of named.elements) {
          if (!existing.names.has(el.name.text)) {
            existing.names.add(el.name.text)
            existing.decl = ts.factory.updateImportDeclaration(
              existing.decl,
              existing.decl.modifiers,
              ts.factory.updateImportClause(
                existing.decl.importClause!,
                false,
                existing.decl.importClause!.name,
                ts.factory.createNamedImports(
                  [
                    ...((existing.decl.importClause!.namedBindings as ts.NamedImports).elements),
                    el,
                  ],
                ),
              ),
              existing.decl.moduleSpecifier,
              existing.decl.attributes,
            )
          }
        }
      } else {
        const names = new Set<string>()
        for (const el of named.elements) names.add(el.name.text)
        importsByModule.set(module, { names, decl: stmt })
      }
      continue
    }
    if (
      ts.isExportDeclaration(stmt) &&
      stmt.exportClause &&
      ts.isNamedExports(stmt.exportClause) &&
      stmt.moduleSpecifier &&
      ts.isStringLiteral(stmt.moduleSpecifier)
    ) {
      // Track the names to merge into the top-level import.
      const module = stmt.moduleSpecifier.text
      const names = new Set<string>()
      for (const el of stmt.exportClause.elements) names.add(el.name.text)
      const existing = trailingExports.find((e) => e.module === module)
      if (existing) {
        for (const n of names) existing.names.add(n)
      } else {
        trailingExports.push({ module, names })
      }
      // Drop the original re-export (its job is done by the import).
      continue
    }
    otherStmts.push(stmt)
  }

  // Merge trailing export names into the existing top-of-file imports.
  for (const exp of trailingExports) {
    const existing = importsByModule.get(exp.module)
    if (existing) {
      for (const n of exp.names) {
        if (!existing.names.has(n)) {
          existing.names.add(n)
          existing.decl = ts.factory.updateImportDeclaration(
            existing.decl,
            existing.decl.modifiers,
            ts.factory.updateImportClause(
              existing.decl.importClause!,
              false,
              existing.decl.importClause!.name,
              ts.factory.createNamedImports(
                [
                  ...((existing.decl.importClause!.namedBindings as ts.NamedImports).elements),
                  ts.factory.createImportSpecifier(
                    false,
                    undefined,
                    ts.factory.createIdentifier(n),
                  ),
                ],
              ),
            ),
            existing.decl.moduleSpecifier,
            existing.decl.attributes,
          )
        }
      }
    } else {
      // New module — create a fresh import declaration.
      const decl = ts.factory.createImportDeclaration(
        undefined,
        ts.factory.createImportClause(
          true, // typeOnly
          undefined,
          ts.factory.createNamedImports(
            [...exp.names].map((n) =>
              ts.factory.createImportSpecifier(
                false,
                undefined,
                ts.factory.createIdentifier(n),
              ),
            ),
          ),
        ),
        ts.factory.createStringLiteral(exp.module),
        undefined,
      )
      importsByModule.set(exp.module, { names: exp.names, decl })
    }
  }

  // Return hoisted imports and remaining statements separately so the
  // caller can merge in additional imports collected from inline
  // `import("...").X` expressions.
  const topLevel = [...importsByModule.values()].map((i) => i.decl)
  return {
    importDecls: topLevel,
    stmts: otherStmts,
  }
}

/**
 * Merge two sets of `import type { ... } from "..."` declarations by
 * module. For each module, names from both lists are unioned into a
 * single import declaration. Returns the merged list.
 */
function mergeImportDecls(
  a: ts.ImportDeclaration[],
  b: ts.ImportDeclaration[],
): ts.ImportDeclaration[] {
  const byModule = new Map<string, ts.ImportDeclaration>()
  for (const decl of [...a, ...b]) {
    if (!decl.moduleSpecifier || !ts.isStringLiteral(decl.moduleSpecifier)) continue
    const module = decl.moduleSpecifier.text
    const existing = byModule.get(module)
    if (!existing) {
      byModule.set(module, decl)
      continue
    }
    const existingNames = (existing.importClause!.namedBindings as ts.NamedImports).elements
    const newNames = (decl.importClause!.namedBindings as ts.NamedImports).elements
    const seen = new Set(existingNames.map((e) => e.name.text))
    const merged = [...existingNames]
    for (const n of newNames) {
      if (!seen.has(n.name.text)) {
        merged.push(n)
        seen.add(n.name.text)
      }
    }
    const newClause = ts.factory.createImportClause(
      existing.importClause!.isTypeOnly,
      existing.importClause!.name,
      ts.factory.createNamedImports(merged),
    )
    byModule.set(
      module,
      ts.factory.updateImportDeclaration(
        existing,
        existing.modifiers,
        newClause,
        existing.moduleSpecifier,
        existing.attributes,
      ),
    )
  }
  return [...byModule.values()]
}

/**
 * Resolve a module specifier string to its canonical path inside the
 * staged bundle, using TS's module resolver.
 */
function resolveSpecifier(
  specifier: string,
  bundleDir: string,
  _typesDir: string,
  compilerOptions: ts.CompilerOptions,
): string | null {
  const containingFile = join(bundleDir, '__virtual__.ts')
  if (!specifier.startsWith('.') && !specifier.startsWith('sandstone/')) return null

  const result = ts.resolveModuleName(specifier, containingFile, compilerOptions, ts.sys)
  const resolved = result.resolvedModule?.resolvedFileName
  if (!resolved) return null

  const fromBundle = relative(bundleDir, resolved).replace(/\\/g, '/')
  return fromBundle.endsWith('.js') ? fromBundle : `${fromBundle}.js`
}

// ---------------------------------------------------------------------------
// Walk all .d.ts files
// ---------------------------------------------------------------------------

async function* walkDtsFiles(dir: string): AsyncGenerator<string> {
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

// ---------------------------------------------------------------------------
// Symbol collection (for source map)
// ---------------------------------------------------------------------------

/**
 * Walk a .ts/.d.ts file and collect every exported variable declaration's
 * identifier position.
 */
async function collectExportedSymbols(
  file: string,
): Promise<{ name: string; line: number; col: number }[]> {
  const src = await readFile(file, 'utf8').catch(() => '')
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const out: { name: string; line: number; col: number }[] = []

  function visit(node: ts.Node) {
    if (ts.isVariableStatement(node)) {
      const isExported = (node.modifiers ?? []).some(
        (m) => m.kind === ts.SyntaxKind.ExportKeyword,
      )
      if (!isExported) {
        ts.forEachChild(node, visit)
        return
      }
      for (const decl of node.declarationList.declarations) {
        const name = decl.name
        if (ts.isIdentifier(name)) {
          const pos = sf.getLineAndCharacterOfPosition(name.getStart(sf))
          out.push({ name: name.text, line: pos.line + 1, col: pos.character })
        } else if (
          ts.isObjectBindingPattern(name) ||
          ts.isArrayBindingPattern(name)
        ) {
          for (const el of name.elements) {
            if (ts.isBindingElement(el) && ts.isIdentifier(el.name)) {
              const pos = sf.getLineAndCharacterOfPosition(el.name.getStart(sf))
              out.push({ name: el.name.text, line: pos.line + 1, col: pos.character })
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sf)
  return out
}

// ---------------------------------------------------------------------------
// Source-map generation
// ---------------------------------------------------------------------------

async function generateMainIndexMap(
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

// ---------------------------------------------------------------------------
// Helpers shared between main and sibling rewrites
// ---------------------------------------------------------------------------

/** True if `node` has the `export` modifier. */
function hasExportModifier(node: ts.Node): boolean {
  return (
    (ts.canHaveModifiers(node) &&
      ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) ??
    false
  )
}

/**
 * Collect top-level names from a single export statement
 * (`export const a, b, c: T`, `export class X`, etc.).
 */
function collectNamesFromStatement(stmt: ts.Statement, out: Set<string>): void {
  if (ts.isVariableStatement(stmt)) {
    for (const decl of stmt.declarationList.declarations) {
      collectBindingNames(decl.name, out)
    }
  } else if (
    ts.isClassDeclaration(stmt) ||
    ts.isInterfaceDeclaration(stmt) ||
    ts.isTypeAliasDeclaration(stmt) ||
    ts.isEnumDeclaration(stmt) ||
    ts.isFunctionDeclaration(stmt) ||
    ts.isModuleDeclaration(stmt)
  ) {
    if (stmt.name && ts.isIdentifier(stmt.name)) out.add(stmt.name.text)
  }
}

function collectBindingNames(name: ts.BindingName, out: Set<string>): void {
  if (ts.isIdentifier(name)) out.add(name.text)
  else if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
    for (const el of name.elements) {
      if (ts.isBindingElement(el)) collectBindingNames(el.name, out)
    }
  }
}

// ---------------------------------------------------------------------------
// findIndexDirs
// ---------------------------------------------------------------------------

async function findIndexDirs(srcDir: string): Promise<Set<string>> {
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

async function* walkDirs(dir: string): AsyncGenerator<string> {
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

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

export async function bundleDeclarations(
  typesDir: string,
  distDir: string,
  srcDir: string,
): Promise<void> {
  const indexDirs = await findIndexDirs(srcDir)
  const bundleDir = join(distDir, '_internal')
  const typesDestDir = join(bundleDir, 'types')

  await mkdir(typesDestDir, { recursive: true })
  await copyDtsFiles(typesDir, typesDestDir, typesDir, bundleDir, indexDirs)

  await writeFile(
    join(typesDestDir, 'package.json'),
    JSON.stringify({ private: true }, null, 2),
  )

  const mainIndexContent = await generateMainIndexDts(typesDir, bundleDir, indexDirs)
  await writeFile(join(bundleDir, 'index.d.ts'), mainIndexContent)

  const map = await generateMainIndexMap(
    join(bundleDir, 'index.d.ts'),
    join(srcDir, 'sandstone.ts'),
    '../../src/sandstone.ts',
  )
  await writeFile(join(bundleDir, 'index.d.ts.map'), map)
}