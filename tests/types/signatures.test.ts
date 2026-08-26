/**
 * Snapshot every export's hover signature from the root `sandstone` import
 * path, and enforce a no-`any` / no-`unknown` rule over them.
 *
 * Two outputs per run:
 *
 *   1. `tests/__snapshots__/signatures.json` — one entry per export
 *      with the LSP-resolved hover signature and a user-editable
 *      `anyAllowed: boolean` flag. Re-written each run; never out-of-date.
 *   2. Per-export sub-tests — each export gets its own pass/fail line, so
 *      a single offender doesn't bury the others in a wrapped error blob.
 *      A test fails when the export's hover contains an `any` or `unknown`
 *      keyword AND `anyAllowed` is not `true` in the snapshot.
 *
 * To allow an intentional `any`/`unknown`, open `signatures.json`, find
 * the export, flip its `anyAllowed` to `true`. The next test run passes.
 *
 * Optimization: the raw hover string is substring-checked for `any` and
 * `unknown` first. If neither appears, we skip the per-symbol tree-sitter
 * tokenization entirely (cheap, since 99% of exports are clean). Only the
 * flagged subset pays the wasm parse cost.
 *
 * Critical: one `tsc --lsp --stdio` subprocess is shared across all 255
 * sub-tests via a top-level `getHoverEnv` call. Without sharing,
 * `resolveSymbol` (which creates a new env per call) would spawn 255
 * concurrent LSP processes and saturate the machine.
 *
 * bun:test sub-tests must be registered synchronously at describe-setup
 * time, so we use top-level await (Bun supports it in `.test.ts`) to
 * resolve the export list and boot the env BEFORE the `for` loop
 * registers the per-export `test()` blocks.
 */

import { expect, test } from 'bun:test'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import {
  ensureTarball,
  getHoverEnv,
  isAnyOffender,
  listExports,
  resolvePackageRoot,
  stripMarkdownFences,
  type HoverEnv,
} from '../../scripts/resolve-type-lib'

const SNAPSHOT_PATH = path.resolve(
  import.meta.dir,
  '..',
  '__snapshots__',
  'signatures.json',
)
const REPO_ROOT = path.resolve(import.meta.dir, '..', '..')
const IMPORT_PATH = 'sandstone'

type Entry = {
  signature: string
  /**
   * LSP `textDocument/definition` location for the export. Just the
   * file path — `line`/`character` change whenever source reorganizes,
   * which would create noisy diffs the user can ignore. The full
   * absolute path:line:col is printed in the test log so a reviewer
   * can ctrl+click to jump to it.
   */
  definition: string | null
  /**
   * User-editable opt-in: `true` skips the no-any/unknown check for this
   * export. Only emitted on entries that actually flagged — clean
   * exports don't carry the field, so the snapshot only carries
   * `anyAllowed` for entries that need review.
   */
  anyAllowed?: boolean
}

type Snapshot = {
  [exportName: string]: Entry
}

const readSnapshot = async (): Promise<Snapshot> => {
  try {
    return JSON.parse(await fs.readFile(SNAPSHOT_PATH, 'utf8'))
  } catch {
    return {}
  }
}

const writeSnapshot = async (snap: Snapshot): Promise<void> => {
  await fs.mkdir(path.dirname(SNAPSHOT_PATH), { recursive: true })
  await fs.writeFile(SNAPSHOT_PATH, JSON.stringify(snap, null, 2) + '\n', 'utf8')
}

const looksLikeAnyOrUnknown = (signature: string): boolean =>
  signature.includes('any') || signature.includes('unknown')

/**
 * Print `name` + signature indented under the header. When
 * `previousSignature` is supplied, prints both back-to-back (old above
 * new) for diff-friendly drift review.
 *
 * Also emits a `definition: <absolutePath:line:col>` line in the
 * standard terminal-link format (`<file>:<line>:<col>`), so a reviewer
 * can ctrl+click to jump straight into the source.
 */
const printExcerpt = (
  name: string,
  signature: string,
  previousSignature?: string,
  definition?: { file: string; line: number; character: number } | null,
): void => {
  process.stdout.write(`  sandstone#${name}\n`)
  if (definition) {
    const abs = path.resolve(REPO_ROOT, definition.file)
    // LSP returns 0-based line + 0-based character; bump both by 1 so
    // the terminal link lands on the editor's 1-based column.
    process.stdout.write(
      `    definition: ${abs}:${definition.line + 1}:${definition.character + 1}\n`,
    )
  }
  if (previousSignature !== undefined && previousSignature !== signature) {
    process.stdout.write(`    --- previous ---\n`)
    for (const line of previousSignature.split('\n')) {
      process.stdout.write(`    ${line}\n`)
    }
    process.stdout.write(`    --- current ---\n`)
  }
  for (const line of signature.split('\n')) {
    process.stdout.write(`    ${line}\n`)
  }
  process.stdout.write('\n')
}

// Top-level setup. Bun supports top-level await in `.test.ts` files; doing
// the LSP boot + tarball stage + export listing here means the `for` loop
// below sees everything already resolved when it registers sub-tests.
const packageRoot = resolvePackageRoot(IMPORT_PATH)
if (!packageRoot) {
  throw new Error(`Cannot resolve package root for "${IMPORT_PATH}"`)
}
const resolved = await ensureTarball(packageRoot)
const env: HoverEnv = await getHoverEnv({
  resolved,
  tsconfigPath: '__default__',
})
const existing: Snapshot = await readSnapshot()
const names: string[] = await listExports(IMPORT_PATH)
// Shared result map. Sub-tests write to it as they run; the last test
// to finish (counter === names.length) is responsible for writing the
// snapshot file + disposing the LSP subprocess.
//
// `afterAll` is unreliable in this bun:test version (snapshot stayed
// empty when the write was inside it), so we drive teardown from the
// last sub-test via a counter. try/finally ensures even failing tests
// count toward the trigger — a skipped `next[name] = ...` line must
// not freeze the snapshot.
const next: Snapshot = {}
let completed = 0

for (const name of names) {
  test(`export: ${name}`, async () => {
    let signature = '(unresolvable)'
    let ok = false
    let rawHit = false
    let offender = false
    let anyAllowed = existing[name]?.anyAllowed ?? false
    let drifted = false

    // On any failure path, preserve the prior snapshot entry (if any)
    // so the snapshot represents the last *passing* state. Otherwise the
    // test silently rewrites the file with the failing signature,
    // masking the regression and forcing a manual restore from git. If
    // there's no prior entry, drop it from `next` entirely — the snapshot
    // should only contain signatures that have actually passed.
    //
    // Opt-out via the UPDATE_SIGNATURES env var (set by the
    // `test:update-snapshots` package script alongside bun's
    // `--update-snapshots` flag). When set, `preserveOld` is a no-op and
    // the new signature is written through to the snapshot — same as the
    // old behavior, for users who explicitly want to bulk-accept drift.
    const updating = process.env.UPDATE_SIGNATURES === '1'
    const preserveOld = () => {
      if (updating) return
      if (existing[name]) {
        next[name] = existing[name]
      } else {
        delete next[name]
      }
    }

    try {
      let description: Awaited<ReturnType<typeof env.describe>> | null = null
      try {
        // `includeDefinition: true` runs the hover + definition requests
        // in parallel against the same LSP session. Skipped by default
        // for backwards-compat callers; we always want the definition
        // here so we can detect declaration-site drift.
        description = await env.describe(IMPORT_PATH, name, {
          includeDefinition: true,
        })
        signature = stripMarkdownFences(description.signature)
        ok = true
      } catch {
        // leave signature as '(unresolvable)' and continue
      }

      if (!ok) {
        // Unresolvable — could be a builder bug or a new export that the
        // tarball dropped. Either way, do NOT write the '(unresolvable)'
        // placeholder into the snapshot; preserve whatever was there
        // (or omit if first-time-seen).
        preserveOld()
        expect(false, `${name} unresolvable; check that the tarball includes the export`).toBe(true)
        return
      }

      // Substring pre-filter. Tree-sitter tokenization is the expensive
      // path; only enter it when the raw hover literally contains the
      // keywords we're hunting for.
      rawHit = looksLikeAnyOrUnknown(signature)

      if (rawHit) {
        // Confirm via per-token kinds. Filters out two false-positive
        // patterns before treating the export as an offender:
        //   1. `any`/`unknown` only appears as part of an identifier
        //   2. `any` sits inside a `${any}${string}` template-literal span
        //      (intentional escape hatch in LiteralUnion-style types)
        const parts = await env.parts(IMPORT_PATH, name)
        offender = isAnyOffender(parts)
      }

      // Only flag `anyAllowed` on entries that genuinely contain an
      // `any`/`unknown` keyword (after per-token filtering). Clean
      // entries — including ones whose signature happens to contain
      // the substring `any` inside an identifier (`MaybePromise`,
      // `anyItem`) — get just `{ signature, definition }` so the snapshot
      // stays compact and reviewable.
      // Snapshot only stores the file (line/col change with any source
      // reorganization — too noisy). The full path:line:col is logged
      // per-export so a reviewer can ctrl+click any of them in the
      // terminal to jump to the real source.
      const definitionFile = description!.definition?.file ?? null
      if (description!.definition) {
        const abs = path.resolve(REPO_ROOT, description!.definition.file)
        // LSP `textDocument/definition` returns 0-based line AND 0-based
        // character per spec. Add 1 to both so the terminal-link
        // (`path:line:col`) matches the editor's 1-based row/column
        // numbering — VS Code's terminal-click handler opens the file at
        // the shown position as-is.
        process.stdout.write(
          `Definition for ${name}: ${abs}:${description!.definition.line + 1}:${description!.definition.character + 1}\n`,
        )
      }

      // Every export must resolve to a REAL source file. If the LSP
      // sent us back to a `.d.ts` (synthetic barrel or bundled d.ts),
      // the library builder's source map redirects aren't working —
      // either the redirect logic missed this export, or the source
      // map path is wrong. Either way the IDE user would land in a
      // useless `.d.ts` file. Fail loudly so the builder gets fixed.
      if (
        definitionFile === null ||
        definitionFile.endsWith('.d.ts') ||
        definitionFile.endsWith('.d.ts.map')
      ) {
        // Builder regression — preserve old snapshot so the diff shows
        // the working definition file vs the broken one.
        preserveOld()
        printExcerpt(name, signature, undefined, description!.definition)
        expect(
          false,
          `${name} has no real source definition (file=${definitionFile ?? 'null'}). ` +
            `Either the library builder missed this export's redirect, or the ` +
            `source map pathing is broken. Fix the builder so the IDE can ` +
            `ctrl-click to the actual source file.`,
        ).toBe(true)
        return
      }

      next[name] = offender
        ? { signature, definition: definitionFile, anyAllowed: updating ? true : anyAllowed }
        : { signature, definition: definitionFile }

      // Drift semantics (signature OR definition fields):
      //   - Clean → clean drift on either field: FAIL (review the change).
      //   - Offender → clean (previously anyAllowed:false, the default):
      //     SILENT PASS + snapshot auto-updated. The previously-flagged
      //     `any` was removed upstream; the entry is now genuinely clean
      //     and the `anyAllowed` flag drops with it.
      //   - Offender → clean (previously anyAllowed:true, user override):
      //     FAIL — the user explicitly approved this `any`, so an
      //     apparent fix must be reviewed by them, not auto-applied.
      //   - Offender → offender (with or without drift): FAIL via the
      //     offender branch below; drift info shown alongside.
      // Compute after the `next` write so we compare the real signature,
      // not the '(unresolvable)' placeholder.
      const wasExplicitlyFlagged = existing[name]?.anyAllowed === false
      const sigDrifted = !!existing[name] && existing[name].signature !== signature
      const defDrifted =
        !!existing[name] && existing[name].definition !== definitionFile
      drifted = sigDrifted || defDrifted

      // Offender → clean auto-fix path: only for previously-flagged
      // defaults. User-set overrides require explicit review.
      if (wasExplicitlyFlagged && !offender) {
        return
      }

      if (!offender || anyAllowed) {
        if (drifted) {
          // Drift on a clean/allowed entry is a regression — preserve the
          // old signature in the snapshot so the user sees the actual diff
          // in git (old vs current) and can decide whether to accept the
          // change. Do NOT auto-rewrite the failing signature into the
          // file; that would mask the regression behind a passing test.
          //
          // In update mode (`UPDATE_SIGNATURES=1`), the user has opted in
          // to bulk-accepting drift, so the new entry (already written
          // above) stays and the test passes.
          if (updating) return
          preserveOld()
          printExcerpt(name, signature, existing[name]?.signature, description!.definition)
          expect(false, `${name} signature drifted since last snapshot (snapshot preserved; review and update manually if the change is intentional)`).toBe(true)
        }
        return
      }

      // Offender: print the signature (indented, multi-line) and fail
      // the test cleanly. expect(false).toBe(true) is bun:test's analogue
      // of jest's `expect.fail` — bun:test lacks a `fail` shorthand.
      // If the signature also drifted since the last snapshot, print
      // the previous signature too so the user sees both — otherwise
      // a still-flagged entry with a changed signature would only
      // surface the `any` warning, hiding the signature change. Either
      // way, preserve the prior snapshot entry so a `any`/drift combo
      // doesn't silently bake the new offending signature into the file.
      //
      // In update mode (`UPDATE_SIGNATURES=1`), accept the any/unknown
      // and pass — the entry already has anyAllowed:true written above,
      // so subsequent non-update runs don't re-fail on this entry.
      if (updating) return
      const driftedSuffix = drifted
        ? ` (signature also drifted — previous version printed below; review both)`
        : ''
      preserveOld()
      printExcerpt(name, signature, drifted ? existing[name]?.signature : undefined, description!.definition)
      expect(
        false,
        `${name} contains 'any'/'unknown'. Open ${path.basename(SNAPSHOT_PATH)} and set "anyAllowed": true to allow, or fix the source.${driftedSuffix}`,
      ).toBe(true)
    } finally {
      completed++
      if (completed === names.length) {
        // Last test to finish — finalize the snapshot and free the
        // subprocess. Runs even when individual sub-tests fail because
        // the try/finally above guarantees `completed++` fires.
        await writeSnapshot(next)
        await env.session.dispose()
      }
    }
  })
}

// Catch exports that were in a previous snapshot but no longer exist.
// The auto-update flow silently drops them otherwise, which masks
// accidental removals (e.g. a refactor that drops an export without
// updating the snapshot). Each missing export gets its own sub-test so
// the failure is itemized alongside the per-export offenders.
const missing = Object.keys(existing).filter((name) => !names.includes(name))
for (const name of missing) {
  test(`missing export: ${name} was in the snapshot but no longer exported`, () => {
    expect(
      false,
      `${name} is in ${path.basename(SNAPSHOT_PATH)} but no longer appears in ${IMPORT_PATH}'s exports. ` +
        `Remove the entry from the snapshot (or restore the export).`,
    ).toBe(true)
  })
}
