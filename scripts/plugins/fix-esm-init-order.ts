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
 *
 * Uses MagicString's move() for source-map-aware transformations and
 * @ampproject/remapping to chain the transformation map with the original source map.
 */

import { readFile, writeFile } from 'fs/promises'
import ts from 'typescript'
import MagicString from 'magic-string'
import remapping from '@ampproject/remapping'

interface HoistedItem {
  start: number
  end: number
  className?: string
  superClassName?: string | null
  isBrand?: boolean
}

/**
 * Fix __esm initialization order by hoisting and sorting class definitions.
 * Uses MagicString's move() to preserve source mappings.
 * Returns the MagicString instance for source map generation.
 */
export function fixEsmInitOrder(code: string): MagicString | null {
  const sourceFile = ts.createSourceFile(
    'bundle.js',
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS
  )

  // Collect all hoistable items from __esm blocks
  const allHoisted: HoistedItem[] = []

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
      for (const stmt of body.statements) {
        const hoistInfo = analyzeStatement(stmt)
        if (hoistInfo) {
          const start = stmt.getStart(sourceFile)
          let end = stmt.getEnd()
          // Include trailing newline if present
          while (end < code.length && (code[end] === ' ' || code[end] === '\n')) {
            end++
            if (code[end - 1] === '\n') break
          }
          allHoisted.push({
            start,
            end,
            className: hoistInfo.className,
            superClassName: hoistInfo.superClassName,
            isBrand: hoistInfo.isBrand,
          })
        }
      }
    }
  })

  if (allHoisted.length === 0) return null

  // Topologically sort hoisted items
  const sorted = topologicalSort(allHoisted)

  // Create MagicString for source-map-aware modifications
  const s = new MagicString(code)

  // Find insert position (after imports and __esm definition)
  const insertPosition = findHoistInsertPosition(code)

  // Insert header comment at the insertion point
  s.appendLeft(insertPosition, '\n// Hoisted class definitions\n')

  // Move each hoisted item to the insertion point, in forward order
  // MagicString's move() appends items moved to the same position in the order they're moved
  // Since sorted array has base classes first, forward iteration gives correct order
  for (const item of sorted) {
    s.move(item.start, item.end, insertPosition)
  }

  // Add a blank line after the hoisted block
  // Find where the last hoisted item now ends (at insertPosition since we moved everything there)
  s.appendLeft(insertPosition, '\n')

  return s
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
function analyzeStatement(stmt: ts.Statement): StatementAnalysis | null {
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
 * Also updates the accompanying source map using remapping.
 */
export async function fixEsmInitOrderInFile(filePath: string): Promise<boolean> {
  const content = await readFile(filePath, 'utf8')

  // Only process files with __esm
  if (!content.includes('__esm')) {
    return false
  }

  const magicString = fixEsmInitOrder(content)

  if (!magicString) {
    return false
  }

  // Write the modified code
  const newCode = magicString.toString()
  await writeFile(filePath, newCode)

  // Update the source map if it exists
  const mapPath = filePath + '.map'
  try {
    const originalMapContent = await readFile(mapPath, 'utf8')
    const originalMap = JSON.parse(originalMapContent)

    // Generate the transformation source map from MagicString
    // This maps: new code positions -> original bundle positions
    const transformMap = magicString.generateMap({
      source: 'index.js',
      file: 'index.js',
      includeContent: false,
      hires: true,
    })

    // Use remapping to chain: new code -> bundle -> original sources
    // remapping takes maps in reverse order (output first, then inputs)
    const remapped = remapping(
      [transformMap as any, originalMap],
      () => null // No additional source loading needed
    )

    await writeFile(mapPath, JSON.stringify(remapped))
  } catch {
    // Source map might not exist, that's fine
  }

  return true
}
