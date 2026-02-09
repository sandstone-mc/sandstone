/**
 * Scans the codebase to find classes that are checked with instanceof,
 * and locates where those classes are defined.
 */

import ts from 'typescript'
import { Glob } from 'bun'

export interface InstanceofInfo {
  className: string
  usedInFiles: string[]
}

/**
 * Normalizes a file path to use forward slashes.
 */
function normalizePath(path: string): string {
  return path.replace(/\\/g, '/')
}

/**
 * Scans all TypeScript files in the source directory to find
 * `instanceof ClassName` expressions and collects the class names.
 */
export async function findInstanceofClasses(srcDir: string): Promise<Map<string, InstanceofInfo>> {
  const instanceofClasses = new Map<string, InstanceofInfo>()
  const glob = new Glob('**/*.ts')

  for await (const rawFilePath of glob.scan(srcDir)) {
    const filePath = normalizePath(rawFilePath)
    const fullPath = `${srcDir}/${filePath}`
    const source = await Bun.file(fullPath).text()
    const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true)

    const visit = (node: ts.Node) => {
      // Match: expr instanceof ClassName
      if (
        ts.isBinaryExpression(node) &&
        node.operatorToken.kind === ts.SyntaxKind.InstanceOfKeyword &&
        ts.isIdentifier(node.right)
      ) {
        const className = node.right.text
        const existing = instanceofClasses.get(className)
        if (existing) {
          if (!existing.usedInFiles.includes(filePath)) {
            existing.usedInFiles.push(filePath)
          }
        } else {
          instanceofClasses.set(className, { className, usedInFiles: [filePath] })
        }
      }
      ts.forEachChild(node, visit)
    }

    ts.forEachChild(sourceFile, visit)
  }

  return instanceofClasses
}

/**
 * Scans the source directory to find where each of the given classes is defined.
 * Returns a Map of className -> relative file path (normalized with forward slashes).
 */
export async function findClassDefinitions(
  srcDir: string,
  classNames: Set<string>,
): Promise<Map<string, string>> {
  const classLocations = new Map<string, string>()
  const glob = new Glob('**/*.ts')

  for await (const rawFilePath of glob.scan(srcDir)) {
    const filePath = normalizePath(rawFilePath)
    const fullPath = `${srcDir}/${filePath}`
    const source = await Bun.file(fullPath).text()
    const sourceFile = ts.createSourceFile(filePath, source, ts.ScriptTarget.Latest, true)

    const visit = (node: ts.Node) => {
      if (ts.isClassDeclaration(node) && node.name && classNames.has(node.name.text)) {
        classLocations.set(node.name.text, filePath)
      }
      ts.forEachChild(node, visit)
    }

    ts.forEachChild(sourceFile, visit)
  }

  return classLocations
}

/**
 * Convenience function that combines findInstanceofClasses and findClassDefinitions
 * to build a map of files to the classes they contain that need Symbol.hasInstance.
 */
export async function buildFileToClassesMap(
  srcDir: string,
): Promise<{ fileToClasses: Map<string, string[]>; classNames: Set<string> }> {
  // Find all instanceof checks
  const instanceofClasses = await findInstanceofClasses(srcDir)
  const classNames = new Set(instanceofClasses.keys())

  // Find where each class is defined
  const classLocations = await findClassDefinitions(srcDir, classNames)

  // Build map of file -> classes to transform
  const fileToClasses = new Map<string, string[]>()
  for (const [className, filePath] of classLocations) {
    const existing = fileToClasses.get(filePath) || []
    existing.push(className)
    fileToClasses.set(filePath, existing)
  }

  return { fileToClasses, classNames }
}
