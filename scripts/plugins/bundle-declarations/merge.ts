/**
 * Merge two lists of `import type { ... } from "..."` declarations by
 * module path. Names from both lists are unioned into a single import
 * declaration per module.
 */
import * as ts from 'typescript'

export function mergeImportDecls(
  a: readonly ts.ImportDeclaration[],
  b: readonly ts.ImportDeclaration[],
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
    byModule.set(module, mergeTwo(existing, decl))
  }
  return [...byModule.values()]
}

function mergeTwo(
  a: ts.ImportDeclaration,
  b: ts.ImportDeclaration,
): ts.ImportDeclaration {
  const aNames = (a.importClause!.namedBindings as ts.NamedImports).elements
  const bNames = (b.importClause!.namedBindings as ts.NamedImports).elements
  const seen = new Set(aNames.map((e) => e.name.text))
  const merged = [...aNames]
  for (const n of bNames) {
    if (!seen.has(n.name.text)) {
      merged.push(n)
      seen.add(n.name.text)
    }
  }
  return ts.factory.updateImportDeclaration(
    a,
    a.modifiers,
    ts.factory.createImportClause(
      a.importClause!.isTypeOnly,
      a.importClause!.name,
      ts.factory.createNamedImports(merged),
    ),
    a.moduleSpecifier,
    a.attributes,
  )
}