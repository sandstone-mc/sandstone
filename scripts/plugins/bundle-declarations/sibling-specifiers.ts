/**
 * Rewrite `./X.js` module specifiers to `./X/index.js` when `./X/` is a
 * directory in the staged bundle. Eliminates reliance on bundler
 * resolution at runtime — the explicit `/index.js` path always resolves.
 *
 * Applies to both `import` and `export` declarations.
 */
import { statSync } from 'fs'
import path from 'path'
import * as ts from 'typescript'

/**
 * Rewrite a sibling `.d.ts` file's module specifiers in place. Returns the
 * new source text (or the input unchanged if nothing was rewritten).
 */
export function rewriteSiblingSpecifiers(
  source: string,
  sourceFile: string,
): string {
  const sf = ts.createSourceFile('_.ts', source, ts.ScriptTarget.Latest, true)
  const fileDir = path.dirname(sourceFile)

  const newStmts = sf.statements.map((stmt) =>
    rewriteStatementSpecifier(stmt, fileDir),
  )
  if (newStmts.every((s, i) => s === sf.statements[i])) return source
  return ts.createPrinter().printFile(ts.factory.updateSourceFile(sf, newStmts))
}

function rewriteStatementSpecifier(
  stmt: ts.Statement,
  fileDir: string,
): ts.Statement {
  if (
    ts.isImportDeclaration(stmt) &&
    stmt.moduleSpecifier &&
    ts.isStringLiteral(stmt.moduleSpecifier)
  ) {
    const updated = rewriteImportLikeSpecifier(
      stmt.moduleSpecifier.text,
      fileDir,
      (newModule) =>
        ts.factory.updateImportDeclaration(
          stmt,
          stmt.modifiers,
          stmt.importClause,
          ts.factory.createStringLiteral(newModule),
          stmt.attributes,
        ),
    )
    if (updated) return updated
  }
  if (
    ts.isExportDeclaration(stmt) &&
    stmt.moduleSpecifier &&
    ts.isStringLiteral(stmt.moduleSpecifier)
  ) {
    const updated = rewriteImportLikeSpecifier(
      stmt.moduleSpecifier.text,
      fileDir,
      (newModule) =>
        ts.factory.updateExportDeclaration(
          stmt,
          stmt.modifiers,
          stmt.isTypeOnly,
          stmt.exportClause,
          ts.factory.createStringLiteral(newModule),
          undefined,
        ),
    )
    if (updated) return updated
  }
  return stmt
}

/**
 * If `specifier` is `./X.js` and `./X/` is a directory in `fileDir`,
 * return a new node with the specifier rewritten to `./X/index.js`.
 * Returns null if no rewrite is applicable.
 */
function rewriteImportLikeSpecifier<T extends ts.Statement>(
  specifier: string,
  fileDir: string,
  buildReplacement: (newModule: string) => T,
): T | null {
  if (!specifier.startsWith('./') || !specifier.endsWith('.js')) return null
  const dir = specifier.slice(2, -3)
  if (!dir || dir.includes('..')) return null
  const dirPath = path.join(fileDir, dir)
  try {
    if (!statSync(dirPath).isDirectory()) return null
  } catch {
    return null
  }
  return buildReplacement(`./${dir}/index.js`)
}