/**
 * Inline-import rewrite: replace `import("...").X` (and `.X.member`)
 * expressions inside type positions with bare `X` references, collecting
 * `import type { X } from "..."` declarations to prepend at the top of
 * the file. Per the CLAUDE.md rule, no inline `import(...)` qualifier is
 * allowed in the bundled index — every type must be in scope via a
 * top-level import.
 *
 * Exports both a top-level `rewriteInlineImports(source, collected)` for
 * sibling-file rewrites and `makeInlineImportVisitor(collected, context)`
 * for in-place use inside the main transformer's visitor walk.
 */
import * as ts from 'typescript'

export interface CollectedImport {
  name: string
  module: string
}

/**
 * Top-level rewrite: parses `source`, replaces every inline
 * `import("...").X` with bare `X`, accumulates collected imports.
 */
export function rewriteInlineImports(
  source: string,
  collected: Set<CollectedImport>,
): string {
  const sf = ts.createSourceFile('_.ts', source, ts.ScriptTarget.Latest, true)
  const result = ts.transform(sf, [
    (context) => (sf) => ts.visitEachChild(sf, makeInlineImportVisitor(collected, context), context),
  ])
  const out = ts.createPrinter().printFile(result.transformed[0])
  result.dispose()
  return out
}

/**
 * Build a visitor that rewrites inline `import("...").X` expressions on
 * the fly (no separate source-text round-trip). Reusable inside another
 * transformer so inline-import discoveries share the same `collected`
 * Set as sibling import-export discoveries.
 */
export function makeInlineImportVisitor(
  collected: Set<CollectedImport>,
  context: ts.TransformationContext,
): ts.Visitor {
  const recurseIntoTypeArgs = (
    itNode: ts.ImportTypeNode,
    replacement: ts.TypeNode,
  ): ts.TypeNode => {
    if (!itNode.typeArguments?.length) return replacement
    const recursed = itNode.typeArguments.map(
      (ta) => (ts.visitNode(ta, makeInlineImportVisitor(collected, context)) as ts.TypeNode) ?? ta,
    )
    return ts.factory.createTypeReferenceNode(
      (replacement as ts.TypeReferenceNode).typeName,
      recursed,
    )
  }

  return (node) => {
    if (node.kind !== ts.SyntaxKind.ImportType && !ts.isImportTypeNode(node)) {
      return ts.visitEachChild(node, makeInlineImportVisitor(collected, context), context)
    }
    const itNode = node as ts.ImportTypeNode
    if (
      !ts.isLiteralTypeNode(itNode.argument) ||
      !ts.isStringLiteral(itNode.argument.literal)
    ) {
      return ts.visitEachChild(node, makeInlineImportVisitor(collected, context), context)
    }
    const qualifier = itNode.qualifier
    const module = itNode.argument.literal.text
    const name = readImportName(qualifier)
    if (name === null) {
      return ts.visitEachChild(node, makeInlineImportVisitor(collected, context), context)
    }
    if (isSelfReferenceModule(module)) {
      return buildBareTypeReference(qualifier, itNode.typeArguments) ?? undefined
    }
    const replacement = buildBareTypeReference(qualifier, itNode.typeArguments)
    if (!replacement) {
      return ts.visitEachChild(node, makeInlineImportVisitor(collected, context), context)
    }
    collected.add({ name, module })
    return recurseIntoTypeArgs(itNode, replacement)
  }
}

/** Read the imported name from a `ImportType`'s qualifier. */
export function readImportName(qualifier: ts.EntityName | undefined): string | null {
  if (!qualifier) return null
  if (ts.isIdentifier(qualifier)) return qualifier.text
  const pae = qualifier as unknown as ts.PropertyAccessExpression | undefined
  if (pae && ts.isIdentifier(pae.expression)) return pae.expression.text
  return null
}

/** Build a bare `Name` (or `Name.member`) type reference. */
export function buildBareTypeReference(
  qualifier: ts.EntityName | undefined,
  typeArgs: ts.NodeArray<ts.TypeNode> | undefined,
): ts.TypeNode | null {
  if (!qualifier) return null
  if (ts.isIdentifier(qualifier)) {
    return ts.factory.createTypeReferenceNode(qualifier, typeArgs)
  }
  const pae = qualifier as unknown as ts.PropertyAccessExpression | undefined
  if (pae && ts.isIdentifier(pae.expression) && ts.isIdentifier(pae.name)) {
    const base = ts.factory.createTypeReferenceNode(pae.expression, typeArgs)
    return ts.factory.createPropertyAccessExpression(
      base as unknown as ts.Expression,
      pae.name,
    ) as unknown as ts.TypeNode
  }
  return null
}

/** True if `module` is a self-reference (`./sandstone.js` etc.). */
export function isSelfReferenceModule(module: string): boolean {
  return (
    module === './sandstone.js' ||
    module === './sandstone' ||
    module === './types/sandstone.js' ||
    module === './types/sandstone'
  )
}