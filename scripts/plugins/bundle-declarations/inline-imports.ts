/**
 * Inline-import rewrite: replace `import("...").X` (and `.X.member`)
 * expressions inside type positions with bare `X` references, collecting
 * `import type { X } from "..."` declarations to prepend at the top of
 * the file. Per the CLAUDE.md rule, no inline `import(...)` qualifier is
 * allowed in the bundled index — every type must be in scope via a
 * top-level import.
 *
 * The replacement preserves the original column position of `X` by
 * swapping the `import("...")` prefix for a same-width comment
 * (`/* "..." *\/`). This keeps every downstream column in the file
 * stable, so the per-file `.d.ts.map` produced by `tsc` (which encodes
 * generated columns against the un-rewritten text) still resolves
 * ctrl-click navigation to the right line/column in `src/`.
 *
 * Exports both a top-level `rewriteInlineImports(source, collected)` for
 * sibling-file rewrites and `makeInlineImportVisitor(collected, context)`
 * for in-place use inside the main transformer's visitor walk.
 */
import * as ts from '@typescript/typescript6'
import { MagicString } from 'magic-string'

export interface CollectedImport {
  name: string
  module: string
}

/**
 * Top-level rewrite: parses `source`, replaces every inline
 * `import("...")` prefix with a same-width comment (so `.X` stays at its
 * original column), accumulates collected imports.
 */
export function rewriteInlineImports(
  source: string,
  collected: Set<CollectedImport>,
): string {
  const sf = ts.createSourceFile('_.ts', source, ts.ScriptTarget.Latest, true)

  // First pass: collect (module, name) pairs at every `import("...")` site
  // and the source span of the `import("...")` prefix that we'll pad.
  const edits: Array<{ start: number; end: number; padding: string }> = []
  const visit: ts.Visitor = (node) => {
    if (ts.isImportTypeNode(node)) {
      const arg = node.argument
      if (ts.isLiteralTypeNode(arg) && ts.isStringLiteral(arg.literal)) {
        const module = arg.literal.text
        const name = readImportName(node.qualifier)
        if (name !== null && !isSelfReferenceModule(module)) {
          collected.add({ name, module })
          // Span from the `import` keyword through the `.` that
          // precedes the qualifier (or through the closing `)` when no
          // qualifier is present). Replacing this whole prefix with a
          // same-width comment keeps the qualifier (`X` or `X.Y`) at
          // its original column.
          const start = node.getStart(sf)
          const end = node.qualifier
            ? node.qualifier.getStart(sf)
            : node.getEnd()
          edits.push({ start, end, padding: paddedComment(end - start) })
        }
      }
    }
    return ts.visitEachChild(
      node,
      visit,
      undefined as unknown as ts.TransformationContext,
    )
  }
  ts.visitNode(sf, visit)

  if (edits.length === 0) return source

  // Second pass: apply column-preserving edits via MagicString.
  const ms = new MagicString(source)
  for (const { start, end, padding } of edits) {
    ms.overwrite(start, end, padding)
  }
  return ms.toString()
}

/**
 * Build a block comment of exactly `length` characters. Comment is the
 * minimum-viable token (`/* ... *\/` with spaces inside), so it parses
 * as whitespace wherever the original `import("...")` sat.
 */
function paddedComment(length: number): string {
  if (length <= 0) return ''
  if (length < 5) return '/'.repeat(length)
  return `/*${' '.repeat(length - 4)}*/`
}

/**
 * Build a visitor that rewrites inline `import("...").X` expressions on
 * the fly (no separate source-text round-trip). Reusable inside another
 * transformer so inline-import discoveries share the same `collected`
 * Set as sibling import-export discoveries.
 *
 * Note: this in-place visitor does NOT preserve column counts. Use
 * `rewriteInlineImports` (top-level) when column preservation matters.
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
  const qn = qualifier as unknown as ts.QualifiedName
  if (qn && ts.isIdentifier(qn.left)) return qn.left.text
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
