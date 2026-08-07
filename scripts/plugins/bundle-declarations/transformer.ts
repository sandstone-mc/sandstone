/**
 * TS transformer for the bundled main `dist/_internal/index.d.ts`. For
 * each module specifier, rewrite to the canonical path inside the staged
 * bundle; for each inline `import("...").X` expression, replace with
 * a bare `X` reference (collecting top-level imports to prepend).
 */
import { join, relative } from 'path'
import * as ts from '@typescript/typescript6'

import {
  buildBareTypeReference,
  CollectedImport,
  isSelfReferenceModule,
  makeInlineImportVisitor,
  readImportName,
} from './inline-imports'

export function rewriteImportsTransformer(
  bundleDir: string,
  typesDir: string,
  _canonicalFile: Map<string, string>,
  compilerOptions: ts.CompilerOptions,
  collected: Set<CollectedImport>,
): ts.TransformerFactory<ts.SourceFile> {
  return (context) => (sourceFile) => {
    const visitor: ts.Visitor = (node) => {
      if (
        ts.isImportDeclaration(node) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        const updated = rewriteImportLike(
          node.moduleSpecifier.text,
          bundleDir,
          typesDir,
          compilerOptions,
          (newModule) =>
            ts.factory.updateImportDeclaration(
              node,
              node.modifiers,
              node.importClause,
              ts.factory.createStringLiteral(newModule),
              node.attributes,
            ),
        )
        if (updated) return updated
      }
      if (
        ts.isExportDeclaration(node) &&
        node.moduleSpecifier &&
        ts.isStringLiteral(node.moduleSpecifier)
      ) {
        const updated = rewriteImportLike(
          node.moduleSpecifier.text,
          bundleDir,
          typesDir,
          compilerOptions,
          (newModule) =>
            ts.factory.updateExportDeclaration(
              node,
              node.modifiers,
              node.isTypeOnly,
              node.exportClause,
              ts.factory.createStringLiteral(newModule),
              undefined,
            ),
        )
        if (updated) return updated
      }
      if (node.kind === ts.SyntaxKind.ImportType || ts.isImportTypeNode(node)) {
        return rewriteInlineImport(node, collected, context)
      }
      return ts.visitEachChild(node, visitor, context)
    }
    return ts.visitNode(sourceFile, visitor) as ts.SourceFile
  }
}

/**
 * Replace an inline `import("...").X` expression with a bare `X` reference
 * and add the collected import to the set. Reuses the shared visitor
 * factory from `./inline-imports` so this transformer and the sibling-file
 * rewrite share the same code path.
 */
function rewriteInlineImport(
  node: ts.Node,
  collected: Set<CollectedImport>,
  context: ts.TransformationContext,
): ts.Node {
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
    return buildBareTypeReference(qualifier, itNode.typeArguments) ?? node
  }
  const replacement = buildBareTypeReference(qualifier, itNode.typeArguments)
  if (!replacement) {
    return ts.visitEachChild(node, makeInlineImportVisitor(collected, context), context)
  }
  collected.add({ name, module })
  // Recurse into type arguments so nested inline imports also get collected.
  if (itNode.typeArguments?.length) {
    const recursed = itNode.typeArguments.map(
      (ta) =>
        (ts.visitNode(ta, makeInlineImportVisitor(collected, context)) as ts.TypeNode) ?? ta,
    )
    return ts.factory.createTypeReferenceNode(
      (replacement as ts.TypeReferenceNode).typeName,
      recursed,
    )
  }
  return replacement
}

/**
 * Try to resolve `specifier` from a virtual file inside the bundle
 * dir. If TS can resolve it to a real file, return that path rewritten
 * relative to the bundle dir. Otherwise return null and let the caller
 * fall back to a `./types/` prefix rewrite.
 */
function rewriteImportLike<T extends ts.Statement>(
  specifier: string,
  bundleDir: string,
  typesDir: string,
  compilerOptions: ts.CompilerOptions,
  build: (newModule: string) => T,
): T | null {
  const resolved = resolveSpecifier(specifier, bundleDir, typesDir, compilerOptions)
  if (resolved !== null && resolved !== specifier) return build(resolved)
  if (specifier.startsWith('./') && !specifier.startsWith('./types/')) {
    return build(`./types/${specifier.slice(2)}`)
  }
  return null
}

function resolveSpecifier(
  specifier: string,
  bundleDir: string,
  _typesDir: string,
  compilerOptions: ts.CompilerOptions,
): string | null {
  if (!specifier.startsWith('.') && !specifier.startsWith('sandstone/')) return null
  const containingFile = join(bundleDir, '__virtual__.ts')
  const result = ts.resolveModuleName(specifier, containingFile, compilerOptions, ts.sys)
  const resolved = result.resolvedModule?.resolvedFileName
  if (!resolved) return null
  const fromBundle = relative(bundleDir, resolved).replace(/\\/g, '/')
  return fromBundle.endsWith('.js') ? fromBundle : `${fromBundle}.js`
}