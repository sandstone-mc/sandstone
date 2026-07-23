/**
 * Shared logic for the `resolve-type` CLI and the `tests/types/resolveExport`
 * helper. Pack the target package, install into a staged project, boot a
 * TS LanguageService, and resolve symbols to their hover-displayed types.
 *
 * Tarball caching: a git fingerprint (HEAD hash + working-tree state) is
 * stored next to the tarball. The tarball is rebuilt only when tracked
 * content changes since the last build — including switching between
 * different uncommitted change sets.
 */

import ts from 'typescript'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { $ } from 'bun'

export const REPO_ROOT = path.resolve(import.meta.dir, '..')
export const WORKSPACE_ROOT = path.resolve(REPO_ROOT, '..')
export const DEFAULT_TSCONFIG = '__default__'
const TEMP_DIR = path.join(REPO_ROOT, '.temp')
const PKG_DIR = path.join(TEMP_DIR, 'pkg')
const FINGERPRINT_FILE = path.join(TEMP_DIR, '.tarball-fingerprint')
const PROJECTS_DIR = path.join(TEMP_DIR, 'projects')

/**
 * A self-contained tsconfig shape used when no `--tsconfig` is supplied.
 * Mirrors `sandstone-template/tsconfig.json` exactly — keep these in sync.
 */
const DEFAULT_TSCONFIG_OBJECT: ts.CompilerOptions = {
  target: ts.ScriptTarget.ESNext,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  lib: ['ESNext'],
  strict: true,
  esModuleInterop: true,
  resolveJsonModule: true,
  allowSyntheticDefaultImports: true,
  noEmit: true,
  skipLibCheck: true,
  forceConsistentCasingInFileNames: true,
  allowImportingTsExtensions: true,
}

const splitImportPath = (
  spec: string,
): { packageName: string; subpath: string } => {
  if (spec.startsWith('@')) {
    const [scope, name, ...rest] = spec.split('/')
    return { packageName: `${scope}/${name}`, subpath: rest.join('/') }
  }
  const [name, ...rest] = spec.split('/')
  return { packageName: name, subpath: rest.join('/') }
}

const loadTsconfig = (tsconfigPath: string): ts.CompilerOptions => {
  const raw = ts.readConfigFile(tsconfigPath, ts.sys.readFile)
  if (raw.error) {
    const msg =
      typeof raw.error.messageText === 'string'
        ? raw.error.messageText
        : raw.error.messageText.messageText
    throw new Error(msg)
  }
  const parsed = ts.parseJsonConfigFileContent(
    raw.config,
    ts.sys,
    path.dirname(tsconfigPath),
    undefined,
    tsconfigPath,
  )
  if (parsed.errors.length) {
    throw new Error(
      ts.formatDiagnostics(parsed.errors, {
        getCanonicalFileName: (f) => f,
        getCurrentDirectory: () => process.cwd(),
        getNewLine: () => '\n',
      }),
    )
  }
  return parsed.options
}

/**
 * Compute a fingerprint of every tracked file's current state: HEAD commit +
 * working-tree diff + staged diff. Any change to tracked content (committed
 * or otherwise) flips this hash.
 */
export const computeGitFingerprint = async (dir: string): Promise<string> => {
  const git = (...args: string[]) => $`git -C ${dir} ${args}`.quiet().text()
  const head = (await git('rev-parse', 'HEAD')).trim()
  const status = (await git('status', '--porcelain', '--untracked-files=no')).trim()
  const unstaged = (await git('diff', 'HEAD')).trim()
  return crypto
    .createHash('sha256')
    .update(`HEAD:${head}\nSTATUS:${status}\nDIFF:${unstaged}\n`)
    .digest('hex')
}

const packPackage = async (packageRoot: string, dest: string): Promise<string> => {
  fs.mkdirSync(dest, { recursive: true })
  const out = await $`bun pm pack --ignore-scripts --quiet`.cwd(packageRoot).text()
  const fileName = out.trim().split('\n').pop() ?? ''
  const tarball = path.join(dest, fileName)
  fs.renameSync(path.join(packageRoot, fileName), tarball)
  return tarball
}

const installPackage = async (
  projectDir: string,
  packageName: string,
  tarball: string,
): Promise<void> => {
  fs.mkdirSync(projectDir, { recursive: true })
  fs.writeFileSync(
    path.join(projectDir, 'package.json'),
    JSON.stringify(
      {
        name: '__hover__',
        type: 'module',
        dependencies: { [packageName]: `file:${tarball}` },
      },
      null,
      2,
    ),
  )
  await $`bun install --silent`.cwd(projectDir).quiet()
}

const stageTemplate = (
  templateRoot: string,
  projectDir: string,
  tsconfigOptions: ts.CompilerOptions,
): string => {
  for (const entry of fs.readdirSync(templateRoot)) {
    if (
      entry.startsWith('.') ||
      entry === 'node_modules' ||
      entry === '.sandstone' ||
      entry === 'dist'
    ) continue
    const src = path.join(templateRoot, entry)
    const dst = path.join(projectDir, entry)
    const stat = fs.lstatSync(src)
    if (stat.isDirectory()) copyDir(src, dst)
    else fs.copyFileSync(src, dst)
  }
  const stagedTsconfig = path.join(projectDir, 'tsconfig.json')
  if (!fs.existsSync(stagedTsconfig)) {
    fs.writeFileSync(stagedTsconfig, JSON.stringify(tsconfigOptions, null, 2))
  }
  return stagedTsconfig
}

const copyDir = (src: string, dst: string): void => {
  fs.mkdirSync(dst, { recursive: true })
  for (const entry of fs.readdirSync(src)) {
    if (entry.startsWith('.') || entry === 'node_modules') continue
    const s = path.join(src, entry)
    const d = path.join(dst, entry)
    const stat = fs.lstatSync(s)
    if (stat.isDirectory()) copyDir(s, d)
    else fs.copyFileSync(s, d)
  }
}

const collectTSFiles = (dir: string): string[] => {
  const out: string[] = []
  const walk = (d: string): void => {
    if (!fs.existsSync(d)) return
    for (const entry of fs.readdirSync(d)) {
      if (entry === 'node_modules' || entry.startsWith('.')) continue
      const full = path.join(d, entry)
      const stat = fs.statSync(full)
      if (stat.isDirectory()) walk(full)
      else if (/\.tsx?$/.test(entry)) out.push(full)
    }
  }
  walk(dir)
  return out
}

export type ResolvedPackage = {
  packageName: string
  packageRoot: string
  tarball: string
}

const resolvePackageRoot = (importPath: string): string | null => {
  // Try module resolution from several candidate dirs. Bundler resolution
  // needs a `node_modules` somewhere up the tree, so we search from the
  // workspace root (which has sandstone-template/node_modules).
  const candidates = [
    WORKSPACE_ROOT,
    REPO_ROOT,
    import.meta.dir,
  ]
  const { packageName } = splitImportPath(importPath)
  const opts: ts.CompilerOptions = {
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    target: ts.ScriptTarget.ESNext,
    allowJs: true,
  }
  for (const from of candidates) {
    const host = ts.createCompilerHost(opts, true)
    const result = ts.resolveModuleName(
      importPath,
      path.join(from, '__virtual__.ts'),
      opts,
      host,
    )
    const entry = result.resolvedModule?.resolvedFileName
    if (entry) {
      let dir = path.dirname(entry)
      while (dir !== path.dirname(dir)) {
        if (fs.existsSync(path.join(dir, 'package.json'))) return dir
        dir = path.dirname(dir)
      }
    }
  }
  // Last-ditch: if the requested import name matches our own package, return self.
  const selfPkg = path.join(REPO_ROOT, 'package.json')
  if (fs.existsSync(selfPkg)) {
    const self = JSON.parse(fs.readFileSync(selfPkg, 'utf8'))
    if (self.name === packageName) return REPO_ROOT
  }
  return null
}

/**
 * Build (or reuse) the tarball for `packageRoot`. Reuses when the current
 * git fingerprint matches the one stored alongside the tarball.
 */
export const ensureTarball = async (
  packageRoot: string,
): Promise<ResolvedPackage> => {
  const pkg = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'))
  const packageName: string = pkg.name

  fs.mkdirSync(TEMP_DIR, { recursive: true })
  const fingerprint = await computeGitFingerprint(packageRoot)

  const stored = fs.existsSync(FINGERPRINT_FILE)
    ? fs.readFileSync(FINGERPRINT_FILE, 'utf8').trim()
    : null
  const existingTarballs = fs.existsSync(PKG_DIR)
    ? fs.readdirSync(PKG_DIR).filter((f) => f.endsWith('.tgz'))
    : []
  const tarballPath = existingTarballs.length
    ? path.join(PKG_DIR, existingTarballs[0])
    : null
  const tarballExists = !!tarballPath && fs.existsSync(tarballPath)

  if (stored === fingerprint && tarballExists) {
    return { packageName, packageRoot, tarball: tarballPath! }
  }

  // (Re)build. Drop both old tarballs and the per-package projects so the
  // install step always sees a fresh tarball.
  if (fs.existsSync(PKG_DIR)) fs.rmSync(PKG_DIR, { recursive: true, force: true })
  if (fs.existsSync(PROJECTS_DIR)) fs.rmSync(PROJECTS_DIR, { recursive: true, force: true })
  const tarball = await packPackage(packageRoot, PKG_DIR)
  fs.writeFileSync(FINGERPRINT_FILE, fingerprint)
  return { packageName, packageRoot, tarball }
}

export type HoverEnv = {
  ls: ts.LanguageService
  projectDir: string
  /**
   * Resolve a named import to its hover-displayed type string. Each call
   * appends a host-source entry so the LS sees the symbol as imported.
   */
  resolve: (importPath: string, name: string) => Promise<string>
  /**
   * Same as `resolve`, but returns the raw LS display parts (text + kind).
   * Useful when callers need to inspect the syntax kind (e.g. detect the
   * `any` keyword without false-positive on identifiers like `anyValue`).
   */
  parts: (importPath: string, name: string) => Promise<{ text: string; kind: string }[]>
}

const buildHostSource = (entries: { importPath: string; name: string }[]): string => {
  const seen = new Set<string>()
  const lines: string[] = []
  for (const { importPath, name } of entries) {
    const ip = JSON.stringify(importPath)
    const valueKey = `V:${ip}:${name}`
    if (!seen.has(valueKey)) {
      seen.add(valueKey)
      lines.push(`import { ${name} } from ${ip};`)
    }
    const typeKey = `T:${ip}:${name}`
    if (!seen.has(typeKey)) {
      seen.add(typeKey)
      lines.push(`import type { ${name} as ${name}Type } from ${ip};`)
    }
  }
  lines.push(`export {};`)
  return lines.join('\n') + '\n'
}

const writeHostFile = (
  hostFile: string,
  entries: { importPath: string; name: string }[],
): void => {
  fs.mkdirSync(path.dirname(hostFile), { recursive: true })
  fs.writeFileSync(hostFile, buildHostSource(entries))
}

const findImportPositions = (
  sf: ts.SourceFile,
  exportName: string,
  importPath: string,
): { valuePos: number | null; typePos: number | null } => {
  let valuePos: number | null = null
  let typePos: number | null = null
  // Strip surrounding quotes from the source-text module specifier (e.g.
  // `"sandstone/arguments"` → `sandstone/arguments`) before comparing.
  const targetImport = importPath.replace(/^['"]|['"]$/g, '')
  for (const stmt of sf.statements) {
    if (!ts.isImportDeclaration(stmt)) continue
    if (stmt.moduleSpecifier.getText().replace(/^['"]|['"]$/g, '') !== targetImport) continue
    const stmtIsTypeOnly = (stmt as { isTypeOnly?: boolean }).isTypeOnly
    const clauseIsTypeOnly = (
      stmt.importClause as { isTypeOnly?: boolean } | undefined
    )?.isTypeOnly
    const isTypeOnly = stmtIsTypeOnly ?? clauseIsTypeOnly ?? false
    const named = stmt.importClause?.namedBindings
    if (!named || !ts.isNamedImports(named)) continue
    for (const spec of named.elements) {
      const importedName = (spec.propertyName ?? spec.name).text
      const localName = spec.name.text
      if (importedName === exportName && !isTypeOnly) valuePos = spec.name.getStart()
      if (importedName === exportName && isTypeOnly) typePos = spec.name.getStart()
      if (localName === `${exportName}Type` && isTypeOnly) typePos = spec.name.getStart()
    }
  }
  return { valuePos, typePos }
}

/**
 * Boot (or reuse) a LS-backed hover env for the given package + tsconfig.
 * Memoized per-process across calls.
 */
export const getHoverEnv = async (options: {
  resolved: ResolvedPackage
  tsconfigPath: string
}): Promise<HoverEnv> => {
  const { resolved, tsconfigPath } = options
  const { packageName, tarball } = resolved

  const projectDir = path.join(PROJECTS_DIR, packageName)
  // Resolve the tsconfig to use. `__default__` means a self-contained config
  // (mirrors the sandstone-template tsconfig); otherwise load from disk.
  const useDefault = tsconfigPath === DEFAULT_TSCONFIG || tsconfigPath === '__default__'
  const tsconfigOptions = useDefault
    ? DEFAULT_TSCONFIG_OBJECT
    : loadTsconfig(tsconfigPath)

  // Rebuild the staged project if it's missing — package was just built, or
  // first call in this process.
  if (!fs.existsSync(path.join(projectDir, 'node_modules', packageName))) {
    if (fs.existsSync(projectDir)) fs.rmSync(projectDir, { recursive: true, force: true })
    await installPackage(projectDir, packageName, tarball)
    // Only stage a template if the user provided a real tsconfig path
    // (which lives in a directory we can copy other files from).
    if (!useDefault) {
      stageTemplate(path.dirname(tsconfigPath), projectDir, tsconfigOptions)
    }
    // Always ensure a tsconfig.json exists in the staged project.
    const stagedTsconfig = path.join(projectDir, 'tsconfig.json')
    if (!fs.existsSync(stagedTsconfig)) {
      fs.writeFileSync(stagedTsconfig, JSON.stringify(tsconfigOptions, null, 2))
    }
  }

  const hostFile = path.join(projectDir, 'src', '__hover_host__.ts')

  // Per-env monotonic counter so each host-file write triggers an LS
  // re-parse. Without it the LS caches the first snapshot and ignores edits.
  let hostVersion = 0
  const lsHost: ts.LanguageServiceHost = {
    getCompilationSettings: () => tsconfigOptions,
    getScriptFileNames: () => collectTSFiles(projectDir),
    getScriptVersion: (fileName) =>
      fileName === hostFile ? String(hostVersion++) : '1',
    getScriptSnapshot: (fileName: string) => {
      if (!fs.existsSync(fileName)) return undefined
      return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName, 'utf8'))
    },
    getCurrentDirectory: () => projectDir,
    getDefaultLibFileName: (opts) => ts.getDefaultLibFilePath(opts),
    useCaseSensitiveFileNames: () => ts.sys.useCaseSensitiveFileNames,
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    directoryExists: ts.sys.directoryExists,
    getDirectories: ts.sys.getDirectories,
  }
  const ls = ts.createLanguageService(
    lsHost,
    ts.createDocumentRegistry(ts.sys.useCaseSensitiveFileNames, projectDir),
  )

  // Write a fresh host file per call containing ONLY the current symbol.
  // Accumulating symbols causes TS to re-evaluate the whole file each time,
  // and after many calls the LS begins collapsing complex types to `any`
  // (notably default type arguments like `DataPointClass<T = any>`).
  const hover = (
    importPath: string,
    name: string,
  ): { formatted: string; parts: { text: string; kind: string }[] } => {
    writeHostFile(hostFile, [{ importPath, name }])
    // Nudge the LS so it re-reads the host file from disk.
    ls.getSemanticDiagnostics(hostFile)
    const program = ls.getProgram()
    if (!program) throw new Error('LS produced no program')
    const sf = program.getSourceFile(hostFile)
    if (!sf) throw new Error('Host source not found in program')
    const { valuePos, typePos } = findImportPositions(sf, name, importPath)
    if (valuePos === null && typePos === null) {
      throw new Error(`Could not locate import for "${name}" from ${importPath}`)
    }
    const at = (pos: number): ts.QuickInfo | undefined =>
      ls.getQuickInfoAtPosition(hostFile, pos)
    const valueInfo = valuePos !== null ? at(valuePos) : undefined
    const typeInfo = typePos !== null ? at(typePos) : undefined
    const best = valueInfo ?? typeInfo
    if (!best?.displayParts) {
      throw new Error(`No hover info for "${name}" from ${importPath}`)
    }
    const text = best.displayParts.map((p) => p.text).join('')
    const lines = text.split('\n')
    if (lines.length > 1 && lines[lines.length - 1].trim() === `import ${name}`) {
      lines.pop()
    }
    const stripped = lines.join('\n')
    const formatted =
      best === valueInfo
        ? stripped
        : stripped.replace(new RegExp(`\\b${name}Type\\b`, 'g'), name)
    const parts = best.displayParts.map((p) => ({ text: p.text, kind: String(p.kind) }))
    return { formatted, parts }
  }

  const resolve = async (importPath: string, name: string): Promise<string> =>
    hover(importPath, name).formatted
  const parts = async (
    importPath: string,
    name: string,
  ): Promise<{ text: string; kind: string }[]> => hover(importPath, name).parts

  return { ls, projectDir, resolve, parts }
}

/**
 * Convenience: resolve one symbol end-to-end. Internally memoizes the LS
 * + tarball within a single process.
 */
export const resolveSymbol = async (
  importPath: string,
  name: string,
  options: { tsconfigPath?: string } = {},
): Promise<string> => {
  const tsconfigPath = options.tsconfigPath ?? DEFAULT_TSCONFIG
  const packageRoot = resolvePackageRoot(importPath)
  if (!packageRoot) throw new Error(`Cannot resolve package root for "${importPath}"`)
  const resolved = await ensureTarball(packageRoot)
  const env = await getHoverEnv({ resolved, tsconfigPath })
  return env.resolve(importPath, name)
}

/** Internal API for tests/types/resolveExport.ts — memoizes across calls. */
const envCache = new Map<string, Promise<HoverEnv>>()
export const resolveSymbolMemoized = async (
  importPath: string,
  name: string,
  options: { tsconfigPath?: string } = {},
): Promise<string> => {
  const tsconfigPath = options.tsconfigPath ?? DEFAULT_TSCONFIG
  const cacheKey = `${tsconfigPath}`
  let envPromise = envCache.get(cacheKey)
  if (!envPromise) {
    const packageRoot = resolvePackageRoot(importPath)
    if (!packageRoot) throw new Error(`Cannot resolve package root for "${importPath}"`)
    const resolved = await ensureTarball(packageRoot)
    envPromise = getHoverEnv({ resolved, tsconfigPath })
    envCache.set(cacheKey, envPromise)
  }
  const env = await envPromise
  return env.resolve(importPath, name)
}

/**
 * Lower-level: returns the raw display parts (text + syntax kind) from the
 * LS hover, so callers can scan for specific kinds (e.g. keyword `any`)
 * without false positives from identifiers containing the substring.
 */
export const resolveSymbolParts = async (
  importPath: string,
  name: string,
  options: { tsconfigPath?: string } = {},
): Promise<{ text: string; kind: string }[]> => {
  const tsconfigPath = options.tsconfigPath ?? DEFAULT_TSCONFIG
  const cacheKey = tsconfigPath
  let envPromise = envCache.get(cacheKey)
  if (!envPromise) {
    const packageRoot = resolvePackageRoot(importPath)
    if (!packageRoot) throw new Error(`Cannot resolve package root for "${importPath}"`)
    const resolved = await ensureTarball(packageRoot)
    envPromise = getHoverEnv({ resolved, tsconfigPath })
    envCache.set(cacheKey, envPromise)
  }
  const env = await envPromise
  // Reach into the env to grab the LS + host file by re-resolving and
  // re-running hover. The env.resolve is a closure; we add a parallel
  // helper below to expose raw parts.
  return env.parts(importPath, name)
}

/**
 * List every exported name from a package entry, including types, interfaces,
 * classes, values, and re-exports. Resolves to the package's main `.d.ts`
 * via the tarball's installed path, so this works without the package being
 * on disk at the import-path's expected location.
 */
export const listExports = async (
  importPath: string,
  options: { tsconfigPath?: string } = {},
): Promise<string[]> => {
  const tsconfigPath = options.tsconfigPath ?? DEFAULT_TSCONFIG
  // Ensure the tarball is unpacked so we have a `.d.ts` to parse. We don't
  // need the full hover env to enumerate exports.
  const packageRoot = resolvePackageRoot(importPath)
  if (!packageRoot) throw new Error(`Cannot resolve package root for "${importPath}"`)
  const resolved = await ensureTarball(packageRoot)

  // Find the .d.ts entry inside the installed tarball. Walk package.json's
  // `exports` map for the subpath, falling back to dist/exports/<sub>/index.d.ts
  // which is the layout sandstone uses.
  const pkg = JSON.parse(
    fs.readFileSync(path.join(resolved.packageRoot, 'package.json'), 'utf8'),
  ) as { name: string; exports?: Record<string, unknown> }
  const { subpath } = splitImportPath(importPath)
  let dtsRelative: string | null = null
  const exportsField = pkg.exports
  if (exportsField && typeof exportsField === 'object' && subpath) {
    const entry = (exportsField as Record<string, unknown>)[`./${subpath}`]
    if (entry && typeof entry === 'object') {
      const cond = (entry as { types?: string }).types
      if (typeof cond === 'string') dtsRelative = cond
    }
  }
  if (!dtsRelative) {
    dtsRelative =
      subpath === ''
        ? 'dist/exports/index.d.ts'
        : `dist/exports/${subpath}/index.d.ts`
  }
  const dts = path.join(resolved.packageRoot, dtsRelative)
  if (!fs.existsSync(dts)) {
    throw new Error(`Cannot find .d.ts at ${dts}`)
  }

  const useDefault = tsconfigPath === DEFAULT_TSCONFIG || tsconfigPath === '__default__'
  const opts = useDefault ? DEFAULT_TSCONFIG_OBJECT : loadTsconfig(tsconfigPath)
  const program = ts.createProgram({
    rootNames: [dts],
    options: { ...opts, noEmit: true },
  })
  const checker = program.getTypeChecker()
  const sf = program.getSourceFile(dts)
  if (!sf) throw new Error(`Source file not in program: ${dts}`)
  const moduleSym = checker.getSymbolAtLocation(sf)
  if (!moduleSym) throw new Error(`No module symbol for ${dts}`)

  // getExportsOfModule already follows re-export aliases.
  return checker
    .getExportsOfModule(moduleSym)
    .map((s) => s.name)
    .filter((n) => n !== 'default')
}