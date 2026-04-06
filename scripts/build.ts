/**
 * Build script for sandstone
 *
 * Architecture: Single bundle with thin re-export files
 * - Builds one main bundle containing ALL exports from all entry points
 * - Generates re-export files for subpaths (sandstone/variables, etc.)
 * - Eliminates circular dependency issues and class duplication
 *
 * Key insight: tsc and Bun have different requirements:
 * - tsc needs clean exports (no duplicate export names)
 * - Bun just bundles all code together (doesn't care about duplicates)
 *
 * So we run tsc on the source files directly (no synthetic index),
 * then use a synthetic entry for Bun bundling only.
 */

import { join } from 'path'
import { rm, mkdir, readFile, writeFile, unlink } from 'fs/promises'
import { bundleDeclarations } from './plugins/bundle-declarations'
import {
  extractExportsFromJs,
  extractSubpathExportsFromDts,
  diff,
  intersect,
} from './plugins/extract-exports'
import { migrateDtsImports } from './plugins/migrate-dts-imports'
import { fixEsmInitOrderInFile } from './plugins/fix-esm-init-order'

const rootDir = join(import.meta.dir, '..')
const srcDir = join(rootDir, 'src')
const distDir = join(rootDir, 'dist')
const internalDir = join(distDir, '_internal')
const typesDir = join(rootDir, 'types')

// Check for silent flag
const silent = process.argv.includes('--silent') || process.argv.includes('-s')
const log = (...args: unknown[]) => {
  if (!silent) console.log(...args)
}

// Subpath entry points (relative to src/)
const subpaths = ['arguments', 'commands', 'core', 'flow', 'pack', 'variables']

/**
 * Get external packages from package.json dependencies.
 * These are npm dependencies that should NOT be bundled.
 */
async function getExternalPackages(): Promise<string[]> {
  const packageJson = JSON.parse(await readFile(join(rootDir, 'package.json'), 'utf8'))
  return Object.keys(packageJson.dependencies || {})
}

/**
 * Generate the full synthetic src/index.ts for Bun bundling.
 * Imports subpaths first (for class definitions), then includes sandstone.ts content.
 * This ensures proper initialization order.
 */
async function generateFullSyntheticIndex(): Promise<void> {
  // Read the sandstone.ts content (the public API)
  const sandstoneContent = await readFile(join(srcDir, 'sandstone.ts'), 'utf8')

  // Put subpath exports FIRST so classes are defined before sandstone.ts uses them
  const content = `// Generated at build time for bundling - do not edit
// Import subpaths first to ensure classes are defined before sandstone.ts code runs
export * from './variables'
export * from './core'
export * from './commands'
export * from './flow'
export * from './pack'
export * from './arguments'

// Now include sandstone.ts content (public API)
${sandstoneContent}
`
  await writeFile(join(srcDir, 'index.ts'), content)
  log('  Generated full synthetic src/index.ts for bundling')
}

/**
 * Remove the synthetic index.
 */
async function removeSyntheticIndex(): Promise<void> {
  try {
    await unlink(join(srcDir, 'index.ts'))
  } catch {
    // File might not exist, that's fine
  }
}

/**
 * Run TypeScript compiler to generate declarations in types/.
 * This runs on the actual source files, NOT the synthetic index.
 *
 * If an "Excessive complexity" error is detected (stale types issue),
 * deletes the types directory and retries once.
 */
async function runTsc(isRetry = false): Promise<void> {
  const tsc = Bun.spawn(['bun', 'tsc', '-p', 'tsconfig.build.json'], {
    cwd: rootDir,
    stdout: 'inherit',
    stderr: 'pipe',
  })

  // Collect stderr to check for excessive complexity error
  const stderrText = await new Response(tsc.stderr).text()
  const exitCode = await tsc.exited

  if (exitCode !== 0) {
    // Check for excessive complexity error (TS2859)
    if (!isRetry && stderrText.includes('Excessive complexity')) {
      log('  Detected stale types (Excessive complexity error), cleaning and retrying...')
      await rm(typesDir, { recursive: true, force: true })
      return runTsc(true)
    }

    // Print stderr for other errors or if retry also failed
    if (stderrText) {
      console.error(stderrText)
    }
    throw new Error(`TypeScript compilation failed with exit code ${exitCode}`)
  }

  // Print any warnings even on success
  if (stderrText) {
    console.error(stderrText)
  }
}

/**
 * Build the single main bundle containing all exports.
 * Output goes to dist/_internal/ to hide from IDE auto-import scanning.
 */
async function buildMainBundle(): Promise<void> {
  const externalPackages = await getExternalPackages()

  await mkdir(internalDir, { recursive: true })

  const result = await Bun.build({
    entrypoints: [join(srcDir, 'index.ts')],
    outdir: internalDir,
    target: 'node',
    format: 'esm',
    splitting: false,
    external: externalPackages,
    naming: 'index.js',
    sourcemap: 'linked',
  })

  if (!result.success) {
    console.error('Bundle build failed:')
    for (const log of result.logs) {
      console.error(log)
    }
    throw new Error('Bundle build failed')
  }

  // Mark _internal as private to hide from IDE auto-import
  await writeFile(
    join(internalDir, 'package.json'),
    JSON.stringify({ private: true }, null, 2),
  )
}

/**
 * Bundle declaration files from types/ to dist/.
 * Copies all .d.ts files and generates a main index.d.ts that re-exports everything.
 */
async function copyDeclarations(): Promise<void> {
  await bundleDeclarations(typesDir, distDir, srcDir)
  log('  Bundled declaration files')
}

/**
 * Generate a re-export file (JS and DTS) for a subpath.
 *
 * @param dir - Directory to write to
 * @param jsExports - Value exports for the JS file
 * @param dtsExports - Type exports for the DTS file
 * @param relativePathToBundle - Relative path to the main bundle (e.g., '..', '../..')
 */
async function generateReExportFile(
  dir: string,
  jsExports: Set<string>,
  dtsExports: Set<string>,
  relativePathToBundle: string,
): Promise<void> {
  await mkdir(dir, { recursive: true })

  // JS file - only value exports
  if (jsExports.size > 0) {
    const exportList = [...jsExports].sort().join(', ')
    const jsContent = `export { ${exportList} } from '${relativePathToBundle}/index.js'\n`
    await writeFile(join(dir, 'index.js'), jsContent)
  } else {
    await writeFile(join(dir, 'index.js'), '// No value exports for this subpath\n')
  }

  // DTS file - all exports (values + types)
  if (dtsExports.size > 0) {
    const exportList = [...dtsExports].sort().join(', ')
    const dtsContent = `export { ${exportList} } from '${relativePathToBundle}/index.js'\n`
    await writeFile(join(dir, 'index.d.ts'), dtsContent)
  } else {
    await writeFile(join(dir, 'index.d.ts'), '// No exports for this subpath\n')
  }
}

/**
 * Generate all re-export files in dist/exports/.
 *
 * Uses explicit named exports to ensure only valid exports are re-exported.
 * JS files only include value exports (from bundle), DTS files include all exports.
 * Re-exports point to ../_internal/ which is marked as private to hide from IDE auto-import.
 *
 * @param mainDtsExports - Pre-extracted exports from the public API (sandstone.d.ts)
 */
async function generateReExportsWithMainExports(mainDtsExports: Set<string>): Promise<void> {
  const exportsDir = join(distDir, 'exports')
  await mkdir(exportsDir, { recursive: true })

  // Get all value exports from the main bundle (now in _internal/)
  log('  Extracting exports from main bundle...')
  const bundleExports = await extractExportsFromJs(join(internalDir, 'index.js'))
  log(`    Found ${bundleExports.size} value exports in bundle`)

  // Main re-export: only exports that are in BOTH the bundle AND sandstone.d.ts
  const mainJsExports = intersect(bundleExports, mainDtsExports)
  log(`    ${mainJsExports.size} value exports for main entry`)

  // Main entry re-exports from ../_internal/
  await generateReExportFile(exportsDir, mainJsExports, mainDtsExports, '../_internal')

  // Generate subpath re-exports
  for (const subpath of subpaths) {
    log(`  Processing ${subpath}...`)

    // Get all type exports from this subpath
    const subpathDtsExports = await extractSubpathExportsFromDts(typesDir, subpath)

    // Unique exports = subpath exports NOT in main
    const uniqueDtsExports = diff(subpathDtsExports, mainDtsExports)

    // JS exports = unique exports that exist in the bundle
    const uniqueJsExports = intersect(uniqueDtsExports, bundleExports)

    log(`    ${subpathDtsExports.size} total, ${uniqueDtsExports.size} unique, ${uniqueJsExports.size} values`)

    // Subpath entries re-export from ../../_internal/
    await generateReExportFile(
      join(exportsDir, subpath),
      uniqueJsExports,
      uniqueDtsExports,
      '../../_internal',
    )
  }
}

/** Run and time an async step, logging elapsed ms */
async function step<T>(name: string, fn: () => Promise<T>): Promise<T> {
  log(`${name}...`)
  const start = performance.now()
  const result = await fn()
  const elapsed = Math.round(performance.now() - start)
  log(`  Done (${elapsed}ms)`)
  return result
}

async function main() {
  const startTime = performance.now()

  log('Building sandstone...\n')

  // 1. Clean dist directory and ensure no stale index.ts
  await step('Cleaning dist directory', async () => {
    await rm(distDir, { recursive: true, force: true })
    await mkdir(distDir, { recursive: true })
    await removeSyntheticIndex()
  })

  // 2. Run tsc to generate declarations in types/
  await step('Generating type declarations', runTsc)

  // 3. Generate full synthetic index for bundling
  await step('Generating synthetic entry point', generateFullSyntheticIndex)

  // 4. Build single main bundle
  await step('Building JavaScript bundle', buildMainBundle)

  // 5. Fix ESM initialization order (hoist classes out of __esm wrappers)
  const fixed = await step('Fixing ESM initialization order', () =>
    fixEsmInitOrderInFile(join(internalDir, 'index.js'))
  )
  if (!fixed) log('  (no changes needed)')

  // 6. Remove synthetic index (not needed after bundling)
  await removeSyntheticIndex()

  // 7. Copy declarations from types/ to dist/
  await step('Copying declarations', copyDeclarations)

  // 8. Extract main exports (needed for migration and re-exports)
  const mainDtsExports = await step('Extracting main exports', async () => {
    const exports = await extractSubpathExportsFromDts(typesDir, '')
    log(`  Found ${exports.size} exports in public API`)
    return exports
  })

  // 9. Migrate .d.ts imports to use correct entry points
  await step('Migrating declaration imports', async () => {
    const count = await migrateDtsImports(internalDir, mainDtsExports, subpaths)
    log(`  Migrated ${count} files`)
  })

  // 10. Generate re-export files
  await step('Generating re-export files', () =>
    generateReExportsWithMainExports(mainDtsExports)
  )

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2)
  log(`\nBuild completed in ${elapsed}s`)
}

main().catch((err) => {
  console.error('Build error:', err)
  process.exit(1)
})
