/**
 * Fixes import paths in TypeScript declaration files using AST manipulation.
 * - Converts path aliases (sandstone/*) to relative paths
 * - Adds .js extensions to relative imports
 * - Handles directory imports with /index.js
 */

import ts from 'typescript'
import { join, relative, dirname } from 'path'
import { posix } from 'path'

/**
 * Fixes import paths in a .d.ts file.
 *
 * @param source - The source code of the .d.ts file
 * @param fileDir - The directory containing this file (absolute path)
 * @param distDir - The root dist directory (absolute path)
 * @param indexDirs - Set of relative paths (from distDir) that have index.ts files
 */
export function fixDtsImports(
  source: string,
  fileDir: string,
  distDir: string,
  indexDirs: Set<string>,
): { content: string; modified: boolean } {
  const sourceFile = ts.createSourceFile('file.d.ts', source, ts.ScriptTarget.Latest, true)

  let modified = false

  // Normalize paths to use forward slashes
  const normalizedFileDir = fileDir.replace(/\\/g, '/')
  const normalizedDistDir = distDir.replace(/\\/g, '/')

  /**
   * Resolves an import path, converting sandstone/* to relative and adding extensions.
   */
  function resolveModulePath(importPath: string): string | undefined {
    // Handle sandstone/* path aliases
    // These resolve to bundleDir/types/subpath (since .d.ts files are in types/ subdir)
    if (importPath.startsWith('sandstone/')) {
      const subPath = importPath.slice('sandstone/'.length).replace(/\.ts$/, '')

      // Target is in the types/ subdirectory of bundleDir
      const targetPath = posix.join(normalizedDistDir, 'types', subPath)

      // Calculate the relative path from the current file's directory to the target
      let relPath = posix.relative(normalizedFileDir, targetPath)

      // Ensure it starts with ./ or ../
      if (!relPath.startsWith('.')) {
        relPath = './' + relPath
      }

      if (indexDirs.has(subPath)) {
        return `${relPath}/index.js`
      }
      return `${relPath}.js`
    }

    // Handle sandstone root import - resolves to bundleDir/index.js
    if (importPath === 'sandstone') {
      let relPath = posix.relative(normalizedFileDir, normalizedDistDir)
      if (!relPath.startsWith('.')) {
        relPath = './' + relPath
      }
      return `${relPath}/index.js`
    }

    // Handle relative imports
    if (importPath.startsWith('./') || importPath.startsWith('../')) {
      // Skip if already has extension
      if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
        return undefined
      }

      // Remove .ts extension if present
      const cleanPath = importPath.replace(/\.ts$/, '')

      // Check if this resolves to a directory with an index file
      if (isIndexDir(cleanPath, fileDir, distDir, indexDirs)) {
        return `${cleanPath}/index.js`
      }

      return `${cleanPath}.js`
    }

    return undefined
  }

  /**
   * Updates a module specifier string literal if needed.
   */
  function maybeUpdateModuleSpecifier(specifier: ts.StringLiteral): ts.StringLiteral | undefined {
    const newPath = resolveModulePath(specifier.text)
    if (newPath && newPath !== specifier.text) {
      modified = true
      return ts.factory.createStringLiteral(newPath)
    }
    return undefined
  }

  const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
    return (root) => {
      const visit: ts.Visitor = (node): ts.Node => {
        // Handle: import { X } from 'path'
        if (ts.isImportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
          const newSpecifier = maybeUpdateModuleSpecifier(node.moduleSpecifier)
          if (newSpecifier) {
            return ts.factory.updateImportDeclaration(
              node,
              node.modifiers,
              node.importClause,
              newSpecifier,
              node.attributes,
            )
          }
        }

        // Handle: export { X } from 'path'
        if (ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
          const newSpecifier = maybeUpdateModuleSpecifier(node.moduleSpecifier)
          if (newSpecifier) {
            return ts.factory.updateExportDeclaration(
              node,
              node.modifiers,
              node.isTypeOnly,
              node.exportClause,
              newSpecifier,
              node.attributes,
            )
          }
        }

        // Handle: import("path") type imports
        if (ts.isImportTypeNode(node) && ts.isLiteralTypeNode(node.argument)) {
          const literal = node.argument.literal
          if (ts.isStringLiteral(literal)) {
            const newPath = resolveModulePath(literal.text)
            if (newPath && newPath !== literal.text) {
              modified = true
              return ts.factory.updateImportTypeNode(
                node,
                ts.factory.createLiteralTypeNode(ts.factory.createStringLiteral(newPath)),
                node.attributes,
                node.qualifier,
                node.typeArguments,
                node.isTypeOf,
              )
            }
          }
        }

        return ts.visitEachChild(node, visit, context)
      }

      return ts.visitNode(root, visit) as ts.SourceFile
    }
  }

  const result = ts.transform(sourceFile, [transformer])
  const transformedFile = result.transformed[0]

  if (!modified) {
    result.dispose()
    return { content: source, modified: false }
  }

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  const output = printer.printFile(transformedFile)

  result.dispose()
  return { content: output, modified: true }
}

/**
 * Checks if a relative import path resolves to a directory with an index file.
 */
function isIndexDir(
  importPath: string,
  fromFileDir: string,
  distDir: string,
  indexDirs: Set<string>,
): boolean {
  // Get the relative path of the file's directory from distDir
  const fromRelative = fromFileDir.replace(distDir, '').replace(/\\/g, '/').replace(/^\//, '')
  const fromParts = fromRelative.split('/').filter(Boolean)

  // Parse the import path and resolve it relative to the file
  const importParts = importPath.split('/')
  const currentParts = [...fromParts]

  for (const part of importParts) {
    if (part === '..') {
      currentParts.pop()
    } else if (part !== '.') {
      currentParts.push(part)
    }
  }

  const resolvedPath = currentParts.join('/')
  // Strip 'types/' prefix since indexDirs is relative to src/, not dist/_internal/types/
  const normalizedPath = resolvedPath.replace(/^types\//, '')
  return indexDirs.has(normalizedPath)
}
