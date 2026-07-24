/**
 * Verify per-file `.d.ts.map` source maps in `dist/_internal/types/` resolve
 * tokens back to the expected source lines.
 *
 * Usage:
 *   bun scripts/check-dts-sourcemaps.ts                       # sweep everything
 *   bun scripts/check-dts-sourcemaps.ts variables/Score       # narrow to one file
 *   bun scripts/check-dts-sourcemaps.ts variables/Score:classScore,unaryOperation
 *                                                            # narrow to tokens
 *
 * For each `.d.ts.map` it reads the bundled `.d.ts`, finds the first
 * top-level declaration (class / interface / type alias), looks up the
 * declaration token in the source map, then loads the original `.ts`
 * and confirms the source line actually contains that token. Exits
 * non-zero on any mismatch so CI / pre-commit can catch regressions.
 *
 * Diagnostic script — does not modify anything.
 */

import { readdirSync, readFileSync, statSync } from 'fs'
import { join, dirname, relative, resolve } from 'path'
import { SourceMapConsumer } from 'source-map-js'

const rootDir = resolve(import.meta.dir, '..')
const bundledRoot = join(rootDir, 'dist/_internal/types')

const argv = process.argv.slice(2)
const filter = argv[0] // e.g. 'variables/Score' or 'variables/Score:token1,token2'
const [pathFilter, tokenFilter] = (filter ?? '').split(':')
const wantedTokens = tokenFilter ? new Set(tokenFilter.split(',')) : null

if (!statSync(bundledRoot, { throwIfNoEntry: false })?.isDirectory()) {
  console.error(`No bundled types directory at ${bundledRoot}. Run \`bun dev:build\` first.`)
  process.exit(1)
}

function listDtsMaps(dir: string, base = ''): string[] {
  const out: string[] = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      out.push(...listDtsMaps(join(dir, entry.name), rel))
    } else if (entry.isFile() && entry.name.endsWith('.d.ts.map')) {
      out.push(rel)
    }
  }
  return out
}

const all = listDtsMaps(bundledRoot)
const filtered = pathFilter ? all.filter(p => p.includes(pathFilter)) : all

let pass = 0
let fail = 0
const issues: string[] = []

for (const mapRel of filtered) {
  const mapPath = join(bundledRoot, mapRel)
  const dtsPath = mapPath.replace(/\.map$/, '')
  const origDtsPath = join(rootDir, 'types', mapRel.replace(/\.d\.ts\.map$/, '.d.ts'))

  let bundled: string
  let map: any
  try {
    bundled = readFileSync(dtsPath, 'utf8')
    map = JSON.parse(readFileSync(mapPath, 'utf8'))
  } catch (e: any) {
    issues.push(`SKIP ${mapRel}: ${e.message}`)
    continue
  }

  if (!statSync(origDtsPath, { throwIfNoEntry: false })?.isFile()) {
    issues.push(`SKIP ${mapRel}: no original at ${relative(rootDir, origDtsPath)}`)
    continue
  }

  const consumer = new SourceMapConsumer(map)
  const bundledLines = bundled.split('\n')

  // For each token we care about, find the first occurrence in the
  // bundled .d.ts and look up where it points in the original .ts.
  const tokens = wantedTokens
    ? findTokens(bundledLines, wantedTokens)
    : findTopLevelDeclaration(bundledLines)
  if (!tokens.length) continue

  for (const { name, line, col } of tokens) {
    const pos = consumer.originalPositionFor({ line: line + 1, column: col })
    if (!pos.source || !pos.line) {
      if (wantedTokens) {
        issues.push(`FAIL ${mapRel}: token "${name}" at L${line + 1}:${col} unmapped`)
        fail++
      }
      continue
    }
    const srcAbs = resolve(dirname(mapPath), pos.source)
    let srcLine: string | undefined
    try {
      srcLine = readFileSync(srcAbs, 'utf8').split('\n')[pos.line - 1]
    } catch {
      issues.push(`FAIL ${mapRel}: ${name} → ${pos.source}:${pos.line} (source unreadable)`)
      fail++
      continue
    }
    if (srcLine && srcLine.includes(name)) {
      pass++
    } else {
      issues.push(`FAIL ${mapRel}: ${name} → ${pos.source}:${pos.line} (${srcLine?.trim().slice(0, 60)})`)
      fail++
    }
  }
}

console.log(`Source map check: ${pass} pass, ${fail} fail (${filtered.length} files)`)
if (issues.length) {
  console.log('\nIssues:')
  for (const i of issues.slice(0, 50)) console.log('  ' + i)
  if (issues.length > 50) console.log(`  …and ${issues.length - 50} more`)
}
process.exit(fail > 0 ? 1 : 0)

function findTopLevelDeclaration(lines: string[]): Array<{ name: string; line: number; col: number }> {
  const declRegex = /^(?:export\s+)?(?:declare\s+)?(?:class|interface|type|function|const|let|var)\s+(\w+)/
  const out: Array<{ name: string; line: number; col: number }> = []
  for (let i = 5; i < lines.length && out.length < 1; i++) {
    const m = lines[i].match(declRegex)
    if (!m) continue
    out.push({ name: m[1], line: i, col: lines[i].indexOf(m[1]) })
  }
  return out
}

function findTokens(
  lines: string[],
  wanted: Set<string>,
): Array<{ name: string; line: number; col: number }> {
  const out: Array<{ name: string; line: number; col: number }> = []
  for (let i = 0; i < lines.length; i++) {
    for (const name of wanted) {
      const col = lines[i].indexOf(name)
      if (col >= 0) {
        out.push({ name, line: i, col })
      }
    }
    if (out.length >= wanted.size) break
  }
  return out
}
