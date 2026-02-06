/**
 * Build script for sandstone
 * Uses Bun.build for JS bundling and tsc for type declarations
 *
 * Note: We build each entry point separately without code splitting to avoid
 * issues with Bun's lazy initialization (__esm) which breaks class inheritance.
 */

import { join } from 'path'
import { rm, mkdir, readdir, readFile, writeFile, stat } from 'fs/promises'

const rootDir = join(import.meta.dir, '..')
const srcDir = join(rootDir, 'src')
const distDir = join(rootDir, 'dist')

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

  console.log('Building sandstone...\n')

  // Clean dist directory
  await rm(distDir, { recursive: true, force: true })
  await mkdir(distDir, { recursive: true })

  // Build each subpath entry point separately
  // Building separately avoids Bun crashes and ensures each bundle is self-contained
  console.log('Building JavaScript bundles...')

  for (const entry of subEntries) {
    const entryPath = join(rootDir, entry)
    const entryName = entry.replace('src/', '').replace('/index.ts', '')

    console.log(`  Building ${entryName}...`)

    const result = await Bun.build({
      entrypoints: [entryPath],
      outdir: join(distDir, entryName),
      target: 'node',
      format: 'esm',
      splitting: false,
      packages: 'external',
      naming: 'index.js',
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
  console.log('  Building main index...')
  const mainResult = await Bun.build({
    entrypoints: [join(srcDir, 'index.ts')],
    outdir: distDir,
    target: 'node',
    format: 'esm',
    splitting: false,
    packages: 'external',
    naming: 'index.js',
  })

  if (!mainResult.success) {
    console.error('Main index build failed:')
    for (const log of mainResult.logs) {
      console.error(log)
    }
    process.exit(1)
  }

  console.log('  Done building JS bundles')

  // Fix duplicate exports bug in bun's output
  console.log('Fixing duplicate exports...')
  await fixDuplicateExports(distDir)

  // Generate declarations with tsc
  console.log('Generating type declarations...')
  const tsc = Bun.spawn(['bun', 'tsc', '-p', 'tsconfig.build.json'], {
    cwd: rootDir,
    stdout: 'inherit',
    stderr: 'inherit',
  })
  await tsc.exited

  // Fix .d.ts imports (convert path aliases and add .js extensions)
  console.log('Fixing declaration imports...')
  await fixDtsImports(distDir)

  const elapsed = ((performance.now() - startTime) / 1000).toFixed(2)
  console.log(`\nBuild completed in ${elapsed}s`)
}

/**
 * Fix duplicate exports bug in bun's output
 */
async function fixDuplicateExports(distDir: string): Promise<void> {
  let fixedCount = 0

  for await (const filePath of walkDir(distDir, '.js')) {
    let content = await readFile(filePath, 'utf8')

    // Find all export statements and track exported names
    const exportedNames = new Set<string>()
    const lines = content.split('\n')
    const newLines: string[] = []
    let modified = false

    for (const line of lines) {
      // Match export { Name1, Name2, ... };
      const exportMatch = line.match(/^export\s*\{([^}]+)\}\s*;?\s*$/)
      if (exportMatch) {
        const names = exportMatch[1].split(',').map(n => n.trim()).filter(Boolean)
        const newNames = names.filter(name => {
          // Handle "Name as Alias" syntax
          const actualName = name.includes(' as ') ? name.split(' as ')[1].trim() : name
          if (exportedNames.has(actualName)) {
            modified = true
            return false // Skip duplicate
          }
          exportedNames.add(actualName)
          return true
        })

        if (newNames.length === 0) {
          modified = true
          continue // Skip entire empty export statement
        }

        if (newNames.length !== names.length) {
          newLines.push(`export { ${newNames.join(', ')} };`)
          continue
        }
      }

      newLines.push(line)
    }

    if (modified) {
      await writeFile(filePath, newLines.join('\n'))
      fixedCount++
    }
  }

  console.log(`  Fixed duplicates in ${fixedCount} files`)
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

async function fixDtsImports(distDir: string): Promise<void> {
  let fixedCount = 0
  const indexDirs = await getIndexDirs()

  /**
   * Resolve a relative import path to its absolute path from distDir,
   * then check if it's a directory with an index file
   */
  function isIndexDir(importPath: string, fromFileDir: string): boolean {
    // Resolve the full path relative to the current file
    const fromRelative = fromFileDir.replace(distDir, '').replace(/\\/g, '/').replace(/^\//, '')
    const fromParts = fromRelative.split('/').filter(Boolean)

    // Handle ./ and ../ in import path
    const importParts = importPath.split('/')
    const currentParts = [...fromParts]

    for (const part of importParts) {
      if (part === '..') {
        currentParts.pop()
      } else if (part !== '.') {
        currentParts.push(part)
      }
    }

    const resolvedPath = currentParts.join('/')
    return indexDirs.has(resolvedPath)
  }

  for await (const filePath of walkDir(distDir, '.d.ts')) {
    let content = await readFile(filePath, 'utf8')
    let changed = false

    // Convert sandstone/* path aliases to relative paths
    const fileDir = join(filePath, '..')
    const relativeToSrc = join(fileDir).replace(distDir, '').replace(/\\/g, '/')

    // Calculate relative path prefix based on file depth
    const depth = relativeToSrc.split('/').filter(Boolean).length
    const relPrefix = depth > 0 ? '../'.repeat(depth) : './'

    // Replace sandstone/* imports with relative paths
    content = content.replace(
      /(from\s+['"])sandstone\/([^'"]+)(\.ts)?(['"])/g,
      (_, prefix, path, _ext, suffix) => {
        changed = true
        const cleanPath = path.replace(/\.ts$/, '')
        // Check if this is a directory import (e.g., sandstone/variables -> ./variables/index.js)
        if (indexDirs.has(cleanPath)) {
          return `${prefix}${relPrefix}${cleanPath}/index.js${suffix}`
        }
        return `${prefix}${relPrefix}${cleanPath}.js${suffix}`
      }
    )

    // Replace sandstone (root) imports
    content = content.replace(
      /(from\s+['"])sandstone(['"])/g,
      (_, prefix, suffix) => {
        changed = true
        return `${prefix}${relPrefix}index.js${suffix}`
      }
    )

    // Convert .ts extensions to .js in relative imports
    content = content.replace(
      /(from\s+['"])(\.\.?\/[^'"]+)(\.ts)(['"])/g,
      (_, prefix, path, _ext, suffix) => {
        changed = true
        return `${prefix}${path}.js${suffix}`
      }
    )

    // Add .js extension to relative imports that don't have one
    // Also fix directory imports that need /index.js
    content = content.replace(
      /(from\s+['"])(\.\.?\/[^'"]+)(['"])/g,
      (match, prefix, importPath, suffix) => {
        if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
          return match
        }
        changed = true
        // Check if this resolves to a directory with an index file
        if (isIndexDir(importPath, fileDir)) {
          return `${prefix}${importPath}/index.js${suffix}`
        }
        return `${prefix}${importPath}.js${suffix}`
      }
    )

    // Fix import("...") type import syntax (e.g., import("./commands").DataCommand)
    // These need .js extension and /index.js for directories
    content = content.replace(
      /import\((['"])(\.\.?\/[^'"]+)(['"])\)/g,
      (match, q1, importPath, q2) => {
        if (importPath.endsWith('.js') || importPath.endsWith('.json')) {
          return match
        }
        changed = true
        if (isIndexDir(importPath, fileDir)) {
          return `import(${q1}${importPath}/index.js${q2})`
        }
        return `import(${q1}${importPath}.js${q2})`
      }
    )

    if (changed) {
      await writeFile(filePath, content)
      fixedCount++
    }
  }

  console.log(`  Fixed imports in ${fixedCount} declaration files`)
}

main().catch((err) => {
  console.error('Build error:', err)
  process.exit(1)
})
