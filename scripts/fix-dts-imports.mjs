// Post-process .d.ts files to add .js extensions for nodenext compatibility
import { readdir, readFile, writeFile, stat } from 'fs/promises'
import { join, dirname } from 'path'

async function* walkDir(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      yield* walkDir(path)
    } else if (entry.name.endsWith('.d.ts')) {
      yield path
    }
  }
}

// Check if a path is a directory (needs /index.js)
async function isDirectory(basePath, importPath) {
  const resolved = join(dirname(basePath), importPath)
  try {
    const s = await stat(resolved)
    return s.isDirectory()
  } catch {
    return false
  }
}

// Cache for directory checks
const dirCache = new Map()

async function checkIsDir(basePath, importPath) {
  const key = join(dirname(basePath), importPath)
  if (!dirCache.has(key)) {
    dirCache.set(key, await isDirectory(basePath, importPath))
  }
  return dirCache.get(key)
}

async function fixFile(filePath) {
  let content = await readFile(filePath, 'utf8')
  let changed = false

  // Process static imports: from './foo' -> from './foo.js' or './foo/index.js'
  const staticRegex = /(from\s+['"])(\.\.?\/[^'"]+)(['"])/g
  let match
  const replacements = []

  while ((match = staticRegex.exec(content)) !== null) {
    const [fullMatch, prefix, importPath, suffix] = match
    if (importPath.endsWith('.js') || importPath.endsWith('.json')) continue

    const isDir = await checkIsDir(filePath, importPath)
    const newPath = isDir ? `${importPath}/index.js` : `${importPath}.js`
    replacements.push({
      start: match.index,
      end: match.index + fullMatch.length,
      replacement: `${prefix}${newPath}${suffix}`,
    })
  }

  // Process dynamic imports: import('./foo') -> import('./foo.js')
  const dynamicRegex = /(import\(['"])(\.\.?\/[^'"]+)(['"]\))/g
  while ((match = dynamicRegex.exec(content)) !== null) {
    const [fullMatch, prefix, importPath, suffix] = match
    if (importPath.endsWith('.js') || importPath.endsWith('.json')) continue

    const isDir = await checkIsDir(filePath, importPath)
    const newPath = isDir ? `${importPath}/index.js` : `${importPath}.js`
    replacements.push({
      start: match.index,
      end: match.index + fullMatch.length,
      replacement: `${prefix}${newPath}${suffix}`,
    })
  }

  // Apply replacements in reverse order to preserve positions
  replacements.sort((a, b) => b.start - a.start)
  for (const r of replacements) {
    content = content.slice(0, r.start) + r.replacement + content.slice(r.end)
    changed = true
  }

  if (changed) {
    await writeFile(filePath, content)
  }
  return changed
}

const distDir = process.argv[2] || 'dist'
let fixedCount = 0

for await (const file of walkDir(distDir)) {
  if (await fixFile(file)) {
    fixedCount++
  }
}

console.log(`Fixed imports in ${fixedCount} files`)
