/**
 * Fixes duplicate exports in JavaScript bundle output using AST manipulation.
 * Bun's bundler sometimes outputs duplicate export statements which cause errors.
 */

import ts from 'typescript'

// TODO: this is reporting "Fixed duplicates in 0 files", we need to sort this out. claude --resume 61a160b4-1b53-43cb-b658-a85191e6fabe

/**
 * Removes duplicate export specifiers from JavaScript source code.
 * Uses TypeScript's AST to reliably parse and transform the exports.
 */
export function fixDuplicateExports(source: string): { content: string; modified: boolean } {
  // Parse as JS (ScriptKind.JS) since this is bundled output
  const sourceFile = ts.createSourceFile('file.js', source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)

  const exportedNames = new Set<string>()
  const statementsToKeep: ts.Statement[] = []
  let modified = false

  for (const statement of sourceFile.statements) {
    // Handle: export { Name1, Name2, ... };
    if (
      ts.isExportDeclaration(statement) &&
      statement.exportClause &&
      ts.isNamedExports(statement.exportClause)
    ) {
      const uniqueSpecifiers: ts.ExportSpecifier[] = []

      for (const spec of statement.exportClause.elements) {
        // The exported name is either the alias (if present) or the name itself
        // export { foo as bar } -> bar is the exported name
        // export { foo } -> foo is the exported name
        const exportedName = (spec.name).text

        if (exportedNames.has(exportedName)) {
          modified = true
          continue // Skip duplicate
        }

        exportedNames.add(exportedName)
        uniqueSpecifiers.push(spec)
      }

      if (uniqueSpecifiers.length === 0) {
        modified = true
        continue // Skip entire empty export statement
      }

      if (uniqueSpecifiers.length !== statement.exportClause.elements.length) {
        // Create new export with only unique specifiers
        modified = true
        statementsToKeep.push(
          ts.factory.updateExportDeclaration(
            statement,
            statement.modifiers,
            statement.isTypeOnly,
            ts.factory.createNamedExports(uniqueSpecifiers),
            statement.moduleSpecifier,
            statement.attributes,
          ),
        )
      } else {
        statementsToKeep.push(statement)
      }
    } else {
      statementsToKeep.push(statement)
    }
  }

  if (!modified) {
    return { content: source, modified: false }
  }

  const newSourceFile = ts.factory.updateSourceFile(sourceFile, statementsToKeep)
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  const output = printer.printFile(newSourceFile)

  return { content: output, modified: true }
}
