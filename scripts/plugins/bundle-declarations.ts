/**
 * Bundles TypeScript declaration files into a single output file.
 *
 * This reads the declaration files from types/ and collapses them into
 * a single dist/index.d.ts file that re-exports everything.
 *
 * We don't inline all definitions (that would be too complex), instead we:
 * 1. Copy all .d.ts files from types/ to dist/ (preserving structure)
 * 2. Generate a dist/index.d.ts that re-exports from all entry points
 */

import { join, relative, dirname } from 'path'
import { readdir, readFile, writeFile, mkdir, stat } from 'fs/promises'
import { SourceMapGenerator } from 'source-map-js'
import * as ts from 'typescript'
import { fixDtsImports } from './fix-dts-imports'

/**
 * Rewrite the `sources` paths in a declaration map so they remain valid
 * after copyDtsFiles moves the file from `types/` to `dist/_internal/types/`.
 * The new location is 2 directories deeper, so each relative source path
 * gets `../../` prepended.
 */
function rewriteSourcePathsInMap(content: string): string {
  const map = JSON.parse(content)
  if (Array.isArray(map.sources)) {
    map.sources = map.sources.map((s: string) => (s.startsWith('../') ? '../../' + s : s))
  }
  return JSON.stringify(map)
}

/**
 * Recursively copy .d.ts files from src to dest, fixing imports along the way.
 * Skips sandstone.d.ts since it will be merged into index.d.ts.
 */
async function copyDtsFiles(
  srcDir: string,
  destDir: string,
  rootSrcDir: string,
  rootDestDir: string,
  indexDirs: Set<string>,
): Promise<void> {
  const entries = await readdir(srcDir, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = join(srcDir, entry.name)
    const destPath = join(destDir, entry.name)

    if (entry.isDirectory()) {
      await mkdir(destPath, { recursive: true })
      await copyDtsFiles(srcPath, destPath, rootSrcDir, rootDestDir, indexDirs)
    } else if (entry.name.endsWith('.d.ts')) {
      // Skip sandstone.d.ts - it will be merged into index.d.ts
      if (entry.name === 'sandstone.d.ts' && srcDir === rootSrcDir) {
        continue
      }
      const content = await readFile(srcPath, 'utf8')
      const fixed = fixDtsImports(content, dirname(destPath), rootDestDir, indexDirs)
      await writeFile(destPath, fixed.content)
    } else if (entry.name.endsWith('.d.ts.map')) {
      // Skip sandstone.d.ts.map - corresponding .d.ts is not copied
      if (entry.name === 'sandstone.d.ts.map' && srcDir === rootSrcDir) {
        continue
      }
      const content = await readFile(srcPath, 'utf8')
      const rewritten = rewriteSourcePathsInMap(content)
      await writeFile(destPath, rewritten)
    }
  }
}

/**
 * Recursively find all directories that contain an index.ts file.
 */
async function findIndexDirs(dir: string, relativeTo: string = dir): Promise<Set<string>> {
  const indexDirs = new Set<string>()
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = join(dir, entry.name)
      const indexPath = join(fullPath, 'index.ts')

      try {
        await stat(indexPath)
        const relativePath = fullPath.replace(relativeTo, '').replace(/\\/g, '/').replace(/^\//, '')
        indexDirs.add(relativePath)
      } catch {
        // No index.ts in this directory
      }

      const subDirs = await findIndexDirs(fullPath, relativeTo)
      for (const subDir of subDirs) {
        indexDirs.add(subDir)
      }
    }
  }

  return indexDirs
}

/**
 * Generate the main index.d.ts by combining sandstone.d.ts with subpath exports.
 * This mirrors what the synthetic index.ts does for the JS bundle.
 *
 * Strips tsc's sourceMappingURL comment (it references sandstone.d.ts.map, which
 * doesn't exist next to the bundled output) — bundleDeclarations writes a fresh
 * index.d.ts.map and adds a corrected sourceMappingURL at the end.
 */
async function generateMainIndexDts(
  typesDir: string,
  distDir: string,
  indexDirs: Set<string>,
): Promise<string> {
  // Read sandstone.d.ts content
  const sandstoneDts = await readFile(join(typesDir, 'sandstone.d.ts'), 'utf8')

  // Fix imports (resolves sandstone/* aliases and adds .js extensions)
  const fixed = fixDtsImports(sandstoneDts, distDir, distDir, indexDirs)

  // Rewrite relative imports to point to ./types/ subdirectory
  // EXCEPT for ./sandstone which should point to ./index (since sandstone.d.ts
  // is merged into index.d.ts, not copied to types/)
  // Note: fixDtsImports may have already added .js extension, so handle both cases
  //
  // Strategy: First add ./types/ prefix to all relative imports, then fix
  // ./types/sandstone -> ./index after
  const withTypesPrefix = fixed.content
    // Strip tsc's sourceMappingURL comment — we'll add our own at the end
    .replace(/\n?\/\/# sourceMappingURL=sandstone\.d\.ts\.map\n?$/, '\n')
    .replace(/from '\.\/([^']+)'/g, "from './types/$1'")
    .replace(/from "\.\/([^"]+)"/g, 'from "./types/$1"')
    .replace(/import\("\.\/([^"]+)"\)/g, 'import("./types/$1")')
    // Now fix ./types/sandstone -> ./index (sandstone.d.ts is merged into index.d.ts)
    .replace(/from '\.\/types\/sandstone(\.js)?'/g, "from './index.js'")
    .replace(/from "\.\/types\/sandstone(\.js)?"/g, 'from "./index.js"')
    .replace(/import\("\.\/types\/sandstone(\.js)?"\)/g, 'import("./index.js")')

  // Append export * for subpaths (pointing to internal types)
  // End with a sourceMappingURL pointing to our generated index.d.ts.map so
  // the IDE can follow declarations back to src/ via the map chain
  // (index.d.ts.map → types/sandstone.d.ts.map → src/sandstone.ts).
  return `${withTypesPrefix}

// Additional exports from subpaths (not in public API)
export * from './types/variables/index.js'
export * from './types/core/index.js'
export * from './types/commands/index.js'
export * from './types/flow/index.js'
export * from './types/pack/index.js'
export * from './types/arguments/index.js'

//# sourceMappingURL=index.d.ts.map
`
}

/**
 * Walk a .ts/.d.ts file and collect every exported variable declaration's
 * identifier position. Handles both `export const x: T` and
 * `export const { x, y } = obj` (binding pattern). Returns name + line + 0-indexed col.
 */
async function collectExportedSymbols(file: string): Promise<{ name: string; line: number; col: number }[]> {
  const src = await readFile(file, 'utf8')
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const out: { name: string; line: number; col: number }[] = []

  function visit(node: ts.Node) {
    if (ts.isVariableStatement(node)) {
      const isExported = (node.modifiers ?? []).some(m => m.kind === ts.SyntaxKind.ExportKeyword)
      if (!isExported) { ts.forEachChild(node, visit); return }
      const declList = node.declarationList
      for (const decl of declList.declarations) {
        const name = decl.name
        if (ts.isIdentifier(name)) {
          const pos = sf.getLineAndCharacterOfPosition(name.getStart(sf))
          out.push({ name: name.text, line: pos.line + 1, col: pos.character })
        } else if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
          for (const el of name.elements) {
            // ArrayBindingPattern.elements is ArrayBindingElement, a union with OmittedExpression
            // (the `[,]` skip-element), which has no `.name`.
            if (ts.isBindingElement(el) && ts.isIdentifier(el.name)) {
              const pos = sf.getLineAndCharacterOfPosition(el.name.getStart(sf))
              out.push({ name: el.name.text, line: pos.line + 1, col: pos.character })
            }
          }
        }
      }
    }
    ts.forEachChild(node, visit)
  }

  visit(sf)
  return out
}

/**
 * Generate a declaration source map for the bundled index.d.ts.
 *
 * Walks both the bundled .d.ts and src/sandstone.ts with TypeScript's compiler
 * API, matches exported symbols by name, and emits a mapping per symbol. This
 * gives the IDE precise ctrl+click navigation for every exported binding —
 * crucially including the commands/resources destructured from `commandsProxy`
 * and `packMethodsProxy` in src/sandstone.ts, which tsc collapses into a single
 * combined declaration in types/sandstone.d.ts and therefore can't be resolved
 * through the default chain (bundled → types/sandstone.d.ts → src/sandstone.ts).
 *
 * Symbols in the bundled .d.ts that don't appear in src/sandstone.ts (e.g.
 * types, helpers re-exported from other modules) are skipped — the IDE will
 * fall back to types/sandstone.d.ts.map for those, which preserves any
 * existing useful mappings.
 */
async function generateMainIndexMap(
  bundledDtsPath: string,
  sandstoneTsPath: string,
  sourceFile: string,
): Promise<string> {
  const [bundled, src] = await Promise.all([
    collectExportedSymbols(bundledDtsPath),
    collectExportedSymbols(sandstoneTsPath),
  ])

  const bundledByName = new Map<string, { line: number; col: number }>()
  for (const s of bundled) bundledByName.set(s.name, s)

  const generator = new SourceMapGenerator({ file: 'index.d.ts' })
  for (const s of src) {
    const b = bundledByName.get(s.name)
    if (!b) continue
    generator.addMapping({
      generated: { line: b.line, column: b.col },
      source: sourceFile,
      original: { line: s.line, column: s.col },
    })
  }

  return generator.toString()
}

/**
 * Bundle declarations from types/ to dist/_internal/.
 * The _internal directory is marked as private to hide from IDE auto-import scanning.
 *
 * @param typesDir - The types/ directory with tsc output
 * @param distDir - The dist/ directory for final output
 * @param srcDir - The src/ directory (for finding index.ts locations)
 */
export async function bundleDeclarations(
  typesDir: string,
  distDir: string,
  srcDir: string,
): Promise<void> {
  const indexDirs = await findIndexDirs(srcDir)
  const bundleDir = join(distDir, '_internal')
  const typesDestDir = join(bundleDir, 'types')

  // Copy all .d.ts files from types/ to dist/_internal/types/, fixing imports
  // (skips sandstone.d.ts which is merged into index.d.ts)
  // Pass bundleDir as rootDestDir so 'sandstone' imports resolve to bundleDir/index.js
  await mkdir(typesDestDir, { recursive: true })
  await copyDtsFiles(typesDir, typesDestDir, typesDir, bundleDir, indexDirs)

  // Add package.json to mark dist/_internal/types/ as private (hides from IDE autocomplete)
  await writeFile(join(typesDestDir, 'package.json'), JSON.stringify({ private: true }, null, 2))

  // Generate the main index.d.ts in _internal/ (sandstone.d.ts content + subpath exports)
  const mainIndexContent = await generateMainIndexDts(typesDir, bundleDir, indexDirs)
  await writeFile(join(bundleDir, 'index.d.ts'), mainIndexContent)

  // Generate a declaration source map so the IDE can follow bundled declarations
  // back to src/sandstone.ts (or src/variables/nbt/NBTs.ts for re-exports).
  // Maps each exported symbol in the bundled .d.ts to its real declaration site
  // in the source — TypeScript's compiler API finds both ends, even when names
  // are destructured (which tsc would otherwise collapse into one combined
  // `export declare const` declaration that loses per-name source maps).
  // Source path is relative to the .d.ts.map file at dist/_internal/index.d.ts.map.
  const map = await generateMainIndexMap(
    join(bundleDir, 'index.d.ts'),
    join(srcDir, 'sandstone.ts'),
    '../../src/sandstone.ts',
  )
  await writeFile(join(bundleDir, 'index.d.ts.map'), map)
}
