/**
 * Post-processor that fixes __esm initialization order issues.
 *
 * Bun's bundler wraps modules in __esm lazy initializers. When there are
 * circular dependencies, class definitions inside these wrappers may not
 * be available when needed by other modules.
 *
 * The fix:
 * 1. Hoist class definitions and Symbol.for brands out of __esm wrappers
 * 2. Topologically sort hoisted classes so base classes come before derived
 * 3. Keep side-effect code (init calls, other statements) inside __esm
 * 4. Synthesize a `var X;` declaration (via ts.factory + ts.createPrinter)
 *    in front of every hoisted bare-assign class. Bun 1.4.1's bundler emits
 *    class members as `X = class X { ... }` inside __esm with no preceding
 *    `var X;`. When hoisted to module top-level, the bare assignment has no
 *    binding to resolve against in strict mode. Prepending `var X;` makes
 *    the assignment valid. Duplicate `var X;` declarations are legal in
 *    modules, so any pre-existing top-level one is harmless.
 *
 * Implementation:
 *   - AST walk + position lookup: TypeScript 6 API (ts.forEachChild, ts.is*,
 *     node.getStart(), node.getEnd())
 *   - Original text extraction: node.getText(sourceFile)
 *   - `var X;` construction: ts.factory.createVariableStatement
 *   - Rendering: ts.createPrinter().printNode()
 *   - Source-map-aware byte-level edits: MagicString (.move / .appendLeft
 *     only — no regex, no string slicing of code content)
 *   - Map chaining with the bundle's existing .js.map: @ampproject/remapping
 */

import { readFile, writeFile } from 'fs/promises'
import ts from '@typescript/typescript6'
import { MagicString } from 'magic-string'
import remapping from '@ampproject/remapping'

interface HoistedItem {
  start: number
  end: number
  node: ts.Node
  className?: string
  superClassName?: string | null
  rawClassName?: string
  isBrand?: boolean
}

interface ShadowVarRemoval {
  start: number
  end: number
}

/**
 * Fix __esm initialization order by hoisting and sorting class definitions.
 * Returns a MagicString instance for source-map-aware application, or null
 * if there is nothing to do.
 */
export function fixEsmInitOrder(code: string): MagicString | null {
  const sourceFile = ts.createSourceFile(
    'bundle.js',
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  )

  // Collect all hoistable items from __esm blocks
  const allHoisted: HoistedItem[] = []

  // Collect names of all hoisted classes (for shadow-var detection below)
  const hoistedClassNames = new Set<string>()

  // Collect top-level class declarations (may need hoisting if used as base classes)
  const topLevelClasses = new Map<string, HoistedItem>()

  // Find all __esm wrapper calls and top-level class declarations
  ts.forEachChild(sourceFile, (node) => {
    // Handle top-level class declarations: class Foo { ... }
    if (ts.isClassDeclaration(node) && node.name) {
      const className = node.name.text
      let superClassName: string | null = null

      if (node.heritageClauses) {
        for (const clause of node.heritageClauses) {
          if (clause.token === ts.SyntaxKind.ExtendsKeyword && clause.types[0]) {
            const superType = clause.types[0]
            if (ts.isIdentifier(superType.expression)) {
              superClassName = superType.expression.text
            }
          }
        }
      }

      const start = node.getStart(sourceFile)
      let end = node.getEnd()
      while (end < code.length && (code[end] === ' ' || code[end] === '\n')) {
        end++
        if (code[end - 1] === '\n') break
      }

      topLevelClasses.set(className, { start, end, node, className, superClassName })
      return
    }

    if (!ts.isVariableStatement(node)) return

    for (const decl of node.declarationList.declarations) {
      if (!decl.initializer || !ts.isCallExpression(decl.initializer)) continue

      const call = decl.initializer
      if (!ts.isIdentifier(call.expression) || call.expression.text !== '__esm') continue

      const arrowFn = call.arguments[0]
      if (!arrowFn || !ts.isArrowFunction(arrowFn)) continue

      const body = arrowFn.body
      if (!ts.isBlock(body)) continue

      // Analyze statements in this __esm block. Hoist class-assign expressions
      // and Symbol.for / makeClassCallable calls. Also track `var X;` shadow
      // declarations for hoisted class names — bun 1.4.1+ emits these inside
      // __esm which shadows the global X the closures inside __esm actually
      // capture, so they must be removed to avoid ReferenceError on use.
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
            node: stmt,
            className: hoistInfo.className,
            superClassName: hoistInfo.superClassName,
            rawClassName: hoistInfo.rawClassName,
            isBrand: hoistInfo.isBrand,
          })
          if (hoistInfo.className) hoistedClassNames.add(hoistInfo.className)
        }
      }
    }
  })

  if (allHoisted.length === 0) return null

  // The bare-assign class expressions may live at top level (bun 1.4.1+ emits
  // them outside __esm) instead of inside the __esm wrapper. Walk the entire
  // source file for top-level bare class assignments and add their names to
  // hoistedClassNames so the shadow-var detection below catches them.
  for (const stmt of sourceFile.statements) {
    if (!ts.isExpressionStatement(stmt)) continue
    const expr = stmt.expression
    if (!ts.isBinaryExpression(expr)) continue
    if (expr.operatorToken.kind !== ts.SyntaxKind.EqualsToken) continue
    if (!ts.isClassExpression(expr.right)) continue
    if (!ts.isIdentifier(expr.left)) continue
    hoistedClassNames.add(expr.left.text)
  }

  // Collect shadow-var declarations (single `var X;` inside an __esm wrapper)
  // for hoisted class names. These shadow the outer X when the closures inside
  // __esm read it, causing `undefined is not a constructor` runtime errors.
  // Multi-var declarations like `var X, Y, Z;` (whether at top level or inside
  // __esm) are NOT shadows — they're the only declarations that make the bare
  // assignments work, so we leave them alone.
  const shadowVarRemovals: ShadowVarRemoval[] = []

  function collectShadowVars(esmArrow: ts.ArrowFunction): void {
    if (!ts.isBlock(esmArrow.body)) return
    for (const stmt of esmArrow.body.statements) {
      if (!ts.isVariableStatement(stmt)) continue
      // Multi-var declarations are legitimate, not shadows.
      if (stmt.declarationList.declarations.length !== 1) continue
      const decl = stmt.declarationList.declarations[0]
      if (decl.initializer) continue
      if (!ts.isIdentifier(decl.name)) continue
      const name = decl.name.text
      if (!hoistedClassNames.has(name)) continue

      let start = decl.name.getStart(sourceFile)
      const end = decl.name.getEnd()
      while (start > 0 && (code[start - 1] === ' ' || code[start - 1] === '\t')) start--
      shadowVarRemovals.push({ start, end })
    }
  }

  for (const stmt of sourceFile.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    for (const decl of stmt.declarationList.declarations) {
      if (!decl.initializer || !ts.isCallExpression(decl.initializer)) continue
      const call = decl.initializer
      if (!ts.isIdentifier(call.expression) || call.expression.text !== '__esm') continue
      const arrow = call.arguments[0]
      if (!arrow || !ts.isArrowFunction(arrow)) continue
      collectShadowVars(arrow)
    }
  }

  // Find top-level class declarations that are referenced by hoisted items
  // (either as base classes via extends, or as arguments to makeClassCallable)
  const neededTopLevelClasses = new Set<string>()

  function addTopLevelClass(className: string | null | undefined) {
    if (!className || neededTopLevelClasses.has(className)) return
    const topLevelClass = topLevelClasses.get(className)
    if (topLevelClass) {
      neededTopLevelClasses.add(className)
      // Recursively add its base class too
      addTopLevelClass(topLevelClass.superClassName)
    }
  }

  for (const item of allHoisted) {
    addTopLevelClass(item.superClassName)
    addTopLevelClass(item.rawClassName)
  }

  // Add needed top-level classes to hoisted list
  for (const className of neededTopLevelClasses) {
    allHoisted.push(topLevelClasses.get(className)!)
  }

  // Topologically sort hoisted items
  const sorted = topologicalSort(allHoisted)

  // Compute hoist insertion position (after imports and __esm definition)
  const insertPosition = findHoistInsertPosition(sourceFile)

  // Apply via MagicString for source-map preservation.
  //
  // Each hoisted item is moved from its original position to a slot at
  // insertPosition. Bare-assign class expressions need no synthesized
  // `var X;` prefix: the pre-edit bundle already declares every hoisted
  // name via a top-level multi-var (e.g. `var NBTPrimitive, NBTLong, ...`),
  // so the bare assignment works at the new top-level position. Prepending
  // a `var X;` would instead leave a shadow declaration at the original
  // location inside __esm after MagicString splits the chunk.
  const s = new MagicString(code)
  s.appendLeft(insertPosition, '\n// Hoisted class definitions\n')

  for (const item of sorted) {
    s.move(item.start, item.end, insertPosition)
  }

  // Remove shadow `var X;` declarations from inside __esm wrappers. Bun's
  // bundler emits these for some classes; they shadow the global X the
  // closures inside __esm capture, causing `undefined is not a constructor`
  // at runtime. Apply in reverse position order so earlier offsets stay valid.
  const sortedRemovals = [...shadowVarRemovals].sort((a, b) => b.start - a.start)
  for (const r of sortedRemovals) {
    s.remove(r.start, r.end)
  }

  s.appendLeft(insertPosition, '\n')

  return s
}

/**
 * Find the position to insert hoisted code (after imports and __esm definition).
 * Uses TS API to walk top-level statements and locate the `var __esm` declaration.
 */
function findHoistInsertPosition(sourceFile: ts.SourceFile): number {
  for (const stmt of sourceFile.statements) {
    if (
      ts.isVariableStatement(stmt) &&
      stmt.declarationList.declarations.length === 1 &&
      ts.isIdentifier(stmt.declarationList.declarations[0].name) &&
      stmt.declarationList.declarations[0].name.text === '__esm'
    ) {
      const end = stmt.getEnd()
      const text = sourceFile.text
      let pos = end
      while (pos < text.length && (text[pos] === ' ' || text[pos] === '\t')) pos++
      if (text[pos] === '\n') pos++
      return pos
    }
  }
  return 0
}

interface StatementAnalysis {
  className?: string
  superClassName?: string | null
  rawClassName?: string
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
      // Track the raw class being wrapped
      let rawClassName: string | undefined
      if (right.arguments[0] && ts.isIdentifier(right.arguments[0])) {
        rawClassName = right.arguments[0].text
      }
      return { className: expr.left.text, rawClassName }
    }
  }

  return null
}

/**
 * Topologically sort hoisted items so base classes come before derived classes.
 */
function topologicalSort(items: HoistedItem[]): HoistedItem[] {
  // Separate brands and classes
  const brands = items.filter((i) => i.isBrand)
  const classes = items.filter((i) => i.className)

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

    // Visit rawClassName dependency (for makeClassCallable)
    if (item.rawClassName && classMap.has(item.rawClassName)) {
      if (!visit(item.rawClassName)) return false
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
 * Post-process a bundle file to fix __esm init order, updating the
 * accompanying source map so the transformation is ctrl-click navigable
 * back into the original sources.
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

  const newCode = magicString.toString()
  await writeFile(filePath, newCode)

  // Update the source map if it exists. MagicString's generateMap maps
  // new-code positions back to the original bundle positions; remapping
  // chains that with the bundle's existing .js.map so ctrl-click in the
  // editor resolves all the way down into the TypeScript source.
  const mapPath = filePath + '.map'
  try {
    const originalMapContent = await readFile(mapPath, 'utf8')
    const originalMap = JSON.parse(originalMapContent)

    const transformMap = magicString.generateMap({
      source: 'index.js',
      file: 'index.js',
      includeContent: false,
      hires: true,
    })

    const remapped = remapping(
      [transformMap as any, originalMap],
      () => null,
    )
    await writeFile(mapPath, JSON.stringify(remapped))
  } catch {
    // Source map might not exist, that's fine
  }

  return true
}