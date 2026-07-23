/**
 * Scan every exported sandstone symbol and fail if any resolves to a type
 * containing the `any` keyword. Uses LS syntax-highlighting kinds so
 * identifiers like `anyValue` or `anyAllThing()` don't false-positive.
 *
 * Live progress: each symbol gets a single-line status as it's scanned.
 *
 * Usage:
 *   bun scripts/no-any-exports.ts                       # scan all subpaths
 *   bun scripts/no-any-exports.ts sandstone/arguments   # scan one subpath
 */

import { listExports, resolveSymbolParts } from './resolve-type-lib'

const DEFAULT_SUBPATHS = [
  '.',
  'arguments',
  'commands',
  'core',
  'flow',
  'pack',
  'variables',
] as const

const isAnyKeyword = (parts: { text: string; kind: string }[]): boolean =>
  parts.some((p) => p.kind === 'keyword' && p.text.trim() === 'any')

const importPathFor = (sub: string): string =>
  sub === '.' ? 'sandstone' : `sandstone/${sub}`

type Offender = {
  importPath: string
  name: string
  excerpt: string
}

const scan = async (subpath: string): Promise<Offender[]> => {
  const importPath = importPathFor(subpath)
  const names = await listExports(importPath)
  const offenders: Offender[] = []
  let scanned = 0
  let skipped = 0
  for (const name of names) {
    let status: 'clean' | 'offender' | 'skipped' = 'clean'
    let excerpt = ''
    try {
      const parts = await resolveSymbolParts(importPath, name)
      if (isAnyKeyword(parts)) {
        status = 'offender'
        excerpt = parts.map((p) => p.text).join('').slice(0, 100)
        offenders.push({ importPath, name, excerpt })
      }
      scanned++
    } catch {
      status = 'skipped'
      skipped++
    }
    const tag =
      status === 'offender'
        ? `\x1b[31m✘ OFFENDER\x1b[0m`
        : status === 'skipped'
          ? `\x1b[33m· skip\x1b[0m`
          : null
    if (tag) {
      process.stdout.write(`  [${names.indexOf(name) + 1}/${names.length}] ${name}  ${tag}\n`)
    }
  }
  process.stdout.write(
    `  → scanned ${scanned}, skipped ${skipped}, offenders ${offenders.length}\n`,
  )
  return offenders
}

const main = async () => {
  const args = process.argv.slice(2)
  const targets = args.length > 0 ? args : DEFAULT_SUBPATHS

  const startedAt = Date.now()
  const all: Offender[] = []
  for (const sub of targets) {
    process.stdout.write(`\n=== ${importPathFor(sub)} ===\n`)
    const offenders = await scan(sub)
    all.push(...offenders)
  }

  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1)
  process.stdout.write(`\n=== Summary (${elapsed}s) ===\n`)
  if (all.length === 0) {
    process.stdout.write(`\x1b[32mNo 'any' keywords found across ${targets.length} subpath(s).\x1b[0m\n`)
    return
  }
  process.stdout.write(
    `\x1b[31m${all.length} export(s) contain the 'any' keyword:\x1b[0m\n`,
  )
  for (const o of all) {
    process.stdout.write(`  ${o.importPath}#${o.name}\n    ${o.excerpt}\n`)
  }
  process.exit(1)
}

try {
  await main()
} catch (err) {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
}