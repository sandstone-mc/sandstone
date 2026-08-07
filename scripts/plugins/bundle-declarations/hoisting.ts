/**
 * Hoist trailing `export { X } from "./types/..."` declarations to the
 * top of the file as `import type { X } from "..."` statements. This
 * ensures types referenced earlier in the file (e.g. in destructured
 * const declarations) can resolve — otherwise TS gives up and reports
 * the type as `any`.
 *
 * The original re-export is dropped from the returned statement list; the
 * hoisted import handles the consumer-facing `import { X } from
 * 'sandstone'` path through `dist/exports/index.d.ts`.
 */
import * as ts from '@typescript/typescript6'

export interface HoistedImports {
  /** The hoisted import declarations (merge with other collected imports). */
  readonly importDecls: ts.ImportDeclaration[]
  /** Remaining top-level statements with re-exports removed. */
  readonly stmts: ts.Statement[]
}

export function hoistTrailingTypeReExports(
  sf: ts.SourceFile,
): HoistedImports {
  const importsByModule = new Map<
    string,
    { names: Set<string>; decl: ts.ImportDeclaration }
  >()
  // Track names that have been added to ANY module's import, so the same
  // identifier is never imported twice (which would be a TS "Duplicate
  // identifier" error in the bundled output). When the same name appears
  // in a second module, drop it.
  const seenNames = new Set<string>()
  const otherStmts: ts.Statement[] = []

  for (const stmt of sf.statements) {
    // Merge existing top-level type imports.
    if (
      ts.isImportDeclaration(stmt) &&
      stmt.moduleSpecifier &&
      ts.isStringLiteral(stmt.moduleSpecifier) &&
      stmt.importClause?.isTypeOnly &&
      stmt.importClause.namedBindings &&
      ts.isNamedImports(stmt.importClause.namedBindings)
    ) {
      addNamedSpecifiers(
        stmt.moduleSpecifier.text,
        stmt.importClause.namedBindings.elements,
        importsByModule,
        stmt,
        seenNames,
      )
      continue
    }
    // Lift names from trailing type re-exports.
    if (
      ts.isExportDeclaration(stmt) &&
      stmt.exportClause &&
      ts.isNamedExports(stmt.exportClause) &&
      stmt.moduleSpecifier &&
      ts.isStringLiteral(stmt.moduleSpecifier)
    ) {
      addExportSpecifiers(
        stmt.moduleSpecifier.text,
        stmt.exportClause.elements,
        importsByModule,
        seenNames,
        !!stmt.isTypeOnly,
      )
      // Drop the original re-export.
      continue
    }
    otherStmts.push(stmt)
  }

  const importDecls = [...importsByModule.values()].map((i) => i.decl)
  return { importDecls, stmts: otherStmts }
}

/**
 * Add names from `NamedExports` to the per-module import map. Used by
 * the trailing-`export { X } from "..."` hoist.
 */
function addExportSpecifiers(
  module: string,
  elements: ts.NamedExports['elements'],
  importsByModule: Map<string, { names: Set<string>; decl: ts.ImportDeclaration }>,
  seenNames: Set<string>,
  isTypeOnly: boolean,
): void {
  const existing = importsByModule.get(module)
  if (!existing) {
    const names = new Set<string>()
    const specifiers: ts.ImportSpecifier[] = []
    for (const el of elements) {
      const name = el.name?.text ?? ''
      if (seenNames.has(name)) continue
      seenNames.add(name)
      names.add(name)
      if (el.propertyName) continue
      if (ts.isIdentifier(el.name)) {
        specifiers.push(
          ts.factory.createImportSpecifier(false, undefined, el.name),
        )
      }
    }
    if (specifiers.length === 0) return
    importsByModule.set(module, {
      names,
      decl: ts.factory.createImportDeclaration(
        undefined,
        ts.factory.createImportClause(
          isTypeOnly, // typeOnly — preserve from the original export
          undefined,
          ts.factory.createNamedImports(specifiers),
        ),
        ts.factory.createStringLiteral(module),
        undefined,
      ),
    })
    return
  }
  for (const el of elements) {
    if (el.propertyName) continue
    if (!ts.isIdentifier(el.name)) continue
    const name = el.name.text
    if (!name || existing.names.has(name) || seenNames.has(name)) continue
    seenNames.add(name)
    existing.names.add(name)
    const named = existing.decl.importClause!.namedBindings as ts.NamedImports
    existing.decl = ts.factory.updateImportDeclaration(
      existing.decl,
      existing.decl.modifiers,
      ts.factory.updateImportClause(
        existing.decl.importClause!,
        false,
        existing.decl.importClause!.name,
        ts.factory.createNamedImports([
          ...named.elements,
          ts.factory.createImportSpecifier(false, undefined, el.name),
        ]),
      ),
      existing.decl.moduleSpecifier,
      existing.decl.attributes,
    )
  }
}

/**
 * Add names from an existing `NamedImports` clause (the original
 * top-of-file import) to the per-module import map. Reuses the
 * original `ImportDeclaration` node as the entry in the map.
 */
function addNamedSpecifiers(
  module: string,
  elements: ts.NamedImports['elements'],
  importsByModule: Map<string, { names: Set<string>; decl: ts.ImportDeclaration }>,
  decl: ts.ImportDeclaration,
  seenNames: Set<string>,
): void {
  const existing = importsByModule.get(module)
  if (existing) {
    for (const el of elements) {
      const name = el.name?.text
      if (!name || existing.names.has(name) || seenNames.has(name)) continue
      seenNames.add(name)
      existing.names.add(name)
      const named = existing.decl.importClause!.namedBindings as ts.NamedImports
      existing.decl = ts.factory.updateImportDeclaration(
        existing.decl,
        existing.decl.modifiers,
        ts.factory.updateImportClause(
          existing.decl.importClause!,
          false,
          existing.decl.importClause!.name,
          ts.factory.createNamedImports([
            ...named.elements,
            ts.factory.createImportSpecifier(false, undefined, el.name),
          ]),
        ),
        existing.decl.moduleSpecifier,
        existing.decl.attributes,
      )
    }
    return
  }
  const newNames = new Set<string>()
  const filteredElements: ts.NamedImports['elements'] = []
  for (const el of elements) {
    const name = el.name?.text ?? ''
    if (!name || seenNames.has(name)) continue
    seenNames.add(name)
    newNames.add(name)
    filteredElements.push(el)
  }
  if (filteredElements.length === 0) return
  importsByModule.set(module, { names: newNames, decl })
}