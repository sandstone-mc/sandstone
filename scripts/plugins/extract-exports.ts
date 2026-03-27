/**
 * Extracts export names from TypeScript declaration files and JS bundles.
 *
 * This is used to generate re-export files for the new bundle architecture where
 * a single main bundle is generated and thin re-export files point back to it.
 */

import ts from 'typescript'
import { readFile, access } from 'fs/promises'
import { join, dirname } from 'path'

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path)
    return true
  } catch {
    return false
  }
}

/**
 * Extracts all export names from a declaration file.
 * Uses AST-only parsing with recursive `export *` resolution.
 *
 * @param dtsPath - Absolute path to the .d.ts file
 * @param visited - Set of already-visited paths (prevents cycles)
 * @returns Set of all exported names from this module
 */
export async function extractExportsFromDts(
  dtsPath: string,
  visited: Set<string> = new Set(),
): Promise<Set<string>> {
  if (visited.has(dtsPath)) return new Set()
  visited.add(dtsPath)

  let content: string
  try {
    content = await readFile(dtsPath, 'utf8')
  } catch {
    return new Set()
  }

  const sourceFile = ts.createSourceFile(
    dtsPath,
    content,
    ts.ScriptTarget.Latest,
    false,
  )

  const { exports, reExportPaths } = extractExportsFromDtsAST(sourceFile)

  // Recursively follow export * from './path'
  const fromDir = dirname(dtsPath)
  const reExportPromises = reExportPaths.map(async (p) => {
    const basePath = p.endsWith('.js') ? p.replace(/\.js$/, '') : p
    const filePath = join(fromDir, `${basePath}.d.ts`)
    const dirPath = join(fromDir, basePath, 'index.d.ts')

    // Try file.d.ts first, then directory/index.d.ts
    const resolved = (await fileExists(filePath)) ? filePath : dirPath
    return extractExportsFromDts(resolved, visited)
  })

  for (const reExports of await Promise.all(reExportPromises)) {
    for (const name of reExports) {
      exports.add(name)
    }
  }

  return exports
}

/**
 * Extract exports from AST. Returns direct exports and re-export paths.
 */
function extractExportsFromDtsAST(sourceFile: ts.SourceFile): {
  exports: Set<string>
  reExportPaths: string[]
} {
  const exports = new Set<string>()
  const reExportPaths: string[] = []

  ts.forEachChild(sourceFile, (node) => {
    if (ts.isExportDeclaration(node)) {
      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        for (const element of node.exportClause.elements) {
          exports.add(element.name.text)
        }
      } else if (!node.exportClause && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)) {
        // export * from './path'
        const path = node.moduleSpecifier.text
        if (path.startsWith('.')) {
          reExportPaths.push(path)
        }
      }
    }

    if (
      (ts.isClassDeclaration(node) ||
        ts.isFunctionDeclaration(node) ||
        ts.isInterfaceDeclaration(node) ||
        ts.isTypeAliasDeclaration(node) ||
        ts.isEnumDeclaration(node)) &&
      node.name &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      exports.add(node.name.text)
    }

    if (ts.isVariableStatement(node)) {
      const hasExport = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      if (hasExport) {
        for (const decl of node.declarationList.declarations) {
          if (ts.isIdentifier(decl.name)) {
            exports.add(decl.name.text)
          }
        }
      }
    }
  })

  return { exports, reExportPaths }
}

/**
 * Extracts value exports from a JavaScript bundle file.
 * Parses the ESM export statements to find what's actually exported as values.
 *
 * @param jsPath - Absolute path to the .js bundle file
 * @returns Set of all value export names
 */
export async function extractExportsFromJs(jsPath: string): Promise<Set<string>> {
  const exports = new Set<string>()
  const content = await readFile(jsPath, 'utf8')

  // Parse with TypeScript (it can parse JS too)
  const sourceFile = ts.createSourceFile(
    'bundle.js',
    content,
    ts.ScriptTarget.Latest,
    false, // setParentNodes = false for faster parsing
    ts.ScriptKind.JS,
  )

  ts.forEachChild(sourceFile, (node) => {
    // export { A, B, C }
    if (ts.isExportDeclaration(node)) {
      if (node.exportClause && ts.isNamedExports(node.exportClause)) {
        for (const element of node.exportClause.elements) {
          exports.add(element.name.text)
        }
      }
    }

    // export var/const/let
    if (ts.isVariableStatement(node)) {
      const hasExport = node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
      if (hasExport) {
        for (const decl of node.declarationList.declarations) {
          if (ts.isIdentifier(decl.name)) {
            exports.add(decl.name.text)
          }
        }
      }
    }

    // export function / export class
    if (
      (ts.isFunctionDeclaration(node) || ts.isClassDeclaration(node)) &&
      node.name &&
      node.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
    ) {
      exports.add(node.name.text)
    }
  })

  return exports
}

/**
 * Extracts exports from a directory's index.d.ts file.
 */
export async function extractSubpathExportsFromDts(
  typesDir: string,
  subpath: string,
): Promise<Set<string>> {
  const dtsPath = subpath
    ? join(typesDir, subpath, 'index.d.ts')
    : join(typesDir, 'sandstone.d.ts')

  try {
    return await extractExportsFromDts(dtsPath)
  } catch (error) {
    console.warn(`Failed to extract exports from ${dtsPath}:`, error)
    return new Set()
  }
}

/**
 * Computes the set difference: items in `set` that are not in `exclude`.
 */
export function diff<T>(set: Set<T>, exclude: Set<T>): Set<T> {
  return new Set([...set].filter((x) => !exclude.has(x)))
}

/**
 * Computes the intersection of two sets.
 */
export function intersect<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a].filter((x) => b.has(x)))
}
