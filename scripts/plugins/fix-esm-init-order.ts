/**
 * Post-processor that fixes __esm initialization order issues.
 *
 * Bun's bundler wraps modules in __esm lazy initializers. When there are
 * circular dependencies, class definitions inside these wrappers may not
 * be available when needed by other modules.
 *
 * The fix:
 * 1. Hoist class definitions and Symbol.for brands outside of __esm wrappers
 * 2. Topologically sort hoisted classes so base classes come before derived
 * 3. Keep side-effect code (init calls, other statements) inside __esm
 */

import { readFile, writeFile } from 'fs/promises'
import ts from 'typescript'

interface HoistedItem {
  code: string
  className?: string
  superClassName?: string | null
  isBrand?: boolean
  originalPosition: number
}

/**
 * Fix __esm initialization order by hoisting and sorting class definitions.
 */
export function fixEsmInitOrder(code: string): string {
  const sourceFile = ts.createSourceFile(
    'bundle.js',
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS
  )

  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

  // Collect all hoistable items from __esm blocks
  const allHoisted: HoistedItem[] = []
  const modifications: Array<{
    blockStart: number
    blockEnd: number
    newStatements: ts.Statement[]
  }> = []

  // Find all __esm wrapper calls
  ts.forEachChild(sourceFile, (node) => {
    if (!ts.isVariableStatement(node)) return

    for (const decl of node.declarationList.declarations) {
      if (!decl.initializer || !ts.isCallExpression(decl.initializer)) continue

      const call = decl.initializer
      if (!ts.isIdentifier(call.expression) || call.expression.text !== '__esm') continue

      const arrowFn = call.arguments[0]
      if (!arrowFn || !ts.isArrowFunction(arrowFn)) continue

      const body = arrowFn.body
      if (!ts.isBlock(body)) continue

      // Analyze statements in this __esm block
      const hoistable: ts.Statement[] = []
      const remaining: ts.Statement[] = []

      for (const stmt of body.statements) {
        const hoistInfo = analyzeStatement(stmt, code, sourceFile)
        if (hoistInfo) {
          hoistable.push(stmt)
          allHoisted.push({
            code: code.slice(stmt.getStart(sourceFile), stmt.getEnd()),
            className: hoistInfo.className,
            superClassName: hoistInfo.superClassName,
            isBrand: hoistInfo.isBrand,
            originalPosition: stmt.getStart(sourceFile),
          })
        } else {
          remaining.push(stmt)
        }
      }

      if (hoistable.length > 0) {
        modifications.push({
          blockStart: body.getStart(sourceFile),
          blockEnd: body.getEnd(),
          newStatements: remaining,
        })
      }
    }
  })

  if (allHoisted.length === 0) return code

  // Topologically sort hoisted items
  const sorted = topologicalSort(allHoisted)

  // Build the hoisted code block
  const hoistedCode = sorted.map(item => item.code).join('\n')

  // Apply modifications in reverse order
  let result = code
  modifications.sort((a, b) => b.blockStart - a.blockStart)

  for (const mod of modifications) {
    // Build new block content
    const newBlockContent = mod.newStatements.length > 0
      ? '{\n' + mod.newStatements.map(s =>
          '  ' + printer.printNode(ts.EmitHint.Unspecified, s, sourceFile)
        ).join('\n') + '\n}'
      : '{}'

    result = result.slice(0, mod.blockStart) + newBlockContent + result.slice(mod.blockEnd)
  }

  // Insert all hoisted code at the beginning, after imports and __esm definition
  const insertPosition = findHoistInsertPosition(result)
  result = result.slice(0, insertPosition) + '\n// Hoisted class definitions\n' + hoistedCode + '\n\n' + result.slice(insertPosition)

  return result
}

/**
 * Find the position to insert hoisted code (after imports and __esm definition).
 */
function findHoistInsertPosition(code: string): number {
  // Find the end of the __esm definition line
  const esmDefMatch = code.match(/var __esm = \([^)]+\) => [^;]+;/)
  if (esmDefMatch && esmDefMatch.index !== undefined) {
    return esmDefMatch.index + esmDefMatch[0].length + 1
  }

  // Fallback: after imports
  const lines = code.split('\n')
  let pos = 0
  for (const line of lines) {
    if (line.startsWith('import ') || line.startsWith('var __')) {
      pos += line.length + 1
    } else if (line.trim() && !line.startsWith('//')) {
      break
    } else {
      pos += line.length + 1
    }
  }
  return pos
}

interface StatementAnalysis {
  className?: string
  superClassName?: string | null
  isBrand?: boolean
}

/**
 * Analyze a statement to determine if it should be hoisted.
 */
function analyzeStatement(stmt: ts.Statement, code: string, sourceFile: ts.SourceFile): StatementAnalysis | null {
  if (!ts.isExpressionStatement(stmt)) return null

  const expr = stmt.expression
  if (!ts.isBinaryExpression(expr) || expr.operatorToken.kind !== ts.SyntaxKind.EqualsToken) {
    return null
  }

  if (!ts.isIdentifier(expr.left)) return null

  const right = expr.right

  // Class expression: SomeClass = class SomeClass { ... }
  if (ts.isClassExpression(right)) {
    const className = expr.left.text
    let superClassName: string | null = null

    if (right.heritageClauses) {
      for (const clause of right.heritageClauses) {
        if (clause.token === ts.SyntaxKind.ExtendsKeyword && clause.types[0]) {
          const superType = clause.types[0]
          if (ts.isIdentifier(superType.expression)) {
            superClassName = superType.expression.text
          }
        }
      }
    }

    return { className, superClassName }
  }

  // Call expressions that should be hoisted
  if (ts.isCallExpression(right)) {
    const callee = right.expression

    // Symbol.for call: BRAND = Symbol.for('...')
    if (
      ts.isPropertyAccessExpression(callee) &&
      ts.isIdentifier(callee.expression) &&
      callee.expression.text === 'Symbol' &&
      callee.name.text === 'for'
    ) {
      return { isBrand: true }
    }

    // makeClassCallable call: SomeClass = makeClassCallable(_RawSomeClass)
    if (ts.isIdentifier(callee) && callee.text === 'makeClassCallable') {
      return { className: expr.left.text }
    }
  }

  return null
}

/**
 * Topologically sort hoisted items so base classes come before derived classes.
 */
function topologicalSort(items: HoistedItem[]): HoistedItem[] {
  // Separate brands and classes
  const brands = items.filter(i => i.isBrand)
  const classes = items.filter(i => i.className)

  // Build a map of class name to item
  const classMap = new Map<string, HoistedItem>()
  for (const item of classes) {
    if (item.className) {
      classMap.set(item.className, item)
    }
  }

  // Topological sort of classes
  const sortedClasses: HoistedItem[] = []
  const visited = new Set<string>()
  const visiting = new Set<string>()

  function visit(className: string): boolean {
    if (visited.has(className)) return true
    if (visiting.has(className)) return false // Cycle

    const item = classMap.get(className)
    if (!item) return true // External class

    visiting.add(className)

    // Visit superclass first
    if (item.superClassName && classMap.has(item.superClassName)) {
      if (!visit(item.superClassName)) return false
    }

    visiting.delete(className)
    visited.add(className)
    sortedClasses.push(item)
    return true
  }

  for (const item of classes) {
    if (item.className && !visited.has(item.className)) {
      visit(item.className)
    }
  }

  // Brands first, then sorted classes
  return [...brands, ...sortedClasses]
}

/**
 * Post-process a bundle file to fix __esm init order.
 */
export async function fixEsmInitOrderInFile(filePath: string): Promise<boolean> {
  const content = await readFile(filePath, 'utf8')

  // Only process files with __esm
  if (!content.includes('__esm')) {
    return false
  }

  const fixed = fixEsmInitOrder(content)

  if (fixed !== content) {
    await writeFile(filePath, fixed)
    return true
  }

  return false
}
