/**
 * Source-map helpers: rewrite the `sources` paths after we move files
 * from `types/` to `dist/_internal/types/`, and emit a fresh source map
 * for the bundled `dist/_internal/index.d.ts` so IDE ctrl-click navigation
 * can follow declarations back to `src/sandstone.ts`.
 */
import { readFile } from 'fs/promises'
import path from 'node:path'
import { SourceMapGenerator } from 'source-map-js'
import * as ts from '@typescript/typescript6'
import { collectExportedSymbols } from './symbols'

/**
 * Rewrite the `sources` paths in a `.d.ts.map` JSON after `copyDtsFiles`
 * moves the file two directories deeper (`types/` → `dist/_internal/types/`).
 */
export function rewriteSourcePathsInMap(content: string): string {
  const map = JSON.parse(content)
  if (Array.isArray(map.sources)) {
    map.sources = map.sources.map((s: string) =>
      s.startsWith('../') ? '../../' + s : s,
    )
  }
  return JSON.stringify(map)
}

/**
 * Shift every generated-line mapping in a `.d.ts.map` by `lineDelta` lines.
 * Used after `copyDtsFiles` prepends N lines of consolidated imports — the
 * map's mappings string was produced by `tsc` against the original file,
 * so without this shift IDE ctrl-click would land N lines below the real
 * declaration (e.g. `Score` ctrl-click landing on `unaryOperation`).
 *
 * The shift is implemented by prepending `lineDelta` empty `;`-separated
 * segments to `mappings`, which adds `lineDelta` empty generated lines
 * at the top. All existing mappings retain their relative order; their
 * absolute generated line numbers increase by `lineDelta`.
 */
export function shiftMappingsByLines(content: string, lineDelta: number): string {
  if (lineDelta === 0) return content
  if (lineDelta < 0) {
    throw new Error(`shiftMappingsByLines: negative lineDelta (${lineDelta}) not supported`)
  }
  const map = JSON.parse(content)
  if (typeof map.mappings !== 'string') return content
  map.mappings = ';'.repeat(lineDelta) + map.mappings
  return JSON.stringify(map)
}

/**
 * Count the number of generated lines added to a file by a text
 * transformation. If `before` has `B` lines and `after` has `A` lines,
 * the delta is `A - B` (positive when lines were added).
 */
export function lineDelta(before: string, after: string): number {
  return after.split('\n').length - before.split('\n').length
}

/**
 * Classify the synthetic `src/sandstone.ts` exports into commands vs.
 * resources. Both groups go through opaque proxies (`commandsProxy` /
 * `packMethodsProxy`) at runtime, so ctrl-click on the synthetic entry
 * lands on a useless destructure row. The source-map needs to redirect
 * these to their REAL source — command implementation files for
 * commands, `src/pack/pack.ts` for resources — so the IDE actually
 * navigates somewhere useful.
 *
 * Detection is structural, not name-based:
 *   - Commands: every name destructured from `commandsProxy` (line ~80
 *     block) plus the explicit `export const give/setblock/fill/summon`
 *     type-annotated declarations (lines ~157-170).
 *   - Resources: every name in the `// Resources` block of the
 *     `packMethodsProxy` destructure (lines ~200-246). Variables in the
 *     same destructure (lines ~248+) are NOT redirected — they're not
 *     resources, just sharing the proxy.
 *
 * Returns `{ commands: Set<string>, resources: Set<string> }`.
 */
export async function classifySandstoneExports(
  sandstoneTsPath: string,
): Promise<{
  commands: Set<string>
  resources: Set<string>
  /** Names pulled from a `import * as ns from './module'` destructure. */
  nsRedirects: Map<string, { fromPath: string }>
}> {
  const src = await readFile(sandstoneTsPath, 'utf8').catch(() => '')
  const sf = ts.createSourceFile(
    sandstoneTsPath,
    src,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  const commands = new Set<string>()
  const resources = new Set<string>()
  const nsRedirects = new Map<string, { fromPath: string }>()

  // Walk all `import * as ns from './path'` declarations first so we know
  // which identifier is a namespace import (and what module it pulls from).
  const nsImportPaths = new Map<string, string>()
  for (const stmt of sf.statements) {
    if (!ts.isImportDeclaration(stmt)) continue
    const ns = stmt.importClause?.namedBindings
    if (!ns || !ts.isNamespaceImport(ns)) continue
    const moduleSpecifier = stmt.moduleSpecifier
    if (!ts.isStringLiteral(moduleSpecifier)) continue
    nsImportPaths.set(ns.name.text, moduleSpecifier.text)
  }

  for (const stmt of sf.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    const isExported = (stmt.modifiers ?? []).some(
      (m) => m.kind === ts.SyntaxKind.ExportKeyword,
    )
    if (!isExported) continue

    for (const decl of stmt.declarationList.declarations) {
      // Detect the proxy being destructured by reading the RHS of the
      // initializer. Both proxies have unique names (`commandsProxy` /
      // `packMethodsProxy`).
      const init = decl.initializer
      const isCommandsProxy =
        init &&
        ts.isIdentifier(init) &&
        init.text === 'commandsProxy'
      const isPackProxy =
        init &&
        ts.isIdentifier(init) &&
        init.text === 'packMethodsProxy'

      if (isCommandsProxy && ts.isObjectBindingPattern(decl.name)) {
        // Only collect names from the COMMANDS section. The destructure
        // covers everything from the proxy, but `commandsProxy` only
        // contains commands by construction — every name here is a
        // command.
        for (const el of decl.name.elements) {
          if (
            ts.isBindingElement(el) &&
            ts.isIdentifier(el.name)
          ) {
            commands.add(el.name.text)
          }
        }
      } else if (isPackProxy && ts.isObjectBindingPattern(decl.name)) {
        // Every name destructured from `packMethodsProxy` is a member of
        // the `SandstonePack` class — whether the comment says
        // `// Resources`, `// Variables`, or nothing at all. Redirect
        // every one of them to the matching `SandstonePack.<name>`
        // method declaration in `src/pack/pack.ts`. The Resources /
        // Variables split is purely cosmetic; what matters for IDE
        // ctrl-click is landing in the right file.
        for (const el of decl.name.elements) {
          if (
            !ts.isBindingElement(el) ||
            !ts.isIdentifier(el.name)
          )
            continue
          resources.add(el.name.text)
        }
      } else if (
        isExported &&
        ts.isObjectBindingPattern(decl.name) &&
        init &&
        ts.isIdentifier(init) &&
        nsImportPaths.has(init.text)
      ) {
        // `export const { X, Y } = coordinates` where `coordinates` is a
        // `import * as coordinates from './module'`. Each destructure name
        // is a re-export from that module — record the source path so
        // `generateMainIndexMap` can redirect there.
        const fromPath = nsImportPaths.get(init.text)!
        for (const el of decl.name.elements) {
          if (
            !ts.isBindingElement(el) ||
            !ts.isIdentifier(el.name)
          )
            continue
          nsRedirects.set(el.name.text, { fromPath })
        }
      } else if (
        isExported &&
        ts.isIdentifier(decl.name) &&
        decl.initializer
      ) {
        // Explicit single-name exports like `export const give: ...`.
        // These are commands that need explicit type annotations
        // (give/setblock/fill/summon). Detect via known names — there
        // are only four of them, and adding more would require a real
        // type-driven classifier.
        if (/^(give|setblock|fill|summon)$/.test(decl.name.text)) {
          commands.add(decl.name.text)
        }
      }
    }
  }

  return { commands, resources, nsRedirects }
}

/**
 * Find the implementation file for a given command by walking the
 * `src/commands/implementations/` tree for a `commandName.ts` file.
 * Returns the absolute path or `null` when none matches. The lookup is
 * name-based, not name+category — Minecraft command names are unique
 * across categories (e.g. `effect` only lives in `entity/`, never
 * elsewhere).
 */
export async function findCommandImplPath(
  commandName: string,
  repoRoot: string,
): Promise<string | null> {
  const { readdir } = await import('node:fs/promises')
  const implRoot = path.join(repoRoot, 'src', 'commands', 'implementations')
  const categories = await readdir(implRoot).catch(() => [])
  for (const cat of categories) {
    const candidate = path.join(implRoot, cat, `${commandName}.ts`)
    if (await Bun.file(candidate).exists()) return candidate
  }
  return null
}

/**
 * Find the position of a method/property declaration inside the
 * `SandstonePack` class in `src/pack/pack.ts`. Returns
 * `{ line: 1-based, col: 0-based }` or `null` when the class/member
 * isn't found. Walks the AST so renaming the proxy doesn't break the
 * redirect — only the `SandstonePack` class name is hardcoded.
 */
export async function findPackMemberPos(
  packFile: string,
  memberName: string,
): Promise<{ line: number; col: number } | null> {
  const src = await readFile(packFile, 'utf8').catch(() => '')
  if (!src) return null
  const sf = ts.createSourceFile(
    packFile,
    src,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  )
  let result: { line: number; col: number } | null = null
  function visit(node: ts.Node) {
    if (
      !result &&
      ts.isClassDeclaration(node) &&
      node.name?.text === 'SandstonePack'
    ) {
      for (const member of node.members) {
        // Class members expose their name via `name` property; for
        // methods/properties/accessors it's an Identifier, for
        // constructor it's the keyword.
        const name =
          ts.isMethodDeclaration(member) ||
          ts.isPropertyDeclaration(member) ||
          ts.isGetAccessorDeclaration(member) ||
          ts.isSetAccessorDeclaration(member)
            ? member.name && ts.isIdentifier(member.name)
              ? member.name.text
              : null
            : null
        if (name === memberName) {
          const pos = member.name && ts.isIdentifier(member.name)
            ? sf.getLineAndCharacterOfPosition(member.name.getStart(sf))
            : sf.getLineAndCharacterOfPosition(member.getStart(sf))
          result = { line: pos.line + 1, col: pos.character }
          return
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(sf)
  return result
}

/**
 * Generate a source map for the bundled `dist/_internal/index.d.ts` that
 * maps each exported symbol back to its source position in
 * `src/sandstone.ts`. This gives the IDE precise ctrl-click navigation for
 * the destructured-from-`commandsProxy` and `packMethodsProxy` exports,
 * which `tsc` collapses into a single combined declaration in
 * `types/sandstone.d.ts` and therefore can't be resolved through the
 * default chain alone.
 *
 * Two special-case redirects override the default `sandstone.ts` target:
 *
 *   1. **Commands** — names destructured from `commandsProxy` (e.g.
 *      `say`, `give`) and the four type-annotated single-name exports
 *      (`give`, `setblock`, `fill`, `summon`) are redirected to their
 *      implementation file under `src/commands/implementations/<cat>/`.
 *      The natural `goToDefinition` target would be `src/commands.ts`
 *      (the barrel file that re-exports each command class), which is
 *      useless — every command lands on the same line. The user wants
 *      the actual implementation file instead. Hack by name.
 *
 *   2. **Resources** — names in the `// Resources` block of the
 *      `packMethodsProxy` destructure (`MCFunction`, `Advancement`, ...)
 *      are redirected to their method declarations on the `SandstonePack`
 *      class inside `src/pack/pack.ts`. Without this redirect, IDE
 *      ctrl-click on `Advancement` lands on the destructure row in
 *      `src/sandstone.ts:204` — a useless one-liner.
 *
 * All other exports (variables, utils, NBT types, ...) keep the default
 * `src/sandstone.ts` target.
 */
export async function generateMainIndexMap(
  bundledDtsPath: string,
  sandstoneTsPath: string,
  repoRoot: string,
): Promise<string> {
  const { bundled, src } = await resolveRedirects(
    bundledDtsPath,
    sandstoneTsPath,
    repoRoot,
  )

  const bundledByName = new Map<string, { line: number; col: number }>()
  for (const s of bundled) bundledByName.set(s.name, s)

  const generator = new SourceMapGenerator({ file: 'index.d.ts' })
  for (const s of src) {
    const b = bundledByName.get(s.name)
    if (!b) continue
    generator.addMapping({
      generated: { line: b.line, column: b.col },
      source: s.sourceFile,
      original: { line: s.line, column: s.col },
      name: s.name,
    })
  }

  return generator.toString()
}

/**
 * Resolve each `src/sandstone.ts` symbol to either its default
 * `sandstone.ts` position or a redirected target (command impl file /
 * `pack.ts` SandstonePack class member). Returns the symbol list with
 * `sourceFile` set per symbol so the SourceMapGenerator can emit
 * different `sources` entries.
 */
const resolveRedirects = async (
  bundledDtsPath: string,
  sandstoneTsPath: string,
  repoRoot: string,
): Promise<{
  bundled: { name: string; line: number; col: number }[]
  src: Array<{ name: string; line: number; col: number; sourceFile: string }>
}> => {
  const [bundled, srcSymbols, { commands, resources, nsRedirects }] =
    await Promise.all([
      collectExportedSymbols(bundledDtsPath),
      collectExportedSymbols(sandstoneTsPath),
      classifySandstoneExports(sandstoneTsPath),
    ])

  const packSrc = path.join(repoRoot, 'src', 'pack', 'pack.ts')
  const commandRedirects = new Map<
    string,
    { line: number; col: number; file: string }
  >()
  const resourceRedirects = new Map<
    string,
    { line: number; col: number; file: string }
  >()
  const nsDestinationRedirects = new Map<
    string,
    { line: number; col: number; file: string }
  >()

  // Source paths in the map MUST be relative to where the map file lives
  // — `dist/_internal/index.d.ts.map` → `../../src/sandstone.ts`. The
  // working map at `dist/_internal/types/core/resources/index.d.ts.map`
  // uses 5 `../`s for the same reason. Without this prefix, the IDE
  // can't resolve the source and falls back to the bundled file (the
  // exact bug we hit).
  const REL_TO_MAP_FROM_REPO = '../../'
  const toMapRel = (repoRel: string) => REL_TO_MAP_FROM_REPO + repoRel

  await Promise.all(
    [...commands].map(async (name) => {
      const impl = await findCommandImplPath(name, repoRoot)
      if (!impl) return
      const symbols = await collectExportedSymbols(impl)
      const target: { name: string; line: number; col: number } | undefined =
        symbols.find((s: { name: string; line: number; col: number }) => s.name === name) ?? symbols[0]
      if (!target) return
      commandRedirects.set(name, {
        file: toMapRel(path.relative(repoRoot, impl).split(path.sep).join('/')),
        line: target.line,
        col: target.col,
      })
    }),
  )

  await Promise.all(
    [...resources].map(async (name) => {
      const pos = await findPackMemberPos(packSrc, name)
      if (!pos) return
      resourceRedirects.set(name, {
        file: toMapRel(
          path.relative(repoRoot, packSrc).split(path.sep).join('/'),
        ),
        line: pos.line,
        col: pos.col,
      })
    }),
  )

  // For `export const { X, Y } = coordinates` where `coordinates` is a
  // `import * as coordinates from './module'`, redirect X/Y to that
  // module's re-export site (`./module/index.ts`). Line 1:0 lands on
  // the index.ts which `export *`s the actual definition.
  for (const [name, { fromPath }] of nsRedirects) {
    const target = path.join(repoRoot, 'src', fromPath, 'index.ts')
    const targetRepoRel = path.relative(repoRoot, target).split(path.sep).join('/')
    nsDestinationRedirects.set(name, {
      file: toMapRel(targetRepoRel),
      line: 1,
      col: 0,
    })
  }

  // Default source for symbols without a redirect: `src/sandstone.ts`,
  // relative to the map file.
  const bundledRel = REL_TO_MAP_FROM_REPO + 'src/sandstone.ts'

  // Hardcoded overrides for exports that don't fit the proxy patterns.
  // `_` is defined as `export const _: Flow = new Proxy(...)` in
  // `src/sandstone.ts:194` — a standalone declaration, NOT destructured
  // from `packMethodsProxy` or `commandsProxy`, so the auto-classifier
  // misses it and the default points at the synthetic barrel. Redirect
  // it to the `Flow` class declaration in `src/flow/Flow.ts`.
  //
  // Line/column is hardcoded to the `Flow` keyword on the
  // `export class Flow {` declaration. We grep for it on every build
  // so a future rename of the class doesn't silently drift — better to
  // fail at build time than serve a broken redirect.
  const HARDCODED: Record<
    string,
    { file: string; line: number; col: number }
  > = {}
  const flowFile = path.join(repoRoot, 'src', 'flow', 'Flow.ts')
  const flowSrc = await readFile(flowFile, 'utf8').catch(() => '')
  const flowClassMatch = flowSrc.match(/^export class Flow \{/m)
  if (flowClassMatch?.index !== undefined) {
    // Capture index into a local — `String.match`'s return type is
    // `RegExpMatchArray | null`, so `flowClassMatch.index` is only
    // narrowed inside an `if (flowClassMatch)` block in some TS
    // configs. Storing it as a local avoids the `possibly undefined`
    // diagnostic and makes the offsets explicit.
    const matchIndex = flowClassMatch.index
    const upTo = flowSrc.slice(0, matchIndex)
    const lastNl = upTo.lastIndexOf('\n')
    const col = matchIndex - (lastNl === -1 ? 0 : lastNl + 1)
    // The regex match's index points at the `e` in `export`. We want
    // the `F` in `Flow`, which is `export class `.length = 13 chars
    // later (modulo indentation if the class is ever indented — it
    // isn't currently).
    HARDCODED._ = {
      file: REL_TO_MAP_FROM_REPO + 'src/flow/Flow.ts',
      line: upTo.split('\n').length,
      col: col + 13,
    }
  }

  // Source-map-js `addMapping` stores `original.line` as-is — pass our
  // 1-based editor-visible positions straight through. (LSP returns
  // 0-based; the test log adds +1 when formatting the display.)
  const src = srcSymbols.map((s) => {
    const cmd = commandRedirects.get(s.name)
    const res = resourceRedirects.get(s.name)
    const ns = nsDestinationRedirects.get(s.name)
    const hard = HARDCODED[s.name]
    if (hard)
      return { ...s, sourceFile: hard.file, line: hard.line, col: hard.col }
    if (cmd)
      return { ...s, sourceFile: cmd.file, line: cmd.line, col: cmd.col }
    if (res)
      return { ...s, sourceFile: res.file, line: res.line, col: res.col }
    if (ns)
      return { ...s, sourceFile: ns.file, line: ns.line, col: ns.col }
    return { ...s, sourceFile: bundledRel }
  })

  return { bundled, src }
}