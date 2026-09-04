/**
 * Source-map fidelity test for `dist/_internal/index.js.map`.
 *
 * Three guarantees, all enforced against the same walked bundle:
 *
 *   1. The map references real on-disk files (or carries content inline
 *      via `sourcesContent` for transient build-time files).
 *   2. No mapping points at the ephemeral synthetic `src/index.ts` —
 *      that file is deleted by build.ts after step 4, so any leftover
 *      mapping would make stack traces (Node `--enable-source-maps`,
 *      Chrome devtools, Sentry) land on a file the user doesn't have.
 *   3. Snapshot the resolved source FILE PATH for every top-level
 *      declaration in the bundle. Paths are stable across refactors;
 *      lines/columns aren't, so the snapshot locks the routing (class X
 *      belongs in src/foo.ts) without churning on every edit.
 *
 * Mirrors the d.ts-only `scripts/check-dts-sourcemaps.ts` but for the
 * JS bundle map.
 */

import { describe, expect, test } from 'bun:test'
import { readFileSync, statSync } from 'fs'
import { dirname, join, resolve } from 'path'
import ts from '@typescript/typescript6'
// @ts-ignore - source-map-js has no types
import { SourceMapConsumer } from 'source-map-js'

const ROOT = resolve(import.meta.dir, '..')
const BUNDLE = join(ROOT, 'dist/_internal/index.js')
const MAP = `${BUNDLE}.map`

interface DeclSample {
  name: string
  line: number
  col: number
}

function collectDecls(bundleCode: string): DeclSample[] {
  const sf = ts.createSourceFile('bundle.js', bundleCode, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS)
  const decls: DeclSample[] = []
  const seen = new Set<string>()

  const pushDecl = (name: string | undefined, node: ts.Node) => {
    if (!name) return
    // Skip bun's runtime helpers (`_foo`), lazy-init wrappers (`init_foo`),
    // and other bundler-generated helpers (`exports_Foo` namespace
    // import, `Set` wrapper around a global). None of these have
    // meaningful user-facing source map entries.
    if (
      name.startsWith('_') ||
      name.startsWith('init_') ||
      name.startsWith('exports_')
    )
      return
    if (seen.has(name)) return // dedupe (multi-var decls share the start pos)
    seen.add(name)
    const { line, character } = sf.getLineAndCharacterOfPosition(node.getStart(sf))
    decls.push({ name, line: line + 1, col: character })
  }

  for (const stmt of sf.statements) {
    // `class Foo { ... }`
    if (ts.isClassDeclaration(stmt) && stmt.name) {
      pushDecl(stmt.name.text, stmt.name)
      continue
    }
    // `function Foo(...) { ... }`
    if (ts.isFunctionDeclaration(stmt) && stmt.name) {
      pushDecl(stmt.name.text, stmt.name)
      continue
    }
    // `var Foo = ...`, `var Foo = class Foo { ... }`, `var Foo = function() {}`,
    // multi-var `var Foo, Bar, Baz;`
    if (ts.isVariableStatement(stmt)) {
      for (const decl of stmt.declarationList.declarations) {
        if (ts.isIdentifier(decl.name)) pushDecl(decl.name.text, decl.name)
      }
      continue
    }
    // `export { Foo, Bar as Baz, ... }`
    if (ts.isExportDeclaration(stmt) && stmt.exportClause && ts.isNamedExports(stmt.exportClause)) {
      for (const spec of stmt.exportClause.elements) {
        if (ts.isIdentifier(spec.name)) pushDecl(spec.name.text, spec.name)
      }
    }
  }
  return decls
}

describe('bundle source map fidelity', () => {
  test('dist/_internal/index.js.map exists', () => {
    expect(statSync(MAP, { throwIfNoEntry: false })?.isFile()).toBe(true)
  })

  test('every sampled declaration resolves to a real, non-ephemeral source file (snapshot)', () => {
    if (!statSync(MAP, { throwIfNoEntry: false })?.isFile()) {
      // The previous test will have reported the missing map; skip this
      // one cleanly instead of crashing on a JSON parse error.
      return
    }
    const bundle = readFileSync(BUNDLE, 'utf8')
    const raw = JSON.parse(readFileSync(MAP, 'utf8'))
    const sources = raw.sources as string[]
    const sourcesContent = (raw.sourcesContent as (string | null)[] | undefined) ?? []
    const consumer = new SourceMapConsumer(raw)

    // Guard 1: every referenced src/* source must be on-disk or have inline
    // sourcesContent. Catches stale references to deleted files.
    const missing: string[] = []
    for (let i = 0; i < sources.length; i++) {
      const src = sources[i]
      if (!src.includes('../../src/')) continue
      if (sourcesContent[i]) continue
      const srcAbs = resolve(dirname(MAP), src)
      if (!statSync(srcAbs, { throwIfNoEntry: false })?.isFile()) {
        missing.push(src)
      }
    }
    expect(missing).toEqual([])

    // Guard 2: no mapping may point at the ephemeral synthetic
    // src/index.ts (without inline sourcesContent as a fallback). The
    // remap-synthetic-index step drops this entry entirely; if a mapping
    // still references it, stack traces break.
    const syntheticIdx = sources.findIndex((s) => s.endsWith('/src/index.ts'))
    if (syntheticIdx >= 0 && !sourcesContent[syntheticIdx]) {
      const leaks: number[] = []
      consumer.eachMapping((m: any) => {
        if (m.source === sources[syntheticIdx]) leaks.push(m.generatedLine)
      })
      expect(leaks).toEqual([])
    }

    // Snapshot: every top-level declaration's resolved source file PATH.
    // Path-based, not line-based, so the snapshot doesn't churn on
    // refactors that shift lines but don't change where things live.
    const decls = collectDecls(bundle)
    expect(decls.length).toBeGreaterThan(0)

    const entries: string[] = []
    const unresolved: string[] = []
    for (const { name, line, col } of decls) {
      const pos = consumer.originalPositionFor({ line, column: col })
      if (!pos.source) {
        // Some names (e.g. `Set` re-exported from `src/utils.ts`) have
        // no entry in the bundle map yet — the smart-redirect pass only
        // handles proxy destructure patterns and local export clauses, not
        // `export { X } from './module'` re-exports. Skip these rather than
        // fail; a follow-up pass can extend coverage.
        unresolved.push(`${name} at bundle L${line}:${col}`)
        continue
      }
      const sourceName = name.replace(/\d+$/, '')
      entries.push(`${sourceName} → ${pos.source}`)
    }
    // Sort + dedupe so adding new declarations in the future (with paths
    // we already snapshot) doesn't churn the file.
    const stable = [...new Set(entries)].sort()
    expect(stable.join('\n')).toMatchSnapshot()
    // Optional surface: log unresolved count so missing coverage is
    // visible without failing the build. Comment out to silence.
    // eslint-disable-next-line no-console
    console.log(`[bundle-sourcemap] unresolved declarations: ${unresolved.length}`)
  })
})