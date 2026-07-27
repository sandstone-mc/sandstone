/**
 * Merge two lists of `import type { ... } from "..."` declarations by
 * module path. Names from both lists are unioned into a single import
 * declaration per module. Also dedupes names ACROSS modules so a name
 * imported twice (e.g. once as type-only, once as inline-collected)
 * doesn't produce a "Duplicate identifier" error in the bundled .d.ts.
 */
import * as ts from 'typescript'

export function mergeImportDecls(
  a: readonly ts.ImportDeclaration[],
  b: readonly ts.ImportDeclaration[],
): ts.ImportDeclaration[] {
  const byModule = new Map<string, ts.ImportDeclaration>()
  // Global name → module map. Each name keeps its FIRST-claimed module so
  // subsequent declarations of the same name (from any module) are dropped.
  const claimed = new Map<string, string>()
  const all = [...a, ...b]
  for (const decl of all) {
    if (!decl.moduleSpecifier || !ts.isStringLiteral(decl.moduleSpecifier)) continue
    const module = decl.moduleSpecifier.text
    const existing = byModule.get(module)
    if (!existing) {
      byModule.set(module, decl)
      // Track every name in this new decl so later modules don't re-claim it.
      const named = decl.importClause?.namedBindings
      if (named && ts.isNamedImports(named)) {
        for (const el of named.elements) {
          const name = el.name?.text
          if (name && !claimed.has(name)) claimed.set(name, module)
        }
      }
      continue
    }
    byModule.set(module, mergeTwo(existing, decl, claimed))
  }
  // After merging by module, sweep each module's decl to drop names that
  // were already claimed by a different module.
  const out: ts.ImportDeclaration[] = []
  for (const [module, decl] of byModule) {
    const filtered = dropAlreadyClaimed(decl, module, claimed)
    if (filtered) out.push(filtered)
  }
  return out
}

function mergeTwo(
  a: ts.ImportDeclaration,
  b: ts.ImportDeclaration,
  claimed: Map<string, string>,
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

/**
 * Return a new ImportDeclaration with the names that were claimed by a
 * different module removed. If every name is removed, return null.
 */
function dropAlreadyClaimed(
  decl: ts.ImportDeclaration,
  thisModule: string,
  claimed: Map<string, string>,
): ts.ImportDeclaration | null {
  const named = decl.importClause?.namedBindings
  if (!named || !ts.isNamedImports(named)) return decl
  const kept: ts.ImportSpecifier[] = []
  for (const el of named.elements) {
    const name = el.name?.text
    if (!name) continue
    const owner = claimed.get(name)
    if (owner !== undefined && owner !== thisModule) continue
    kept.push(el)
  }
  if (kept.length === named.elements.length) return decl
  if (kept.length === 0) return null
  return ts.factory.updateImportDeclaration(
    decl,
    decl.modifiers,
    ts.factory.updateImportClause(
      decl.importClause!,
      decl.importClause!.isTypeOnly,
      decl.importClause!.name,
      ts.factory.createNamedImports(kept),
    ),
    decl.moduleSpecifier,
    decl.attributes,
  )
}