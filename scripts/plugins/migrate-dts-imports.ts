/**
 * Post-processor that migrates imports in .d.ts files to use the correct entry points.
 *
 * When a .d.ts file imports from a subpath (e.g., './variables/index.js') but the
 * imported name is actually exported from the main entry (sandstone.d.ts), this
 * processor rewrites the import to use the main entry instead.
 */

import ts from 'typescript'
import { readFile, writeFile, readdir, stat } from 'fs/promises'
import { join, dirname, relative, posix } from 'path'

/**
 * Migrates imports in all .d.ts files in a directory.
 *
 * @param distDir - The dist/ directory
 * @param mainExports - Set of export names from the main entry (sandstone.d.ts)
 * @param subpaths - List of subpath names (e.g., ['variables', 'core', ...])
 */
export async function migrateDtsImports(
  distDir: string,
  mainExports: Set<string>,
  subpaths: string[],
): Promise<number> {
  let migratedCount = 0

  // Build a set of subpath patterns to match
  const subpathPatterns = new Set(subpaths)

  // Process all .d.ts files (except the main index itself)
  const mainIndexPath = join(distDir, 'index.d.ts')
  for await (const filePath of walkDtsFiles(distDir)) {
    // Skip the main index - it should not have its imports rewritten to itself
    if (filePath === mainIndexPath) {
      continue
    }
    const migrated = await migrateFileImports(filePath, distDir, mainExports, subpathPatterns)
    if (migrated) {
      migratedCount++
    }
  }

  return migratedCount
}

/**
 * Recursively walks a directory yielding .d.ts file paths.
 */
async function* walkDtsFiles(dir: string): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walkDtsFiles(fullPath)
    } else if (entry.name.endsWith('.d.ts')) {
      yield fullPath
    }
  }
}

/**
 * Migrates imports in a single .d.ts file.
 * Returns true if any imports were migrated.
 */
async function migrateFileImports(
  filePath: string,
  distDir: string,
  mainExports: Set<string>,
  subpathPatterns: Set<string>,
): Promise<boolean> {
  const content = await readFile(filePath, 'utf8')
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true)

  const fileDir = dirname(filePath)
  let modified = false
  const edits: Array<{ start: number; end: number; newText: string }> = []

  ts.forEachChild(sourceFile, (node) => {
    // Handle: import { X, Y } from './subpath/index.js'
    if (ts.isImportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const result = processImportOrExport(
        node,
        node.moduleSpecifier,
        node.importClause,
        fileDir,
        distDir,
        mainExports,
        subpathPatterns,
        sourceFile,
      )
      if (result) {
        edits.push(result)
        modified = true
      }
    }

    // Handle: export { X, Y } from './subpath/index.js'
    if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
      const result = processExportDeclaration(
        node,
        node.moduleSpecifier,
        fileDir,
        distDir,
        mainExports,
        subpathPatterns,
        sourceFile,
      )
      if (result) {
        edits.push(...result)
        modified = true
      }
    }
  })

  if (modified) {
    // Apply edits in reverse order to preserve positions
    let newContent = content
    edits.sort((a, b) => b.start - a.start)
    for (const edit of edits) {
      newContent = newContent.slice(0, edit.start) + edit.newText + newContent.slice(edit.end)
    }
    await writeFile(filePath, newContent)
  }

  return modified
}

/**
 * Checks if a module specifier points to a subpath entry.
 * Returns the subpath name if it does, null otherwise.
 */
function getSubpathFromSpecifier(
  specifier: string,
  fileDir: string,
  distDir: string,
  subpathPatterns: Set<string>,
): string | null {
  // Must be a relative import
  if (!specifier.startsWith('./') && !specifier.startsWith('../')) {
    return null
  }

  // Resolve to absolute path
  const resolvedPath = join(fileDir, specifier).replace(/\\/g, '/')

  // Check if it matches a subpath pattern
  // Subpaths are in <distDir>/types/<subpath>/
  for (const subpath of subpathPatterns) {
    const subpathIndex = `${distDir.replace(/\\/g, '/')}/types/${subpath}/index`
    if (resolvedPath.startsWith(subpathIndex)) {
      return subpath
    }
  }

  return null
}

/**
 * Computes the relative path from fileDir to the main index.
 */
function getRelativePathToMain(fileDir: string, distDir: string): string {
  const rel = relative(fileDir, distDir).replace(/\\/g, '/')
  return rel === '' ? './index.js' : `${rel}/index.js`
}

/**
 * Process an import declaration to potentially migrate it.
 */
function processImportOrExport(
  node: ts.ImportDeclaration,
  moduleSpecifier: ts.StringLiteral,
  importClause: ts.ImportClause | undefined,
  fileDir: string,
  distDir: string,
  mainExports: Set<string>,
  subpathPatterns: Set<string>,
  sourceFile: ts.SourceFile,
): { start: number; end: number; newText: string } | null {
  const specifier = moduleSpecifier.text
  const subpath = getSubpathFromSpecifier(specifier, fileDir, distDir, subpathPatterns)

  if (!subpath) return null

  // Get the imported names
  if (!importClause?.namedBindings || !ts.isNamedImports(importClause.namedBindings)) {
    return null
  }

  const namedImports = importClause.namedBindings
  const importedNames = namedImports.elements.map((e) => e.name.text)

  // Check if ALL imported names are in mainExports
  const allInMain = importedNames.every((name) => mainExports.has(name))

  if (allInMain) {
    // Rewrite the entire module specifier to point to main
    const newSpecifier = getRelativePathToMain(fileDir, distDir)
    return {
      start: moduleSpecifier.getStart(sourceFile),
      end: moduleSpecifier.getEnd(),
      newText: `'${newSpecifier}'`,
    }
  }

  // If some are in main and some aren't, we'd need to split the import
  // For now, leave it as-is (the subpath should still export it)
  return null
}

/**
 * Process an export declaration to potentially migrate it.
 * May need to split into multiple exports if some names go to main and others stay.
 */
function processExportDeclaration(
  node: ts.ExportDeclaration,
  moduleSpecifier: ts.StringLiteral,
  fileDir: string,
  distDir: string,
  mainExports: Set<string>,
  subpathPatterns: Set<string>,
  sourceFile: ts.SourceFile,
): Array<{ start: number; end: number; newText: string }> | null {
  const specifier = moduleSpecifier.text
  const subpath = getSubpathFromSpecifier(specifier, fileDir, distDir, subpathPatterns)

  if (!subpath) return null

  // Get the exported names
  if (!node.exportClause || !ts.isNamedExports(node.exportClause)) {
    return null
  }

  const exportElements = node.exportClause.elements
  const exportedNames = exportElements.map((e) => ({
    name: e.name.text,
    propertyName: e.propertyName?.text,
    element: e,
  }))

  // Separate into main exports and subpath exports
  const mainNames = exportedNames.filter((e) => mainExports.has(e.name))
  const subpathNames = exportedNames.filter((e) => !mainExports.has(e.name))

  if (mainNames.length === 0) {
    // Nothing to migrate
    return null
  }

  if (subpathNames.length === 0) {
    // All names go to main - just rewrite the specifier
    const newSpecifier = getRelativePathToMain(fileDir, distDir)
    return [
      {
        start: moduleSpecifier.getStart(sourceFile),
        end: moduleSpecifier.getEnd(),
        newText: `'${newSpecifier}'`,
      },
    ]
  }

  // Need to split the export into two statements
  const mainSpecifier = getRelativePathToMain(fileDir, distDir)
  const mainExportList = mainNames.map((e) => e.name).join(', ')
  const subpathExportList = subpathNames.map((e) => e.name).join(', ')

  const newText =
    `export { ${subpathExportList} } from '${specifier}'\n` +
    `export { ${mainExportList} } from '${mainSpecifier}'`

  return [
    {
      start: node.getStart(sourceFile),
      end: node.getEnd(),
      newText,
    },
  ]
}
