/**
 * Build top-level `import type { X } from "..."` declarations from the
 * collected `(name, module)` pairs. Two variants:
 *
 *   - `groupImportsForMain` prepends `./types/` to relative paths so the
 *     bundled main resolves to the staged `dist/_internal/types/` tree.
 *   - `groupImportsForSibling` rewrites `./X.js` to `./X/index.js` when
 *     `./X/index.d.ts` exists in `siblingDir`.
 */
import { existsSync } from 'fs'
import path from 'path'
import * as ts from 'typescript'

export function groupImportsForMain(
  collected: Set<{ name: string; module: string }>,
): ts.ImportDeclaration[] {
  return groupImports(collected, 'main')
}

export function groupImportsForSibling(
  collected: Set<{ name: string; module: string }>,
  siblingDir: string,
): ts.ImportDeclaration[] {
  return groupImports(collected, 'sibling', siblingDir)
}

type Mode = 'main' | 'sibling'

function groupImports(
  collected: Set<{ name: string; module: string }>,
  mode: Mode,
  siblingDir?: string,
): ts.ImportDeclaration[] {
  const byModule = new Map<string, string[]>()
  for (const { name, module } of collected) {
    if (isSelfReference(module)) continue
    const fixedModule = fixModulePath(module, mode, siblingDir)
    const arr = byModule.get(fixedModule) ?? []
    if (!arr.includes(name)) arr.push(name)
    byModule.set(fixedModule, arr)
  }
  const out: ts.ImportDeclaration[] = []
  for (const [module, names] of byModule) {
    out.push(buildImportDecl(module, names))
  }
  return out
}

/**
 * Build a single `import type { X, Y } from "module"` declaration.
 */
function buildImportDecl(module: string, names: string[]): ts.ImportDeclaration {
  return ts.factory.createImportDeclaration(
    undefined,
    ts.factory.createImportClause(
      true, // typeOnly
      undefined,
      ts.factory.createNamedImports(
        names.map((n) =>
          ts.factory.createImportSpecifier(
            false,
            undefined,
            ts.factory.createIdentifier(n),
          ),
        ),
      ),
    ),
    ts.factory.createStringLiteral(module),
    undefined,
  )
}

/** Skip self-references that have no real file (the bundled main
 *  merges `sandstone.d.ts` into itself). */
function isSelfReference(module: string): boolean {
  return (
    module === './sandstone.js' ||
    module === './sandstone' ||
    module === './types/sandstone.js' ||
    module === './types/sandstone'
  )
}

function fixModulePath(module: string, mode: Mode, siblingDir?: string): string {
  if (mode === 'main') {
    // Bundled main: `./X` → `./types/X` since per-subpath files live
    // under `dist/_internal/types/`.
    if (module.startsWith('./') && !module.startsWith('./types/')) {
      return `./types/${module.slice(2)}`
    }
    return module
  }
  // Sibling file: `./X.js` → `./X/index.js` if `./X/index.d.ts` exists.
  if (siblingDir && module.startsWith('./') && module.endsWith('.js')) {
    const dir = module.slice(2, -3)
    if (dir && !dir.includes('..')) {
      if (existsSync(path.join(siblingDir, dir, 'index.d.ts'))) {
        return `./${dir}/index.js`
      }
    }
  }
  return module
}

/** Serialize a list of import declarations as source text (one per line). */
export function printImportDeclarations(decls: ts.ImportDeclaration[]): string {
  if (decls.length === 0) return ''
  const printer = ts.createPrinter()
  const sf = ts.createSourceFile(
    '_.ts',
    '',
    ts.ScriptTarget.Latest,
    false,
    ts.ScriptKind.TS,
  )
  return (
    decls
      .map((d) => printer.printNode(ts.EmitHint.Unspecified, d, sf))
      .join('\n') + '\n'
  )
}