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
 * Walk a `*.ts`/`*.d.ts` file and collect every exported variable
 * declaration's identifier position. Used to build the source map for
 * the bundled `dist/_internal/index.d.ts`.
 */
export async function collectExportedSymbols(
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