/**
 * Build script for sandstone
 * Uses Bun.build for JS bundling and tsc for type declarations
 *
 * Note: We build each entry point separately without code splitting to avoid
 * issues with Bun's lazy initialization (__esm) which breaks class inheritance.
 */

import { join } from 'path'
import { rm, mkdir, readdir, readFile, writeFile, stat } from 'fs/promises'
import { createHasInstancePlugin } from './plugins/hasinstance-plugin'
import { fixDuplicateExports } from './plugins/fix-exports'
import { fixDtsImports } from './plugins/fix-dts-imports'

const rootDir = join(import.meta.dir, '..')
const srcDir = join(rootDir, 'src')
const distDir = join(rootDir, 'dist')

// Check for silent flag
const silent = process.argv.includes('--silent') || process.argv.includes('-s')
const log = (...args: unknown[]) => { if (!silent) console.log(...args) }

/**
 * Get external packages from package.json dependencies.
 * These are npm dependencies that should NOT be bundled.
 * Note: sandstone/* path aliases should be bundled, not treated as external.
 */
async function getExternalPackages(): Promise<string[]> {
  const packageJson = JSON.parse(await readFile(join(rootDir, 'package.json'), 'utf8'))
  return Object.keys(packageJson.dependencies || {})
}

// Subpath entry points (each built separately)
const subEntries = [
  'src/arguments/index.ts',
  'src/commands/index.ts',
  'src/core/index.ts',
  'src/flow/index.ts',
  'src/pack/index.ts',
  'src/variables/index.ts',
]

async function main() {
  const startTime = performance.now()

  log('Building sandstone...\n')

  // Clean dist directory
  await rm(distDir, { recursive: true, force: true })
  await mkdir(distDir, { recursive: true })

  // Create the hasinstance plugin to inject Symbol.hasInstance patterns
  log('Analyzing instanceof usage...')
  const hasInstancePlugin = await createHasInstancePlugin(srcDir, silent)

  // Get external packages from package.json
  const externalPackages = await getExternalPackages()

  // Build each subpath entry point separately
  // Building separately avoids Bun crashes and ensures each bundle is self-contained
  log('Building JavaScript bundles...')

  for (const entry of subEntries) {
    const entryPath = join(rootDir, entry)
    const entryName = entry.replace('src/', '').replace('/index.ts', '')

    log(`  Building ${entryName}...`)

    const result = await Bun.build({
      entrypoints: [entryPath],
      outdir: join(distDir, entryName),
      target: 'node',
      format: 'esm',
      splitting: false,
      external: externalPackages,
      naming: 'index.js',
      plugins: [hasInstancePlugin],
    })

    if (!result.success) {
      console.error(`Build failed for ${entryName}:`)
      for (const log of result.logs) {
        console.error(log)
      }
      process.exit(1)
    }
  }

  // Build main index
  log('  Building main index...')
  const mainResult = await Bun.build({
    entrypoints: [join(srcDir, 'index.ts')],
    outdir: distDir,
    target: 'node',
    format: 'esm',
    splitting: false,
    external: externalPackages,
    naming: 'index.js',
    plugins: [hasInstancePlugin],
  })

  if (!mainResult.success) {
    console.error('Main index build failed:')
    for (const log of mainResult.logs) {
      console.error(log)
    }
    process.exit(1)
  }

  log('  Done building JS bundles')

  // Fix duplicate exports bug in bun's output
  log('Fixing duplicate exports...')
  await fixDuplicateExportsInDir(distDir)

  // Generate declarations with tsc
  log('Generating type declarations...')
  const tsc = Bun.spawn(['bun', 'tsc', '-p', 'tsconfig.build.json'], {
    cwd: rootDir,
    stdout: 'inherit',
    stderr: 'inherit',
  })
  await tsc.exited

  // Fix .d.ts imports (convert path aliases and add .js extensions)
  log('Fixing declaration imports...')
  await fixDtsImportsInDir(distDir)

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2)
  log(`\nBuild completed in ${elapsed}s`)
}

/**
 * Fix duplicate exports in all .js files in the dist directory.
 */
async function fixDuplicateExportsInDir(distDir: string): Promise<void> {
  let fixedCount = 0

  for await (const filePath of walkDir(distDir, '.js')) {
    const content = await readFile(filePath, 'utf8')
    const result = fixDuplicateExports(content)

    if (result.modified) {
      await writeFile(filePath, result.content)
      fixedCount++
    }
  }

  log(`  Fixed duplicates in ${fixedCount} files`)
}

async function* walkDir(dir: string, ext: string = '.d.ts'): AsyncGenerator<string> {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walkDir(path, ext)
    } else if (entry.name.endsWith(ext)) {
      yield path
    }
  }
}

/**
 * Recursively find all directories that contain an index.ts file
 * These directories need /index.js appended when imported
 */
async function findIndexDirs(dir: string, relativeTo: string = dir): Promise<Set<string>> {
  const indexDirs = new Set<string>()
  const entries = await readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const fullPath = join(dir, entry.name)
      const indexPath = join(fullPath, 'index.ts')

      // Check if this directory has an index.ts
      try {
        await stat(indexPath)
        // Store the relative path from src (e.g., "arguments", "arguments/resources")
        const relativePath = fullPath.replace(relativeTo, '').replace(/\\/g, '/').replace(/^\//, '')
        indexDirs.add(relativePath)
      } catch {
        // No index.ts in this directory
      }

      // Recurse into subdirectories
      const subDirs = await findIndexDirs(fullPath, relativeTo)
      for (const subDir of subDirs) {
        indexDirs.add(subDir)
      }
    }
  }

  return indexDirs
}

// Cache for index directories (populated at build time)
let indexDirsCache: Set<string> | null = null

async function getIndexDirs(): Promise<Set<string>> {
  if (!indexDirsCache) {
    indexDirsCache = await findIndexDirs(srcDir)
  }
  return indexDirsCache
}

async function fixDtsImportsInDir(distDir: string): Promise<void> {
  let fixedCount = 0
  const indexDirs = await getIndexDirs()

  for await (const filePath of walkDir(distDir, '.d.ts')) {
    const content = await readFile(filePath, 'utf8')
    const fileDir = join(filePath, '..')
    const result = fixDtsImports(content, fileDir, distDir, indexDirs)

    if (result.modified) {
      await writeFile(filePath, result.content)
      fixedCount++
    }
  }

  log(`  Fixed imports in ${fixedCount} declaration files`)
}

main().catch((err) => {
  console.error('Build error:', err)
  process.exit(1)
})
