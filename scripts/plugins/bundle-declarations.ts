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
import { fixDtsImports } from './fix-dts-imports'

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
    .replace(/from '\.\/([^']+)'/g, "from './types/$1'")
    .replace(/from "\.\/([^"]+)"/g, 'from "./types/$1"')
    .replace(/import\("\.\/([^"]+)"\)/g, 'import("./types/$1")')
    // Now fix ./types/sandstone -> ./index (sandstone.d.ts is merged into index.d.ts)
    .replace(/from '\.\/types\/sandstone(\.js)?'/g, "from './index.js'")
    .replace(/from "\.\/types\/sandstone(\.js)?"/g, 'from "./index.js"')
    .replace(/import\("\.\/types\/sandstone(\.js)?"\)/g, 'import("./index.js")')

  // Append export * for subpaths (pointing to internal types)
  return `${withTypesPrefix}

// Additional exports from subpaths (not in public API)
export * from './types/variables/index.js'
export * from './types/core/index.js'
export * from './types/commands/index.js'
export * from './types/flow/index.js'
export * from './types/pack/index.js'
export * from './types/arguments/index.js'
`
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
}
