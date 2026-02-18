/**
 * Bun plugin that injects Symbol.hasInstance patterns into classes
 * that are checked with instanceof in the codebase.
 *
 * This allows instanceof checks to work across bundle boundaries
 * by using a unique symbol brand instead of the prototype chain.
 */

import type { BunPlugin } from 'bun'
import ts from 'typescript'
import { buildFileToClassesMap } from './find-instanceof-classes'

/**
 * Creates a Bun plugin that injects Symbol.hasInstance into classes
 * that are checked with instanceof in the codebase.
 */
export async function createHasInstancePlugin(srcDir: string, silent = false): Promise<BunPlugin> {
  const { fileToClasses, classNames } = await buildFileToClassesMap(srcDir)

  if (!silent) {
    console.log(`  Found ${classNames.size} classes used with instanceof: [
  ${[...classNames].slice(0, 5).map(c => `"${c}"`).join(', ')}${classNames.size > 5 ? `, ... and ${classNames.size - 5} more` : ''}
]`)
  }

  return {
    name: 'sandstone-hasinstance',
    setup(build) {
      build.onLoad({ filter: /\.ts$/ }, async ({ path }) => {
        // Normalize the path for comparison
        const normalizedSrcDir = srcDir.replace(/\\/g, '/')
        const normalizedPath = path.replace(/\\/g, '/')
        const relativePath = normalizedPath.replace(normalizedSrcDir + '/', '')

        const targetClasses = fileToClasses.get(relativePath)
        if (!targetClasses) {
          return undefined
        }

        // Verbose injection logging removed - too noisy

        const source = await Bun.file(path).text()
        const transformed = injectHasInstance(source, targetClasses)

        return { contents: transformed, loader: 'ts' }
      })
    },
  }
}

/**
 * Checks if a class already has a Symbol.hasInstance implementation.
 */
function hasSymbolHasInstance(node: ts.ClassDeclaration): boolean {
  return node.members.some((member) => {
    // Check for static [Symbol.hasInstance]
    if (
      ts.isMethodDeclaration(member) &&
      member.modifiers?.some((m) => m.kind === ts.SyntaxKind.StaticKeyword) &&
      ts.isComputedPropertyName(member.name)
    ) {
      const expr = member.name.expression
      if (
        ts.isPropertyAccessExpression(expr) &&
        ts.isIdentifier(expr.expression) &&
        expr.expression.text === 'Symbol' &&
        expr.name.text === 'hasInstance'
      ) {
        return true
      }
    }
    return false
  })
}

/**
 * Creates a brand symbol name from a class name.
 * e.g., "NBTClass" -> "NBT_CLASS_BRAND"
 */
function createBrandName(className: string): string {
  // Convert PascalCase to SCREAMING_SNAKE_CASE
  const snakeCase = className
    .replace(/([A-Z])/g, '_$1')
    .toUpperCase()
    .replace(/^_/, '')
  return `${snakeCase}_BRAND`
}

/**
 * Creates the brand symbol const declaration.
 * e.g., const NBT_CLASS_BRAND = Symbol.for('sandstone.NBTClass')
 */
function createBrandSymbolConst(className: string, brandName: string): ts.VariableStatement {
  return ts.factory.createVariableStatement(
    undefined, // no modifiers (not exported)
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          brandName,
          undefined,
          undefined,
          ts.factory.createCallExpression(
            ts.factory.createPropertyAccessExpression(
              ts.factory.createIdentifier('Symbol'),
              'for',
            ),
            undefined,
            [ts.factory.createStringLiteral(`sandstone.${className}`)],
          ),
        ),
      ],
      ts.NodeFlags.Const,
    ),
  )
}

/**
 * Creates the brand property for the class.
 * e.g., readonly [NBT_CLASS_BRAND] = true
 */
function createBrandProperty(brandName: string): ts.PropertyDeclaration {
  return ts.factory.createPropertyDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword)],
    ts.factory.createComputedPropertyName(ts.factory.createIdentifier(brandName)),
    undefined,
    undefined,
    ts.factory.createTrue(),
  )
}

/**
 * Creates the static Symbol.hasInstance method.
 * e.g.,
 * static [Symbol.hasInstance](instance: unknown): instance is ClassName {
 *   return (
 *     (typeof instance === 'object' || typeof instance === 'function') &&
 *     instance !== null &&
 *     (instance as Record<symbol, unknown>)[BRAND_NAME] === true
 *   )
 * }
 */
function createHasInstanceMethod(className: string, brandName: string): ts.MethodDeclaration {
  // typeof instance === 'object'
  const typeofObjectCheck = ts.factory.createBinaryExpression(
    ts.factory.createTypeOfExpression(ts.factory.createIdentifier('instance')),
    ts.SyntaxKind.EqualsEqualsEqualsToken,
    ts.factory.createStringLiteral('object'),
  )

  // typeof instance === 'function' (for callable proxies like MCFunctionClass)
  const typeofFunctionCheck = ts.factory.createBinaryExpression(
    ts.factory.createTypeOfExpression(ts.factory.createIdentifier('instance')),
    ts.SyntaxKind.EqualsEqualsEqualsToken,
    ts.factory.createStringLiteral('function'),
  )

  // (typeof instance === 'object' || typeof instance === 'function')
  const typeofCheck = ts.factory.createParenthesizedExpression(
    ts.factory.createBinaryExpression(
      typeofObjectCheck,
      ts.SyntaxKind.BarBarToken,
      typeofFunctionCheck,
    ),
  )

  // instance !== null
  const nullCheck = ts.factory.createBinaryExpression(
    ts.factory.createIdentifier('instance'),
    ts.SyntaxKind.ExclamationEqualsEqualsToken,
    ts.factory.createNull(),
  )

  // (instance as Record<symbol, unknown>)[BRAND_NAME] === true
  const brandCheck = ts.factory.createBinaryExpression(
    ts.factory.createElementAccessExpression(
      ts.factory.createParenthesizedExpression(
        ts.factory.createAsExpression(
          ts.factory.createIdentifier('instance'),
          ts.factory.createTypeReferenceNode('Record', [
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.SymbolKeyword),
            ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
          ]),
        ),
      ),
      ts.factory.createIdentifier(brandName),
    ),
    ts.SyntaxKind.EqualsEqualsEqualsToken,
    ts.factory.createTrue(),
  )

  // typeof instance === 'object' && instance !== null && ... === true
  const fullCondition = ts.factory.createBinaryExpression(
    ts.factory.createBinaryExpression(typeofCheck, ts.SyntaxKind.AmpersandAmpersandToken, nullCheck),
    ts.SyntaxKind.AmpersandAmpersandToken,
    brandCheck,
  )

  // Wrap in parentheses for formatting
  const returnExpr = ts.factory.createParenthesizedExpression(fullCondition)

  return ts.factory.createMethodDeclaration(
    [ts.factory.createModifier(ts.SyntaxKind.StaticKeyword)],
    undefined,
    ts.factory.createComputedPropertyName(
      ts.factory.createPropertyAccessExpression(
        ts.factory.createIdentifier('Symbol'),
        'hasInstance',
      ),
    ),
    undefined,
    undefined,
    [
      ts.factory.createParameterDeclaration(
        undefined,
        undefined,
        'instance',
        undefined,
        ts.factory.createKeywordTypeNode(ts.SyntaxKind.UnknownKeyword),
      ),
    ],
    ts.factory.createTypePredicateNode(
      undefined,
      ts.factory.createIdentifier('instance'),
      ts.factory.createTypeReferenceNode(className),
    ),
    ts.factory.createBlock([ts.factory.createReturnStatement(returnExpr)], true),
  )
}

/**
 * Injects Symbol.hasInstance pattern into the specified classes in the source.
 */
export function injectHasInstance(source: string, targetClasses: string[]): string {
  const sourceFile = ts.createSourceFile('file.ts', source, ts.ScriptTarget.Latest, true)

  // Track which brand consts we need to insert and where
  const brandConstsToInsert: Array<{ className: string; brandName: string; insertBefore: number }> =
    []

  // Transform classes to add brand property and hasInstance method
  const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
    return (root) => {
      const visit: ts.Visitor = (node) => {
        if (
          ts.isClassDeclaration(node) &&
          node.name &&
          targetClasses.includes(node.name.text)
        ) {
          // Skip if already has Symbol.hasInstance
          if (hasSymbolHasInstance(node)) {
            return node
          }

          const className = node.name.text
          const brandName = createBrandName(className)

          // Record that we need to insert a brand const before this class
          const classStart = node.getStart(sourceFile)
          brandConstsToInsert.push({ className, brandName, insertBefore: classStart })

          // Create new members: brand property at start, hasInstance at end
          const newMembers = [
            createBrandProperty(brandName),
            ...node.members,
            createHasInstanceMethod(className, brandName),
          ]

          return ts.factory.updateClassDeclaration(
            node,
            node.modifiers,
            node.name,
            node.typeParameters,
            node.heritageClauses,
            newMembers,
          )
        }
        return ts.visitEachChild(node, visit, context)
      }

      return ts.visitNode(root, visit) as ts.SourceFile
    }
  }

  // Apply the class transformation
  const result = ts.transform(sourceFile, [transformer])
  const transformedFile = result.transformed[0]

  // Now we need to insert the brand const declarations before each class
  // We do this by printing the transformed AST and then inserting the consts
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
  let output = printer.printFile(transformedFile)

  // Sort brand consts by their target class position (find by class name in output)
  // We need to insert them before each class declaration
  for (const { className, brandName } of brandConstsToInsert) {
    const classPattern = new RegExp(`(export\\s+)?(abstract\\s+)?class\\s+${className}\\b`)
    const match = output.match(classPattern)
    if (match && match.index !== undefined) {
      const constDecl = `const ${brandName} = Symbol.for('sandstone.${className}');\n\n`
      output = output.slice(0, match.index) + constDecl + output.slice(match.index)
    }
  }

  result.dispose()
  return output
}
