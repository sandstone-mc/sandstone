/**
 * Helpers for collecting exported symbol names + positions from a
 * `*.d.ts` source via the TS compiler API (no regex).
 */
import { readFile } from 'fs/promises'
import * as ts from '@typescript/typescript6'

/** True if `node` has the `export` modifier. */
export function hasExportModifier(node: ts.Node): boolean {
  return (
    (ts.canHaveModifiers(node) &&
      ts.getModifiers(node)?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)) ??
    false
  )
}

/** Collect top-level names from `export const a, b, c: T` / `export class X` / … */
export function collectNamesFromStatement(stmt: ts.Statement, out: Set<string>): void {
  if (ts.isVariableStatement(stmt)) {
    for (const decl of stmt.declarationList.declarations) {
      collectBindingNames(decl.name, out)
    }
    return
  }
  if (
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

/** Collect names from a destructuring binding pattern. */
export function collectBindingNames(name: ts.BindingName, out: Set<string>): void {
  if (ts.isIdentifier(name)) {
    out.add(name.text)
    return
  }
  if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
    for (const el of name.elements) {
      if (ts.isBindingElement(el)) collectBindingNames(el.name, out)
    }
  }
}

/**
 * Walk a `*.ts`/`*.d.ts` file and collect every top-level exported
 * declaration's identifier position. Handles variable declarations
 * (`export const X = ...` / `export const { a, b } = ...`), class,
 * function, interface, type alias, and enum declarations. Returns
 * 1-based line + 0-based character — matching the rest of the lib.
 *
 * Used to build the source map for the bundled
 * `dist/_internal/index.d.ts` (which only contains destructured
 * `export const` rows in `src/sandstone.ts`) and to find redirect
 * targets in command impl files (which export classes like
 * `export class GiveCommand`, not variables).
 */
export async function collectExportedSymbols(
  file: string,
): Promise<{ name: string; line: number; col: number }[]> {
  const src = await readFile(file, 'utf8').catch(() => '')
  const sf = ts.createSourceFile(
    file,
    src,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const out: { name: string; line: number; col: number }[] = []

  function visit(node: ts.Node) {
    // `modifiers` only exists on nodes that can carry modifiers (not all
    // nodes do). `ts.canHaveModifiers` is the typed way to gate the
    // access without `as any`.
    const isExported = ts.canHaveModifiers(node) &&
      (ts.getModifiers(node) ?? []).some(
        (m: ts.Modifier) => m.kind === ts.SyntaxKind.ExportKeyword,
      )

    if (isExported) {
      const pushAt = (name: ts.Identifier | undefined) => {
        if (!name) return
        const pos = sf.getLineAndCharacterOfPosition(name.getStart(sf))
        out.push({ name: name.text, line: pos.line + 1, col: pos.character })
      }

      if (ts.isVariableStatement(node)) {
        for (const decl of node.declarationList.declarations) {
          if (ts.isIdentifier(decl.name)) {
            pushAt(decl.name)
          } else if (
            ts.isObjectBindingPattern(decl.name) ||
            ts.isArrayBindingPattern(decl.name)
          ) {
            for (const el of decl.name.elements) {
              if (
                ts.isBindingElement(el) &&
                ts.isIdentifier(el.name)
              ) {
                pushAt(el.name)
              }
            }
          }
        }
      } else if (
        ts.isClassDeclaration(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node) ||
        ts.isEnumDeclaration(node)
      ) {
        pushAt(node.name)
      } else if (ts.isModuleDeclaration(node)) {
        // `ModuleDeclaration.name` is `ModuleName | StringLiteral` —
        // accept both for the position lookup.
        const moduleName = node.name
        if (ts.isIdentifier(moduleName)) pushAt(moduleName)
        else if (ts.isStringLiteral(moduleName)) {
          const pos = sf.getLineAndCharacterOfPosition(moduleName.getStart(sf))
          out.push({
            name: moduleName.text,
            line: pos.line + 1,
            col: pos.character,
          })
        }
      }
    }

    ts.forEachChild(node, visit)
  }

  visit(sf)
  return out
}