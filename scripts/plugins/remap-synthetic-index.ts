/**
 * Rewrite `dist/_internal/index.js.map` so mappings no longer point at
 * the ephemeral `src/index.ts` that build.ts creates for bundling and
 * deletes after step 4.
 *
 * Without this, stack traces auto-mapped via the source map (Node
 * `--enable-source-maps`, Chrome devtools, Sentry, etc.) point at
 * `src/index.ts:LINE:COL` — a file that doesn't exist on a user's
 * machine. The runtime tools either fail to resolve or, when
 * `sourcesContent` is honored, show synthetic barrel content
 * (`export * from './core'`) instead of the real source.
 *
 * Two passes:
 *
 *   1. **Synthetic-index strip.** For each mapping pointing at
 *      `../../src/index.ts`, re-target:
 *        - `export * from './X'`              → `../../src/X/index.ts:1:0`
 *        - inlined `src/sandstone.ts` content → `../../src/sandstone.ts`
 *
 *   2. **Smart redirects.** Re-target mappings near the
 *      `commandsProxy` / `packMethodsProxy` destructure rows to the
 *      underlying implementation files, mirroring what the d.ts
 *      source-mapper does for the .d.ts.map. Same logic applies to stack
 *      traces — when `commandsProxy.execute()` ultimately calls into
 *      `src/commands/implementations/entity/execute.ts`, that file is the
 *      one a user wants to see in their debugger, not the destructure
 *      row in `sandstone.ts`.
 *        - Commands → `src/commands/implementations/<cat>/<name>.ts`
 *        - Resources → `src/pack/pack.ts` (the `SandstonePack` class)
 *        - Everything else keeps its `sandstone.ts` target.
 *
 * Runs after step 4 (Bun.build) and before step 5 (fix-esm-init-order),
 * so fix-esm-init-order's remapping chains cleanly on top of this.
 */

import { readFile, writeFile } from 'fs/promises'
import { dirname, join } from 'path'
// @ts-ignore - source-map-js has no types
import { SourceMapConsumer, SourceMapGenerator } from 'source-map-js'
import ts from '@typescript/typescript6'
import {
  classifySandstoneExports,
  findCommandImplPath,
  findPackMemberPos,
} from './bundle-declarations/source-maps'

interface ResolvedRedirect {
  source: string
  line: number
  col: number
}

/**
 * Resolve a (source, line, col) tuple inside the synthetic src/index.ts
 * to the real underlying source.
 *
 * The synthetic index has two regions:
 *
 *   1. Lines 1..N contain barrel re-exports like `export * from './X'`,
 *      preceded by 2 banner comments and a blank line (see scripts/build.ts:
 *      `generateFullSyntheticIndex`). For each such export we re-target
 *      the mapping to `../../src/X/index.ts:1:0`.
 *
 *   2. Lines N+1..end contain the inlined src/sandstone.ts body
 *      (build.ts pastes `sandstoneContent` after the re-exports). The
 *      line offset between synthetic and inlined is constant for the
 *      whole block, so we subtract it and re-target to
 *      `../../src/sandstone.ts:<line>:<col>`.
 */
function resolveSyntheticMapping(
  syntheticContent: string,
  line: number, // 1-based
  col: number, // 0-based
): ResolvedRedirect | null {
  const lines = syntheticContent.split('\n')
  const text = lines[line - 1] ?? ''
  // Barrel re-export: export * from './<module>'
  const m = text.match(/^\s*export\s+\*\s+from\s+['"]([^'"]+)['"]/)
  if (m) {
    const modulePath = m[1]
    // './X' → '../../src/X/index.ts'
    return { source: `../../src/${modulePath}/index.ts`, line: 1, col: 0 }
  }
  // Past the barrel. The boundary is the first non-`export * from` line
  // (this captures the blank line + `// Now include...` comment before
  // sandstone.ts content starts).
  const headerLineCount = (() => {
    // Find the first line that looks like sandstone.ts content (an import
    // statement or a top-level declaration). The synthetic file's header
    // (banner comments, blank, barrel re-exports) doesn't have imports.
    for (let i = 0; i < lines.length; i++) {
      if (/^\s*(import|export\s+(const|let|var|function|class|interface|type)|const|let|var|function|class)/.test(lines[i] ?? '')) {
        return i
      }
    }
    return 0
  })()
  if (line <= headerLineCount) {
    // Header content (comment, blank line) — no useful redirect target.
    return null
  }
  const sandstoneLine = line - headerLineCount
  return {
    source: '../../src/sandstone.ts',
    line: sandstoneLine,
    col,
  }
}

/**
 * Rewrite `dist/_internal/index.js.map` so mappings that pointed at the
 * ephemeral `src/index.ts` instead point at the real underlying source.
 * Returns the number of mappings rewritten.
 */
export async function remapSyntheticIndexInJsMap(mapPath: string): Promise<number> {
  const raw = JSON.parse(await readFile(mapPath, 'utf8'))
  const sources = raw.sources as string[]
  const sourcesContent = (raw.sourcesContent as (string | null)[] | undefined) ?? []
  const syntheticIdx = sources.findIndex((s) => s.endsWith('/src/index.ts'))
  if (syntheticIdx < 0) return 0
  const syntheticContent = sourcesContent[syntheticIdx]
  if (!syntheticContent) return 0

  const generator = new SourceMapGenerator({ file: 'index.js' })
  const consumer = new SourceMapConsumer(raw)
  let rewritten = 0
  let kept = 0

  consumer.eachMapping((m: any) => {
    if (m.generatedLine === null || m.generatedColumn === null) return
    if (m.source !== sources[syntheticIdx]) {
      // Mapping doesn't point at the synthetic file — copy through.
      generator.addMapping({
        generated: { line: m.generatedLine, column: m.generatedColumn },
        original: { line: m.originalLine ?? 1, column: m.originalColumn ?? 0 },
        source: m.source,
        name: m.name,
      })
      kept++
      return
    }
    const redirect = resolveSyntheticMapping(
      syntheticContent,
      m.originalLine ?? 1,
      m.originalColumn ?? 0,
    )
    if (!redirect) {
      // Couldn't resolve — copy through unchanged. This preserves the
      // (working) sourcesContent fallback for runtime tools that honor it.
      generator.addMapping({
        generated: { line: m.generatedLine, column: m.generatedColumn },
        original: { line: m.originalLine ?? 1, column: m.originalColumn ?? 0 },
        source: m.source,
        name: m.name,
      })
      kept++
      return
    }
    generator.addMapping({
      generated: { line: m.generatedLine, column: m.generatedColumn },
      original: { line: redirect.line, column: redirect.col },
      source: redirect.source,
      name: m.name,
    })
    rewritten++
  })

  // Drop the synthetic src/index.ts from sources / sourcesContent since
  // no mapping should reference it anymore.
  const newMap = JSON.parse(generator.toString())
  const idx = (newMap.sources as string[]).findIndex((s) =>
    s.endsWith('/src/index.ts'),
  )
  if (idx >= 0) {
    newMap.sources.splice(idx, 1)
    if (Array.isArray(newMap.sourcesContent)) {
      newMap.sourcesContent.splice(idx, 1)
    }
  }

  // Preserve any other custom keys (e.g. `debugId`) the original map had.
  for (const [k, v] of Object.entries(raw)) {
    if (k === 'sources' || k === 'sourcesContent' || k === 'mappings' || k === 'file') continue
    ;(newMap as Record<string, unknown>)[k] = v
  }

  await writeFile(mapPath, JSON.stringify(newMap))
  return rewritten
}

/**
 * Run pass 2 of the rewrite: walk mappings pointing at `src/sandstone.ts`
 * near a `commandsProxy` / `packMethodsProxy` destructure entry, and
 * redirect them to the actual implementation file
 * (`src/commands/implementations/<cat>/<name>.ts` for commands,
 * `src/pack/pack.ts` for resources).
 *
 * Re-targets the d.ts-side smart-redirect logic for the JS bundle map,
 * since both maps start life pointing at the same useless destructure row
 * after step 1. Without this pass, `ctrl-click execute` would land on
 * `execute,` in the destructure instead of `ExecuteCommand` in
 * `src/commands/implementations/entity/execute.ts`.
 */
async function applySmartRedirects(mapPath: string, repoRoot: string): Promise<number> {
  const raw = JSON.parse(await readFile(mapPath, 'utf8'))
  const sources = raw.sources as string[]
  const sandstoneIdx = sources.findIndex((s) => s.endsWith('/src/sandstone.ts'))
  if (sandstoneIdx < 0) return 0

  const sandstonePath = join(repoRoot, 'src', 'sandstone.ts')
  const packPath = join(repoRoot, 'src', 'pack', 'pack.ts')

  const { commands, resources } = await classifySandstoneExports(sandstonePath)

  // Find each command's real implementation file, and each resource's
  // position in `pack.ts`.
  const commandRedirects = new Map<string, { file: string; line: number; col: number }>()
  for (const name of commands) {
    const implPath = await findCommandImplPath(name, repoRoot)
    if (!implPath) continue
    commandRedirects.set(name, {
      file: toMapRel(implPath, repoRoot, mapPath),
      line: 1,
      col: 0,
    })
  }
  const resourceRedirects = new Map<string, { file: string; line: number; col: number }>()
  for (const name of resources) {
    const pos = await findPackMemberPos(packPath, name)
    if (!pos) continue
    resourceRedirects.set(name, {
      file: toMapRel(packPath, repoRoot, mapPath),
      line: pos.line,
      col: pos.col,
    })
  }

  // Build a (line, name) → redirect map for the destructure patterns in
  // sandstone.ts. The JS source map's mapping for `execute` (post-remap)
  // sits on the row of `commandsProxy`'s destructure where `execute` is
  // named. By matching line+col against the name positions in
  // sandstone.ts we can route to the right redirect.
  const sandstoneSrc = await readFile(sandstonePath, 'utf8')
  const sf = ts.createSourceFile(sandstonePath, sandstoneSrc, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
  const lineToName = new Map<number, string>() // 1-based line → name
  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    for (const decl of stmt.declarationList.declarations) {
      const init = decl.initializer
      const isProxy =
        init && ts.isIdentifier(init) && (init.text === 'commandsProxy' || init.text === 'packMethodsProxy')
      if (!isProxy) continue
      if (!ts.isObjectBindingPattern(decl.name)) continue
      for (const el of decl.name.elements) {
        if (!ts.isBindingElement(el) || !ts.isIdentifier(el.name)) continue
        const line = sf.getLineAndCharacterOfPosition(el.name.getStart(sf)).line + 1
        lineToName.set(line, el.name.text)
      }
    }
  }

  // Walk mappings. For each pointing at sandstone.ts at a line that has
  // a known command/resource name, redirect. Then ADD mappings at every
  // destructure OUTPUT position in the bundle so IDE ctrl-click on
  // `execute` (etc.) actually lands at ExecuteCommand's class, not at
  // the useless destructure row.
  const generator = new SourceMapGenerator({ file: 'index.js' })
  const consumer = new SourceMapConsumer(raw)
  let rewritten = 0

  consumer.eachMapping((m: any) => {
    if (m.generatedLine === null || m.generatedColumn === null) {
      return
    }
    if (m.source !== sources[sandstoneIdx]) {
      // Copy through unchanged.
      generator.addMapping({
        generated: { line: m.generatedLine, column: m.generatedColumn },
        original: { line: m.originalLine ?? 1, column: m.originalColumn ?? 0 },
        source: m.source,
        name: m.name,
      })
      return
    }
    const name = lineToName.get(m.originalLine ?? -1)
    const cmd = name && commandRedirects.get(name)
    const res = name && resourceRedirects.get(name)
    const target = cmd ?? res
    if (!target) {
      // Keep the sandstone.ts mapping for utilities, types, etc.
      generator.addMapping({
        generated: { line: m.generatedLine, column: m.generatedColumn },
        original: { line: m.originalLine ?? 1, column: m.originalColumn ?? 0 },
        source: m.source,
        name: m.name,
      })
      return
    }
    generator.addMapping({
      generated: { line: m.generatedLine, column: m.generatedColumn },
      original: { line: target.line, column: target.col },
      source: target.file,
      name: m.name,
    })
    rewritten++
  })

  // ADD mappings at the destructure OUTPUT positions in the bundle.
  // Bun's source map is sparse around these lines — without these
  // additions, ctrl-click / stack-trace lookup on `execute` (etc.) lands
  // on whatever mapping is nearest, which usually points at
  // sandstone.ts:76 (the commandsProxy declaration) — useless. We parse
  // the BUNDLE itself to find the exact generated (line, col) of each
  // local binding name, and add a mapping there pointing at the
  // implementation.
  //
  // Bun emits ONE huge destructure with two forms per public name:
  //
  //     var {
  //       execute: execute3,   // pull 'execute', bind to collision-renamed 'execute3'
  //       ...
  //       execute3 as execute, // re-export 'execute3' under the public name 'execute'
  //     } = commandsProxy2
  //
  // The IDE lands on the SECOND form (the alias). We add a mapping only
  // for that one — the alias's local name is unsuffixed and matches the
  // public name in sandstone.ts, so it goes through the command/resource
  // redirect map unchanged.
  const bundlePath = mapPath.replace(/\.map$/, '')
  const bundleSf = ts.createSourceFile(
    'bundle.js',
    await readFile(bundlePath, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.JS,
  )
  let addedCount = 0
  // Pass 1: top-level destructure (`var { X: Y2, ... } = proxy`). Only the
  // public-named binding (`X` in the first form, with no digit suffix)
  // needs a mapping — that's where bun captures the proxy value into a
  // local var. The collision-suffixed local (`Y2`) is the bridge to the
  // export statement, handled in pass 2.
  for (const stmt of bundleSf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    for (const decl of stmt.declarationList.declarations) {
      const init = decl.initializer
      if (!init || !ts.isIdentifier(init)) continue
      if (!/^commandsProxy|^packMethodsProxy/.test(init.text)) continue
      if (!ts.isObjectBindingPattern(decl.name)) continue
      for (const el of decl.name.elements) {
        if (!ts.isBindingElement(el) || !ts.isIdentifier(el.name)) continue
        const propText =
          el.propertyName && ts.isIdentifier(el.propertyName) ? el.propertyName.text : null
        const localText = el.name.text
        // Handle both forms:
        //   `X: Y2` (X is public source name, Y2 is collision-renamed local)
        //   `Y2 as X` (Y2 is collision-renamed, X is the public alias)
        // The public name is whichever of the two has no digit suffix.
        const propIsPublic = propText !== null && !/\d+$/.test(propText)
        const localIsPublic = !/\d+$/.test(localText)
        if (propIsPublic) {
          const cmd = commandRedirects.get(propText!)
          const res = resourceRedirects.get(propText!)
          const target = cmd ?? res
          if (target) {
            const nameStart = el.propertyName!.getStart(bundleSf)
            const { line, character } = bundleSf.getLineAndCharacterOfPosition(nameStart)
            generator.addMapping({
              generated: { line: line + 1, column: character },
              original: { line: target.line, column: target.col },
              source: target.file,
              name: propText!,
            })
            addedCount++
          }
        }
        if (localIsPublic && propText !== localText) {
          const cmd = commandRedirects.get(localText)
          const res = resourceRedirects.get(localText)
          const target = cmd ?? res
          if (target) {
            const nameStart = el.name.getStart(bundleSf)
            const { line, character } = bundleSf.getLineAndCharacterOfPosition(nameStart)
            generator.addMapping({
              generated: { line: line + 1, column: character },
              original: { line: target.line, column: target.col },
              source: target.file,
              name: localText,
            })
            addedCount++
          }
        }
      }
    }
  }
  // Pass 2: top-level export (`export { Y2 as X, ... }`). The alias
  // position (`X` after `as`) is where IDE ctrl-click lands for the
  // public name, so add a mapping there.
  for (const stmt of bundleSf.statements) {
    if (!ts.isExportDeclaration(stmt)) continue
    if (!stmt.exportClause || !ts.isNamedExports(stmt.exportClause)) continue
    for (const spec of stmt.exportClause.elements) {
      if (!ts.isExportSpecifier(spec)) continue
      if (!ts.isIdentifier(spec.name)) continue
      const publicName = spec.name.text
      const cmd = commandRedirects.get(publicName)
      const res = resourceRedirects.get(publicName)
      const target = cmd ?? res
      if (!target) continue
      const nameStart = spec.name.getStart(bundleSf)
      const { line, character } = bundleSf.getLineAndCharacterOfPosition(nameStart)
      generator.addMapping({
        generated: { line: line + 1, column: character },
        original: { line: target.line, column: target.col },
        source: target.file,
        name: publicName,
      })
      addedCount++
    }
  }
  // Pass 3: HARDCODED redirects for the four type-annotated single-name
  // command exports that bun compiles to collision-renamed locals
  // (`var give2 = (...) => sandstonePack2.commands.give(...)`).
  // These bypass `classifySandstoneExports`'s destructure detection —
  // mirror the four-name special case in
  // `bundle-declarations/source-maps.ts` so the .d.ts.map and .js.map
  // agree on where they live.
  const HARDCODED_REDIRECTS = new Map([
    ['give', 'give2'],
    ['setblock', 'setblock2'],
    ['fill', 'fill2'],
    ['summon', 'summon2'],
  ])
  for (const stmt of bundleSf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue
      const localName = decl.name.text
      const publicName = [...HARDCODED_REDIRECTS.entries()].find(([, v]) => v === localName)?.[0]
      if (!publicName) continue
      const target = commandRedirects.get(publicName)
      if (!target) continue
      const nameStart = decl.name.getStart(bundleSf)
      const { line, character } = bundleSf.getLineAndCharacterOfPosition(nameStart)
      generator.addMapping({
        generated: { line: line + 1, column: character },
        original: { line: target.line, column: target.col },
        source: target.file,
        name: publicName,
      })
      addedCount++
    }
  }
  console.log(`[debug-smart] added ${addedCount} new mappings`)

  const newMap = JSON.parse(generator.toString())
  for (const [k, v] of Object.entries(raw)) {
    if (k === 'sources' || k === 'sourcesContent' || k === 'mappings' || k === 'file') continue
    ;(newMap as Record<string, unknown>)[k] = v
  }
  await writeFile(mapPath, JSON.stringify(newMap))
  return rewritten
}

/**
 * Map an absolute source path to a path relative to the source map's
 * location (`dist/_internal/index.js.map` → 2 `..`s to reach the repo
 * root). Without the relative prefix, runtime tools can't resolve the
 * source and fall back to the bundled file.
 */
function toMapRel(absolutePath: string, repoRoot: string, mapPath: string): string {
  const rel = absolutePath.replace(repoRoot + '/', '')
  const mapDir = dirname(mapPath).replace(repoRoot + '/', '')
  // Walk up from mapDir to repo root, counting depth.
  const upLevels = mapDir.split('/').length
  return '../'.repeat(upLevels) + rel
}

/**
 * Post-process the JS bundle's source map. Updates `dist/_internal/index.js.map`
 * in place. Runs both passes: strip synthetic index.ts, then apply smart
 * redirects for commands and resources.
 */
export async function remapSyntheticIndexInFile(
  filePath: string,
  repoRoot: string,
): Promise<boolean> {
  const mapPath = `${filePath}.map`
  const pass1 = await remapSyntheticIndexInJsMap(mapPath)
  const pass2 = await applySmartRedirects(mapPath, repoRoot)
  return pass1 + pass2 > 0
}