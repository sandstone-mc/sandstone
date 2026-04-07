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
 * This version maintains accurate source maps by:
 * 1. Reading the original source map
 * 2. Tracking where hoisted code came from (original line numbers)
 * 3. Creating a new source map that maps hoisted lines to their original sources
 */

import { readFile, writeFile } from 'fs/promises'
import ts from 'typescript'
import { SourceMapConsumer, SourceMapGenerator, type RawSourceMap } from 'source-map-js'

interface HoistedItem {
  code: string
  /** Line number in the ORIGINAL bundle (1-indexed) */
  originalStartLine: number
  /** Number of lines in this item */
  lineCount: number
  className?: string
  superClassName?: string | null
  isBrand?: boolean
}

interface ModificationBlock {
  blockStart: number
  blockEnd: number
  statementsToRemove: Array<{ start: number; end: number }>
}

/** Count newlines before a position to get the 1-indexed line number */
function getLineNumber(code: string, pos: number): number {
  let line = 1
  for (let i = 0; i < pos && i < code.length; i++) {
    if (code[i] === '\n') line++
  }
  return line
}

/** Count lines in a string */
function countLines(str: string): number {
  let count = 1
  for (const ch of str) {
    if (ch === '\n') count++
  }
  return count
}

/**
 * Fix __esm initialization order by hoisting and sorting class definitions.
 * Returns the modified code and metadata needed for source map updates.
 */
export function fixEsmInitOrder(code: string): {
  code: string
  hoistedItems: HoistedItem[]
  insertLine: number
  removedRanges: Array<{ startLine: number; endLine: number }>
} | null {
  const sourceFile = ts.createSourceFile(
    'bundle.js',
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS
  )

  // Collect all hoistable items from __esm blocks
  const allHoisted: HoistedItem[] = []
  const modifications: ModificationBlock[] = []

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
      const statementsToRemove: Array<{ start: number; end: number }> = []

      for (const stmt of body.statements) {
        const hoistInfo = analyzeStatement(stmt)
        if (hoistInfo) {
          const start = stmt.getStart(sourceFile)
          const end = stmt.getEnd()
          const stmtCode = code.slice(start, end)
          statementsToRemove.push({ start, end })
          allHoisted.push({
            code: stmtCode,
            originalStartLine: getLineNumber(code, start),
            lineCount: countLines(stmtCode),
            className: hoistInfo.className,
            superClassName: hoistInfo.superClassName,
            isBrand: hoistInfo.isBrand,
          })
        }
      }

      if (statementsToRemove.length > 0) {
        modifications.push({
          blockStart: body.getStart(sourceFile),
          blockEnd: body.getEnd(),
          statementsToRemove,
        })
      }
    }
  })

  if (allHoisted.length === 0) return null

  // Topologically sort hoisted items
  const sorted = topologicalSort(allHoisted)

  // Build the hoisted code block
  const hoistedCode = sorted.map(item => item.code).join('\n')
  const hoistedHeader = '\n// Hoisted class definitions\n'

  // Find insert position
  const insertPosition = findHoistInsertPosition(code)
  const insertLine = getLineNumber(code, insertPosition)

  // Track removed ranges for source map adjustment
  const removedRanges: Array<{ startLine: number; endLine: number }> = []

  // Apply modifications - work on the string directly
  let result = code

  // Collect all removals with their line info before modifying
  const removals: Array<{ start: number; end: number; startLine: number; endLine: number }> = []
  for (const mod of modifications) {
    for (const stmt of mod.statementsToRemove) {
      // Extend to include trailing newline
      let endPos = stmt.end
      while (endPos < code.length && (code[endPos] === '\n' || code[endPos] === ' ')) {
        endPos++
        if (code[endPos - 1] === '\n') break
      }
      removals.push({
        start: stmt.start,
        end: endPos,
        startLine: getLineNumber(code, stmt.start),
        endLine: getLineNumber(code, endPos),
      })
    }
  }

  // Sort removals by position descending (to process from end to start)
  removals.sort((a, b) => b.start - a.start)

  // Apply removals
  for (const removal of removals) {
    result = result.slice(0, removal.start) + result.slice(removal.end)
    removedRanges.push({ startLine: removal.startLine, endLine: removal.endLine })
  }

  // Insert hoisted code at the beginning
  result = result.slice(0, insertPosition) + hoistedHeader + hoistedCode + '\n\n' + result.slice(insertPosition)

  return {
    code: result,
    hoistedItems: sorted,
    insertLine,
    removedRanges,
  }
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
 * Update the source map to account for hoisting transformations.
 *
 * Strategy:
 * 1. For hoisted code: Look up original source positions from the original map
 *    using the original line numbers, then map new lines to those sources
 * 2. For non-hoisted code: Adjust line numbers based on insertions/deletions
 */
async function updateSourceMap(
  mapPath: string,
  hoistedItems: HoistedItem[],
  insertLine: number,
  removedRanges: Array<{ startLine: number; endLine: number }>,
  newCode: string,
): Promise<void> {
  const mapContent = await readFile(mapPath, 'utf8')
  const originalMap: RawSourceMap = JSON.parse(mapContent)
  const consumer = new SourceMapConsumer(originalMap)

  const generator = new SourceMapGenerator({
    file: originalMap.file,
  })

  // Copy sources and sourcesContent
  if (originalMap.sources) {
    for (let i = 0; i < originalMap.sources.length; i++) {
      if (originalMap.sourcesContent?.[i]) {
        generator.setSourceContent(originalMap.sources[i], originalMap.sourcesContent[i])
      }
    }
  }

  // Build a map of new line -> original line for hoisted code
  // The hoisted code starts at insertLine + 2 (after "\n// Hoisted class definitions\n")
  const hoistedLineMap = new Map<number, number>()
  let newLine = insertLine + 2 // Skip the header comment
  for (const item of hoistedItems) {
    for (let i = 0; i < item.lineCount; i++) {
      hoistedLineMap.set(newLine + i, item.originalStartLine + i)
    }
    newLine += item.lineCount
  }

  // Calculate the total lines inserted (header + hoisted code + blank line)
  const totalHoistedLines = 2 + hoistedItems.reduce((sum, item) => sum + item.lineCount, 0) + 1

  // Sort removed ranges by start line for calculating offsets
  const sortedRemovals = [...removedRanges].sort((a, b) => a.startLine - b.startLine)

  // Function to calculate how many lines were removed before a given original line
  function getRemovedLinesBefore(origLine: number): number {
    let removed = 0
    for (const range of sortedRemovals) {
      if (range.endLine <= origLine) {
        removed += range.endLine - range.startLine
      } else if (range.startLine < origLine) {
        // Partial overlap
        removed += origLine - range.startLine
      }
    }
    return removed
  }

  // Function to check if an original line was removed
  function wasLineRemoved(origLine: number): boolean {
    for (const range of sortedRemovals) {
      if (origLine >= range.startLine && origLine < range.endLine) {
        return true
      }
    }
    return false
  }

  // Process each line in the new code
  const newLines = newCode.split('\n')

  for (let newLineNum = 1; newLineNum <= newLines.length; newLineNum++) {
    const lineContent = newLines[newLineNum - 1]

    // Check if this line is hoisted code
    const originalLineFromHoist = hoistedLineMap.get(newLineNum)
    if (originalLineFromHoist !== undefined) {
      // This line came from hoisted code - look up its original source
      for (let col = 0; col < lineContent.length; col++) {
        const origPos = consumer.originalPositionFor({
          line: originalLineFromHoist,
          column: col,
        })
        if (origPos.source && origPos.line !== null) {
          generator.addMapping({
            generated: { line: newLineNum, column: col },
            original: { line: origPos.line, column: origPos.column ?? 0 },
            source: origPos.source,
            name: origPos.name ?? undefined,
          })
        }
      }
      continue
    }

    // For non-hoisted lines, calculate what the original line was
    let originalLine: number
    if (newLineNum < insertLine) {
      // Before the insertion point - unchanged
      originalLine = newLineNum
    } else if (newLineNum < insertLine + totalHoistedLines) {
      // Inside the hoisted section but not a hoisted line (comment/blank)
      // Skip - no mapping needed for these lines
      continue
    } else {
      // After the hoisted section
      // Reverse the transformation: originalLine = newLine - insertedLines + removedLines
      const adjustedLine = newLineNum - totalHoistedLines + 1
      // Add back removed lines
      // This is tricky because removals happened at different points
      // We need to find what original line this maps to

      // Start with the adjusted line and add back removed lines
      let candidateOriginal = adjustedLine
      let prevRemoved = 0
      for (let iter = 0; iter < 10; iter++) { // Iterate to converge
        const removed = getRemovedLinesBefore(candidateOriginal)
        if (removed === prevRemoved) break
        candidateOriginal = adjustedLine + removed
        prevRemoved = removed
      }
      originalLine = candidateOriginal
    }

    // Skip if this original line was removed (shouldn't happen for non-hoisted code)
    if (wasLineRemoved(originalLine)) {
      continue
    }

    // Map each column using the original source map
    for (let col = 0; col < lineContent.length; col++) {
      const origPos = consumer.originalPositionFor({
        line: originalLine,
        column: col,
      })
      if (origPos.source && origPos.line !== null) {
        generator.addMapping({
          generated: { line: newLineNum, column: col },
          original: { line: origPos.line, column: origPos.column ?? 0 },
          source: origPos.source,
          name: origPos.name ?? undefined,
        })
      }
    }
  }

  const newMap = generator.toJSON()
  await writeFile(mapPath, JSON.stringify(newMap))
}

/**
 * Post-process a bundle file to fix __esm init order.
 * Also updates the accompanying source map if present.
 */
export async function fixEsmInitOrderInFile(filePath: string): Promise<boolean> {
  const content = await readFile(filePath, 'utf8')

  // Only process files with __esm
  if (!content.includes('__esm')) {
    return false
  }

  const result = fixEsmInitOrder(content)

  if (!result) {
    return false
  }

  // Write the modified code
  await writeFile(filePath, result.code)

  // Update the source map if it exists
  const mapPath = filePath + '.map'
  try {
    await updateSourceMap(
      mapPath,
      result.hoistedItems,
      result.insertLine,
      result.removedRanges,
      result.code,
    )
  } catch {
    // Source map might not exist, that's fine
  }

  return true
}
