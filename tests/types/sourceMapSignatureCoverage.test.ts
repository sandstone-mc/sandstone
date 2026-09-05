/**
 * Cross-check the bundle source-map snapshot against `signatures.json`.
 *
 * `bundle-sourcemap.test.ts` walks every top-level declaration in
 * `dist/_internal/index.js`, resolves it through the bundle source map,
 * and snapshots the source FILE PATH.
 *
 * `signatures.test.ts` snapshots the LSP `textDocument/definition` file
 * path for every public export on the root `sandstone` import path.
 *
 * Both describe "where does this name live?" via different mechanisms.
 * For names that appear in both, the resolved file paths must agree.
 * Any divergence means the bundle map routes a public symbol to a
 * different file than the LSP says it lives in — a builder / source-map
 * regression that would break ctrl-click navigation in user code.
 *
 * Asserted invariant: `Diverged (different file): 0`.
 *
 * Skipped (not failed) when either snapshot is missing — both prior
 * tests must have produced their outputs first. Keeps `bun test` order
 * independent.
 */

import { describe, expect, test } from 'bun:test'
import { readFileSync, statSync } from 'fs'
import { resolve } from 'path'

const ROOT = resolve(import.meta.dir, '../..')
const SNAP_PATH = `${ROOT}/tests/__snapshots__/bundle-sourcemap.test.ts.snap`
const SIG_PATH = `${ROOT}/tests/__snapshots__/signatures.json`

interface SigEntry {
  definition?: string
  [key: string]: unknown
}

function parseSnapshot(): Map<string, string> {
  // Snapshot block format (bun):
  //   exports[`... 1`] = `
  //   Name → ../../src/path/to/file.ts
  //   ...
  //   `
  const text = readFileSync(SNAP_PATH, 'utf8')
  const map = new Map<string, string>()
  let inBlock = false
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (line.startsWith('exports[`')) inBlock = true
    else if (inBlock && line === '"') inBlock = false
    else if (inBlock) {
      const m = line.match(/^(\w+)\s+→\s+(.+?)$/)
      if (m) map.set(m[1], m[2].replace(/\\?"$/, ''))
    }
  }
  return map
}

function parseSignatures(): Map<string, string> {
  const raw = JSON.parse(readFileSync(SIG_PATH, 'utf8')) as Record<string, SigEntry>
  const map = new Map<string, string>()
  for (const [name, entry] of Object.entries(raw)) {
    if (entry.definition) map.set(name, entry.definition)
  }
  return map
}

function normalize(path: string): string {
  // Snapshot uses `../../src/foo.ts`, LSP uses `src/foo.ts`. Reduce to a
  // canonical `src/...` form for comparison.
  const m = path.match(/(?:.*?)(src\/.+)/)
  return m ? m[1] : path
}

describe('bundle source map ↔ signatures.json agreement', () => {
  test('no public export routes to a different file in the bundle map vs the LSP', () => {
    if (!statSync(SNAP_PATH, { throwIfNoEntry: false })?.isFile()) {
      console.log(`[skip] ${SNAP_PATH} not found — bundle-sourcemap.test.ts must run first`)
      return
    }
    if (!statSync(SIG_PATH, { throwIfNoEntry: false })?.isFile()) {
      console.log(`[skip] ${SIG_PATH} not found — signatures.test.ts must run first`)
      return
    }

    const snap = parseSnapshot()
    const sig = parseSignatures()

    const diverged: string[] = []
    let agree = 0
    let snapOnly = 0
    let sigOnly = 0

    for (const name of new Set([...snap.keys(), ...sig.keys()])) {
      const s = snap.get(name)
      const g = sig.get(name)
      if (s && g) {
        if (normalize(s) === normalize(g)) agree++
        else diverged.push(`${name}: snapshot=${s} vs signature=${g}`)
      } else if (s) snapOnly++
      else sigOnly++
    }

    // Surface counts so a divergence spike is visible in CI logs even
    // before the assertion message renders.
    console.log(
      `[coverage] agree=${agree} diverged=${diverged.length} ` +
        `snapshot-only=${snapOnly} signatures-only=${sigOnly} ` +
        `snap=${snap.size} sig=${sig.size}`,
    )

    expect(diverged).toEqual([])
  })
})
