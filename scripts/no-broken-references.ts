/**
 * Flag exports whose hover-resolved type still contains
 * `import("<package>").X` — a sign the library builder emitted a self-import
 * cycle or the wrong file path. Per CLAUDE.md, this is ALWAYS a builder bug
 * to be fixed, never to be dismissed.
 *
 * Usage:
 *   bun scripts/no-broken-references.ts                       # scan all subpaths
 *   bun scripts/no-broken-references.ts sandstone/arguments   # scan one subpath
 *   bun scripts/no-broken-references.ts sandstone say         # scan one symbol
 */

import { resolveSymbolParts } from './resolve-type-lib'

const DEFAULT_SUBPATHS = [
  '.',
  'arguments',
  'commands',
  'core',
  'flow',
  'pack',
  'variables',
] as const

const importPathFor = (sub: string): string =>
  sub === '.' ? 'sandstone' : `sandstone/${sub}`

/**
 * Find every `import("<module>").<Name>` reference in the parts list.
 * Per sandstone/CLAUDE.md, ANY inline `import(...)` qualifier in a resolved
 * type is a library builder bug — types should appear as bare names via
 * top-level `import type` statements. Flag every occurrence.
 */
const findBrokenRefs = (
  parts: { text: string; kind: string }[],
): { qualifier: string; name: string }[] => {
  const found: { qualifier: string; name: string }[] = []
  for (let i = 0; i < parts.length - 2; i++) {
    const a = parts[i]
    const b = parts[i + 1]
    const c = parts[i + 2]
    if (
      a.kind === 'keyword' &&
      a.text.trim() === 'import' &&
      b.kind === 'punctuation' &&
      b.text === '(' &&
      c.kind === 'stringLiteral' &&
      c.text.startsWith('"') &&
      c.text.endsWith('"')
    ) {
      const qualifier = c.text.slice(1, -1)

      // Find the subsequent "." + name
      let dotIdx = -1
      let closeParen = -1
      for (let j = i + 2; j < parts.length; j++) {
        if (parts[j].kind === 'punctuation' && parts[j].text === ')' && closeParen === -1) {
          closeParen = j
        }
        if (
          parts[j].kind === 'punctuation' &&
          parts[j].text === '.' &&
          closeParen !== -1 &&
          dotIdx === -1
        ) {
          dotIdx = j
          break
        }
      }
      if (dotIdx !== -1 && dotIdx + 1 < parts.length) {
        const namePart = parts[dotIdx + 1]
        found.push({ qualifier, name: namePart.text })
      }
    }
  }
  return found
}

type Offender = {
  importPath: string
  name: string
  refs: { qualifier: string; name: string }[]
  excerpt: string
}

const scan = async (subpath: string): Promise<Offender[]> => {
  const importPath = importPathFor(subpath)
  // We need to know all export names up-front. Reuse listExports by
  // borrowing the staged project's program.
  const { listExports } = await import('./resolve-type-lib')
  const names = await listExports(importPath)
  const offenders: Offender[] = []
  let scanned = 0
  let skipped = 0
  for (const name of names) {
    let status: 'clean' | 'offender' | 'skipped' = 'clean'
    let refs: Offender['refs'] = []
    let excerpt = ''
    try {
      const parts = await resolveSymbolParts(importPath, name)
      refs = findBrokenRefs(parts)
      if (refs.length > 0) {
        status = 'offender'
        excerpt = parts.map((p) => p.text).join('').slice(0, 160)
        offenders.push({ importPath, name, refs, excerpt })
      }
      scanned++
    } catch {
      status = 'skipped'
      skipped++
    }
    const tag =
      status === 'offender'
        ? `\x1b[31m✘ BROKEN REF\x1b[0m`
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
    process.stdout.write(`\x1b[32mNo broken import() references across ${targets.length} subpath(s).\x1b[0m\n`)
    return
  }
  process.stdout.write(
    `\x1b[31m${all.length} export(s) contain broken 'import("…")' references:\x1b[0m\n`,
  )
  for (const o of all) {
    process.stdout.write(`  ${o.importPath}#${o.name}\n`)
    const unique = new Map<string, number>()
    for (const r of o.refs) unique.set(`${r.qualifier}.${r.name}`, (unique.get(`${r.qualifier}.${r.name}`) ?? 0) + 1)
    for (const [key, count] of unique) {
      process.stdout.write(`    ${count}× ${key}\n`)
    }
    process.stdout.write(`    ${o.excerpt}\n`)
  }
  process.exit(1)
}

try {
  await main()
} catch (err) {
  process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`)
  process.exit(1)
}