/**
 * Fail when any exported sandstone symbol resolves to a type containing the
 * `any` keyword. Uses the LS's syntax-highlighting `kind` on each display
 * part — `kind === 'keyword' && text === 'any'` — so identifiers like
 * `anyValue` or `anyAllThing()` don't false-positive.
 *
 * The tarball + LS install is cached per process (see
 * scripts/resolve-type-lib.ts), so this single test that scans every export
 * only pays the install cost once even though there are many symbols.
 */

import { describe, expect, test } from 'bun:test'
import { listExports, resolveSymbolParts } from '../../scripts/resolve-type-lib.ts'

const SUBPATHS = ['.', 'arguments', 'commands', 'core', 'flow', 'pack', 'variables'] as const

const isAnyKeyword = (parts: { text: string; kind: string }[]): boolean =>
  parts.some((p) => p.kind === 'keyword' && p.text.trim() === 'any')

describe('No exports resolve to `any`', () => {
  for (const sub of SUBPATHS) {
    test(`sandstone/${sub === '.' ? '.' : sub}`, async () => {
      const importPath = sub === '.' ? 'sandstone' : `sandstone/${sub}`
      const names = await listExports(importPath)
      const offenders: { name: string; excerpt: string }[] = []
      for (const name of names) {
        try {
          const parts = await resolveSymbolParts(importPath, name)
          if (isAnyKeyword(parts)) {
            offenders.push({
              name,
              excerpt: parts.map((p) => p.text).join('').slice(0, 120),
            })
          }
        } catch {
          // Symbols without a usable hover (e.g. runtime-only values, private
          // re-exports) are skipped; this test is about type-level `any`.
        }
      }
      if (offenders.length > 0) {
        const listing = offenders.map((o) => `  - ${o.name}: ${o.excerpt}`).join('\n')
        throw new Error(
          `${offenders.length}/${names.length} exports in ${importPath} contain the \`any\` keyword:\n${listing}`,
        )
      }
      expect(offenders).toEqual([])
    }, 120_000)
  }
})