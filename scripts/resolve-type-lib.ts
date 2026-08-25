/**
 * Shared logic for the `resolve-type` CLI and the `tests/types/resolveExport`
 * helper. Pack the target package, install into a staged project, then talk
 * to the native TypeScript 7 language server (the Go-based `tsc` shipped as
 * `typescript@7.0.2`) over stdio JSON-RPC to resolve symbols to their
 * hover-displayed types.
 *
 * **Hybrid backend**: this script uses TWO TypeScript versions:
 *
 *   - `@typescript/typescript6` (in-process) for the parts that don't justify
 *     an LSP round-trip: AST walks of the host file (`findImportPositions`),
 *     tsconfig parsing (`loadTsconfig`), and `listExports`'s free-form
 *     `createProgram + getExportsOfModule` on a `.d.ts`.
 *   - `typescript@7.0.2` (out-of-process) **only** for `textDocument/hover`,
 *     via the native binary's LSP mode (`tsc --lsp --stdio`).
 *
 * **Tarball caching**: a git fingerprint (HEAD hash + working-tree state) is
 * stored next to the tarball. The tarball is rebuilt only when tracked
 * content changes since the last build — including switching between
 * different uncommitted change sets.
 */

import ts from '@typescript/typescript6'
import path from 'node:path'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { spawn, type ChildProcess } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath, pathToFileURL } from 'node:url'
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

export type ResolvedPackage = {
  packageName: string
  packageRoot: string
  tarball: string
}

export const resolvePackageRoot = (importPath: string): string | null => {
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

// ───────────────────────────────────────────────────────────────────────────
// Native `tsc` LSP backend
// ───────────────────────────────────────────────────────────────────────────

/**
 * Resolve the absolute path to the native `tsc` binary shipped by
 * `typescript@7.0.2`. The JS wrapper at `node_modules/.bin/tsc` is the
 * OLDER pre-Go shim — we want the actual Go binary so `tsc --lsp --stdio`
 * speaks the modern LSP we need.
 *
 * Per-platform package mapping mirrors `node_modules/typescript/lib/getExePath.js`.
 * Linux-only for now; expand the map when a Windows/macOS consumer needs this.
 */
const resolveTscBinary = (): string => {
  const platformPkg = (() => {
    if (process.platform === 'linux' && process.arch === 'x64') {
      return '@typescript/typescript-linux-x64'
    }
    if (process.platform === 'linux' && process.arch === 'arm64') {
      return '@typescript/typescript-linux-arm64'
    }
    if (process.platform === 'darwin' && process.arch === 'x64') {
      return '@typescript/typescript-darwin-x64'
    }
    if (process.platform === 'darwin' && process.arch === 'arm64') {
      return '@typescript/typescript-darwin-arm64'
    }
    if (process.platform === 'win32' && process.arch === 'x64') {
      return '@typescript/typescript-win32-x64'
    }
    return null
  })()
  if (!platformPkg) {
    throw new Error(
      `No native TypeScript 7 binary mapped for ${process.platform}/${process.arch}. ` +
        `Edit resolveTscBinary() in scripts/resolve-type-lib.ts to add it.`,
    )
  }
  // Resolve from the installed `typescript` package's node_modules. Falls
  // through to throwing if the platform optional dep isn't installed.
  const require = createRequire(import.meta.url)
  let pkgJsonPath: string
  try {
    pkgJsonPath = require.resolve(`${platformPkg}/package.json`)
  } catch {
    throw new Error(
      `Cannot resolve ${platformPkg} — is the typescript optional dep installed? ` +
        `Re-run "bun install" inside the sandstone workspace.`,
    )
  }
  const libDir = path.join(path.dirname(pkgJsonPath), 'lib')
  const binName = process.platform === 'win32' ? 'tsc.exe' : 'tsc'
  const exe = path.join(libDir, binName)
  if (!fs.existsSync(exe)) {
    throw new Error(`Native tsc binary not found at ${exe}`)
  }
  return exe
}

// ── LSP client (stdio JSON-RPC over `tsc --lsp --stdio`) ────────────────

type PendingRequest = {
  resolve: (value: any) => void
  reject: (err: Error) => void
}

class LspClient {
  private proc: ChildProcess | null = null
  private nextId = 1
  private pending = new Map<number, PendingRequest>()
  private inbound = Buffer.alloc(0)
  /** Server-to-client notifications (no id). */
  public onNotification: ((method: string, params: any) => void) | null = null
  /** Server-to-client requests (have id and need a response). */
  public onRequest:
    | ((method: string, params: any) => Promise<any> | any)
    | null = null

  constructor(private readonly binPath: string) {}

  start(): void {
    this.proc = spawn(this.binPath, ['--lsp', '--stdio'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    })
    this.proc.stdout?.on('data', (chunk: Buffer) => this.handleData(chunk))
    this.proc.stderr?.on('data', (chunk: Buffer) => {
      // The native server logs diagnostics to stderr; surface them in debug
      // mode only. Suppressed by default to keep CLI output clean.
      if (process.env.RESOLVE_TYPE_LSP_DEBUG) {
        process.stderr.write(`[tsc] ${chunk.toString('utf8')}`)
      }
    })
    this.proc.on('exit', (code, signal) => {
      const err = new Error(
        `tsc --lsp --stdio exited (code=${code}, signal=${signal})`,
      )
      for (const { reject } of this.pending.values()) reject(err)
      this.pending.clear()
      this.proc = null
    })
  }

  private handleData(chunk: Buffer): void {
    this.inbound = Buffer.concat([this.inbound, chunk])
    // LSP framing: `Content-Length: N\r\n\r\n<body>`. Loop until we run
    // out of complete frames.
    while (true) {
      const headerEnd = this.inbound.indexOf('\r\n\r\n')
      if (headerEnd === -1) return
      const header = this.inbound.toString('utf8', 0, headerEnd)
      const m = /Content-Length:\s*(\d+)/i.exec(header)
      if (!m) {
        // Malformed frame — drop the garbage header and try again. If the
        // server is misbehaving we'd loop; cap with a sanity bound.
        this.inbound = this.inbound.subarray(headerEnd + 4)
        if (this.inbound.length > 1 << 20) {
          throw new Error('LSP frame header too long; aborting')
        }
        continue
      }
      const length = Number(m[1])
      const bodyStart = headerEnd + 4
      if (this.inbound.length < bodyStart + length) return
      // `toString(encoding, start, end)` copies into a fresh string — no
      // need to slice the buffer (which would alias into this.inbound's
      // upcoming reassignment).
      const body = this.inbound.toString('utf8', bodyStart, bodyStart + length)
      this.inbound = this.inbound.subarray(bodyStart + length)
      let msg: any
      try {
        msg = JSON.parse(body)
      } catch {
        continue
      }
      this.dispatch(msg)
    }
  }

  private dispatch(msg: any): void {
    // Response to one of our requests.
    if (typeof msg.id === 'number' && (msg.result !== undefined || msg.error !== undefined)) {
      const pending = this.pending.get(msg.id)
      if (!pending) return
      this.pending.delete(msg.id)
      if (msg.error) {
        const err = new Error(
          typeof msg.error.message === 'string'
            ? msg.error.message
            : JSON.stringify(msg.error),
        )
        ;(err as any).code = msg.error.code
        pending.reject(err)
      } else {
        pending.resolve(msg.result)
      }
      return
    }
    // Server-initiated request (has id, has method) — needs a response.
    if (typeof msg.method === 'string' && msg.id !== undefined) {
      const reply = (result: any) => {
        this.send({ jsonrpc: '2.0', id: msg.id, result })
      }
      const fail = (code: number, message: string) => {
        this.send({ jsonrpc: '2.0', id: msg.id, error: { code, message } })
      }
      if (!this.onRequest) {
        fail(-32601, `Method not found: ${msg.method}`)
        return
      }
      Promise.resolve()
        .then(() => this.onRequest!(msg.method, msg.params))
        .then(reply, (e) => fail(-32603, e instanceof Error ? e.message : String(e)))
      return
    }
    // Server-initiated notification (no id).
    if (typeof msg.method === 'string') {
      this.onNotification?.(msg.method, msg.params)
    }
  }

  private send(msg: any): void {
    const stdin = this.proc?.stdin
    if (!stdin) throw new Error('LSP process stdin closed')
    const body = JSON.stringify(msg)
    const header = `Content-Length: ${Buffer.byteLength(body, 'utf8')}\r\n\r\n`
    stdin.write(header)
    stdin.write(body)
  }

  request<T = any>(method: string, params?: any): Promise<T> {
    if (!this.proc) throw new Error('LSP not started')
    const id = this.nextId++
    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this.send({ jsonrpc: '2.0', id, method, params })
    })
  }

  notify(method: string, params?: any): void {
    if (!this.proc) return
    this.send({ jsonrpc: '2.0', method, params })
  }

  async stop(): Promise<void> {
    const proc = this.proc
    if (!proc) return
    try {
      this.notify('shutdown')
      // Small grace period for the server to flush.
      await new Promise((r) => setTimeout(r, 50))
      this.notify('exit')
    } catch {
      // stdin may already be closed; ignore.
    }
    if (proc.exitCode === null && !proc.killed) {
      // Escalate quickly: SIGTERM, then SIGKILL after a short wait. The
      // CLI relies on dispose() freeing the event loop — a graceful
      // SIGTERM that the server ignores would hang the script.
      try {
        proc.kill('SIGTERM')
      } catch {}
      await new Promise<void>((r) => {
        const t = setTimeout(() => {
          try {
            proc.kill('SIGKILL')
          } catch {}
          r()
        }, 200)
        proc.once('exit', () => {
          clearTimeout(t)
          r()
        })
      })
    }
    this.proc = null
  }
}

// ── LSP session (one per HoverEnv) ───────────────────────────────────────

type HoverResult = { contents: string; range?: unknown }

export type DefinitionResult = {
  file: string
  line: number
  character: number
}

/**
 * Normalize a raw LSP definition location for snapshot stability.
 *
 * The result always points at a path **relative to REPO_ROOT** so the
 * snapshot is portable across machines — same value on a CI runner as
 * on a developer's laptop, regardless of where the worktree lives.
 *
 * Two source paths get normalized:
 *   1. Staged tarball paths under `.temp/projects/<pkg>/node_modules/<pkg>/`
 *      → strip both `<staged>/node_modules/<pkg>/` and the leading
 *      `<pkg>/` segment so we get `<repo-relative>` (e.g. `src/foo.ts`).
 *   2. Absolute paths under `<REPO_ROOT>/` → strip the REPO_ROOT prefix.
 */
const normalizeDefinition = (
  uri: string,
  line: number,
  character: number,
): DefinitionResult => {
  let file = fileURLToPath(uri)
  // 1. Staged tarball path. Strip `<staged>/node_modules/<pkg>/`. What
  //    remains is the path inside the package, which equals the path
  //    inside REPO_ROOT (the repo IS the package).
  const stagedPrefix =
    /^\/.*\/\.temp\/projects\/[^/]+\/node_modules\/[^/]+\//.exec(file)
  if (stagedPrefix) {
    file = file.slice(stagedPrefix[0].length)
  }
  // 2. Strip REPO_ROOT prefix. Leaves a path relative to the repo root,
  //    matching the layout other contributors and CI see.
  if (file.startsWith(REPO_ROOT + '/')) {
    file = file.slice(REPO_ROOT.length + 1)
  } else if (file === REPO_ROOT) {
    file = ''
  }
  return { file, line, character }
}

class LspSession {
  private readonly client: LspClient
  private ready: Promise<void>
  private fileVersions = new Map<string, number>()

  constructor(binPath: string, private readonly projectDir: string) {
    this.client = new LspClient(binPath)
    this.ready = this.initialize()
    process.once('exit', () => {
      // Best-effort cleanup. Don't await — `exit` doesn't wait for async.
      try {
        this.client['proc']?.kill('SIGTERM')
      } catch {}
    })
  }

  private async initialize(): Promise<void> {
    this.client.start()
    const rootUri = pathToFileUrl(this.projectDir)
    const result = await this.client.request<any>('initialize', {
      processId: process.pid,
      clientInfo: { name: 'sandstone-resolve-type', version: '0.1.0' },
      rootUri,
      capabilities: {
        workspace: {
          // Don't enable `workspace/configuration` — we won't handle that
          // server-to-client request. tsgo is happy with a tsconfig.json
          // it finds under rootUri, which our staging already drops in.
          configuration: false,
          workspaceFolders: true,
        },
        textDocument: {
          synchronization: {
            didSave: true,
            willSave: false,
            dynamicRegistration: false,
            willSaveWaitUntil: false,
          },
          hover: {
            contentFormat: ['markdown', 'plaintext'],
          },
          publishDiagnostics: {
            relatedInformation: true,
          },
        },
        window: { workDoneProgress: false },
      },
      initializationOptions: {
        typescript: {
          // Point tsgo at the bundled lib/ dir for `lib.d.ts`. Same dir the
          // binary lives in.
          tsdk: path.dirname(resolveTscBinary()),
        },
      },
      workspaceFolders: [
        { uri: rootUri, name: path.basename(this.projectDir) },
      ],
    })
    // `initialize` response carries serverCapabilities. We don't currently
    // need anything from it, but keep the variable to make it explicit that
    // we wait for the response before sending `initialized`.
    void result
    this.client.notify('initialized', {})
  }

  async openFile(filePath: string, text: string): Promise<void> {
    await this.ready
    const version = 1
    this.fileVersions.set(filePath, version)
    this.client.notify('textDocument/didOpen', {
      textDocument: {
        uri: pathToFileUrl(filePath),
        languageId: filePath.endsWith('.tsx') ? 'typescriptreact' : 'typescript',
        version,
        text,
      },
    })
  }

  async changeFile(filePath: string, text: string): Promise<void> {
    await this.ready
    const version = (this.fileVersions.get(filePath) ?? 0) + 1
    this.fileVersions.set(filePath, version)
    this.client.notify('textDocument/didChange', {
      textDocument: { uri: pathToFileUrl(filePath), version },
      contentChanges: [{ text }],
    })
  }

  async hover(filePath: string, line: number, character: number): Promise<HoverResult | null> {
    await this.ready
    const result = await this.client.request<any>('textDocument/hover', {
      textDocument: { uri: pathToFileUrl(filePath) },
      position: { line, character },
    })
    if (!result || result.contents === undefined || result.contents === null) {
      return null
    }
    let contents: string
    if (typeof result.contents === 'string') {
      contents = result.contents
    } else if (Array.isArray(result.contents)) {
      contents = result.contents
        .map((c: any) => (typeof c === 'string' ? c : c?.value ?? ''))
        .join('\n')
    } else if (typeof result.contents === 'object') {
      contents = result.contents.value ?? ''
    } else {
      contents = ''
    }
    return { contents, range: result.range }
  }

  /**
   * LSP `textDocument/definition`. Returns the first resolved location
   * (the LSP spec returns `Location | Location[] | null`; we flatten to
   * a single result for snapshot stability — if the server returns
   * multiple overloads, we record only the first). Returns `null` when
   * the server has no resolution (e.g. the symbol is a runtime primitive).
   */
  async definition(
    filePath: string,
    line: number,
    character: number,
  ): Promise<DefinitionResult | null> {
    await this.ready
    const result = await this.client.request<any>('textDocument/definition', {
      textDocument: { uri: pathToFileUrl(filePath) },
      position: { line, character },
    })
    if (!result) return null
    const raw = Array.isArray(result) ? result[0] : result
    if (!raw || typeof raw !== 'object' || !raw.uri || !raw.range) return null
    return normalizeDefinition(raw.uri, raw.range.start.line, raw.range.start.character)
  }

  async dispose(): Promise<void> {
    await this.client.stop()
  }
}

/**
 * Convert an absolute filesystem path to a `file://` URL.
 */
const pathToFileUrl = (p: string): string => pathToFileURL(p).href

// ── Stage 2: tree-sitter tokenization of the markdown hover blob ────────

/**
 * Cache directory for the auto-fetched tree-sitter typescript grammar +
 * highlights query. Lives under the existing `.temp/` (gitignored) so a
 * fresh first-run download is the only network hit per checkout.
 *
 * Mirrors `summit_2026_booth/src/sections/presentation/jsx/grammar-fetcher.ts`,
 * minus the mcfunction grammar (we don't render .mcfunction here) and the
 * VS Code Dark Modern theme (we only need capture names, not colors).
 */
const TS_GRAMMAR_DIR = path.join(TEMP_DIR, 'tree-sitter-typescript')
const TS_WASM = path.join(TS_GRAMMAR_DIR, 'tree-sitter-typescript.wasm')
const TS_QUERY = path.join(TS_GRAMMAR_DIR, 'typescript.highlights.scm')

const TS_WASM_URL =
  'https://github.com/tree-sitter/tree-sitter-typescript/releases/latest/download/tree-sitter-typescript.wasm'
const TS_QUERY_URLS = [
  // JS base (for `const`, `import`, strings, comments, …).
  'https://raw.githubusercontent.com/tree-sitter/tree-sitter-javascript/master/queries/highlights.scm',
  // TS-specific overrides. Concatenated LAST so its patterns override the
  // JS ones when both match (query system picks the first match; ordering
  // matters — more-specific → less-specific).
  'https://raw.githubusercontent.com/tree-sitter/tree-sitter-typescript/master/queries/highlights.scm',
]

const ghFetchText = async (url: string): Promise<string> => {
  // Mirror the booth's gh-first / raw-fallback strategy. `gh api` returns
  // base64-encoded content for the GitHub Contents API.
  const tail = url.slice('https://raw.githubusercontent.com/'.length)
  const [owner, repo, ref, ...rest] = tail.split('/')
  const apiPath = `repos/${owner}/${repo}/contents/${rest.join('/')}?ref=${ref}`
  try {
    const body = (
      await $`gh api ${apiPath} --jq .content`.text()
    ).trim()
    return Buffer.from(body, 'base64').toString('utf8')
  } catch (err) {
    if (process.env.RESOLVE_TYPE_LSP_DEBUG) {
      console.warn(
        `[tree-sitter] gh fetch failed (${err instanceof Error ? err.message : err}); falling back to raw URL`,
      )
    }
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`)
    return await res.text()
  }
}

const ensureTsGrammar = async (): Promise<void> => {
  fs.mkdirSync(TS_GRAMMAR_DIR, { recursive: true })
  if (!fs.existsSync(TS_WASM)) {
    const res = await fetch(TS_WASM_URL)
    if (!res.ok) {
      throw new Error(
        `HTTP ${res.status} downloading tree-sitter-typescript.wasm`,
      )
    }
    fs.writeFileSync(TS_WASM, Buffer.from(await res.arrayBuffer()))
  }
  if (!fs.existsSync(TS_QUERY)) {
    const parts: string[] = []
    for (const u of TS_QUERY_URLS) parts.push(await ghFetchText(u))
    fs.writeFileSync(TS_QUERY, parts.join('\n\n'))
  }
}

/**
 * Per-category priority. Lower wins. Mirrors the booth's `CATEGORY_ORDER`
 * (no colors needed — we only care about which capture name wins, not what
 * hex to paint). Promoted captures (`*.special`, `*.escape`, …) get a
 * guaranteed-low number so they beat generic siblings on the same range.
 */
const CATEGORY_ORDER = [
  'comment',
  'string',
  'function',
  'type',
  'preproc',
  'constant',
  'boolean',
  'number',
  'keyword',
  'tag',
  'embedded',
  'variable',
  'attribute',
  'property',
  'constructor',
  'punctuation',
  'operator',
  'emphasis',
] as const

const PROMOTED: ReadonlySet<string> = new Set([
  'string.escape',
  'string.regex',
  'string.special',
  'punctuation.special',
  'constant.character.escape',
])
const PROMOTED_PRIORITY = -1

const priorityOf = (name: string): number => {
  if (PROMOTED.has(name)) return PROMOTED_PRIORITY
  const parts = name.split('.')
  const cat = parts[0] as (typeof CATEGORY_ORDER)[number]
  const idx = CATEGORY_ORDER.indexOf(cat)
  return (idx === -1 ? CATEGORY_ORDER.length : idx) * 100 - parts.length
}

/**
 * Tokenize a markdown-stripped TS snippet into per-segment `{text, kind}`
 * entries. Process-global: one Language, one Query, one Parser, one
 * per-snippet memo cache shared across every HoverEnv in this process.
 *
 * The kind is the top-level category — capture names like
 * `keyword.control.flow` collapse to `kind: "keyword"` so the output
 * stays usable for the `any`-detection scanner without exposing the
 * booth's full SCOPE_PRIORITY hierarchy.
 *
 * Returns `null` on init failure (wasm missing, network down on first
 * run, etc.). Callers fall back to a single `{text, kind: "string"}`
 * entry in that case.
 */
type TokenSegment = { text: string; kind: string }

let initPromise: Promise<boolean> | null = null
let sharedLang: import('web-tree-sitter').Language | null = null
let sharedQuery: import('web-tree-sitter').Query | null = null
let sharedParser: import('web-tree-sitter').Parser | null = null
const tokenCache = new Map<string, TokenSegment[] | null>()

const ensureTsTokenizerReady = async (): Promise<boolean> => {
  if (sharedLang && sharedQuery && sharedParser) return true
  if (!initPromise) {
    initPromise = (async () => {
      try {
        await ensureTsGrammar()
        const ts = await import('web-tree-sitter')
        await ts.Parser.init()
        const wasmBytes = await Bun.file(TS_WASM).arrayBuffer()
        const lang = await ts.Language.load(new Uint8Array(wasmBytes))
        const queryText = await Bun.file(TS_QUERY).text()
        const parser = new ts.Parser()
        parser.setLanguage(lang)
        sharedLang = lang
        sharedQuery = new ts.Query(lang, queryText)
        sharedParser = parser
        return true
      } catch (err) {
        if (process.env.RESOLVE_TYPE_LSP_DEBUG) {
          console.warn(
            `[tree-sitter] init failed; parts will be single-entry: ${err}`,
          )
        }
        // Reset so a later call retries instead of caching the failure.
        initPromise = null
        return false
      }
    })()
  }
  return initPromise
}

export const tokenizeHover = async (source: string): Promise<TokenSegment[] | null> => {
  const cached = tokenCache.get(source)
  if (cached !== undefined) return cached
  if (!(await ensureTsTokenizerReady())) {
    tokenCache.set(source, null)
    return null
  }
  const tree = sharedParser!.parse(source)
  if (!tree) {
    tokenCache.set(source, null)
    return null
  }
  try {
    const rawCaptures = sharedQuery!.captures(tree.rootNode)
    // Tag sweep: collapse overlapping captures to one per character,
    // picking the lowest-priority (most-specific) capture at each point.
    type Tag = { start: number; end: number; priority: number; kind: string }
    const tags: Tag[] = []
    for (const cap of rawCaptures) {
      const start = cap.node.startIndex
      const end = cap.node.endIndex
      if (start === end) continue
      const cat = cap.name.split('.')[0]
      tags.push({ start, end, priority: priorityOf(cap.name), kind: cat })
    }
    const segments = sweepToSegments(source, tags)
    tokenCache.set(source, segments)
    return segments
  } finally {
    tree.delete()
  }
}

/**
 * Tag sweep — sorts by start, walks left-to-right, picks the winning tag
 * at each character via the same priority/length tiebreaker as the booth's
 * `Tokenizer.collapseToSegments`. Identical algorithm, different output
 * shape (no color, just kind).
 */
const sweepToSegments = (
  source: string,
  tags: { start: number; end: number; priority: number; kind: string }[],
): { text: string; kind: string }[] => {
  if (source.length === 0) return []
  tags.sort((a, b) => a.start - b.start || b.end - a.end)
  const out: { text: string; kind: string }[] = []
  let cursor = 0
  let tagIdx = 0
  const active: typeof tags = []

  while (tagIdx < tags.length && tags[tagIdx].start <= cursor) {
    if (tags[tagIdx].end > cursor) active.push(tags[tagIdx])
    tagIdx++
  }

  const push = (text: string, kind: string | undefined) => {
    if (!text) return
    const last = out[out.length - 1]
    if (last && last.kind === kind) {
      last.text += text
      return
    }
    out.push({ text, kind: kind ?? 'text' })
  }

  while (cursor < source.length) {
    let nextEnd = tagIdx < tags.length ? tags[tagIdx].start : source.length
    for (const t of active) if (t.end < nextEnd) nextEnd = t.end
    if (nextEnd > source.length) nextEnd = source.length
    // Winner = lowest priority, ties broken by longest range.
    let winner: typeof tags[number] | undefined
    for (const t of active) {
      if (
        !winner ||
        t.priority < winner.priority ||
        (t.priority === winner.priority && t.end - t.start > winner.end - winner.start)
      ) {
        winner = t
      }
    }
    push(source.slice(cursor, nextEnd), winner?.kind)
    cursor = nextEnd
    if (cursor >= source.length) break
    for (let i = active.length - 1; i >= 0; i--) {
      if (active[i].end <= cursor) active.splice(i, 1)
    }
    while (tagIdx < tags.length && tags[tagIdx].start <= cursor) {
      if (tags[tagIdx].end > cursor) active.push(tags[tagIdx])
      tagIdx++
    }
  }
  return out
}

/**
 * Returns the entries from a `parts` array that represent an `any` type
 * keyword. Tree-sitter-typescript captures `any` as
 * `(predefined_type) @type.builtin` — our sweep collapses `.builtin` to
 * `kind: "type"`. We also accept `kind: "keyword"` for the rare cases
 * where a capture names it as a keyword instead.
 *
 * Equivalent to the old `SyntaxKind.AnyKeyword` numeric check that
 * `scripts/no-any-exports.ts` used to do on displayParts (deleted; the
 * same check now lives here + in `tests/types/signatures.test.ts`).
 * `unknown` is a separate `SyntaxKind.UnknownKeyword`; the old scanner
 * only flagged `any`.
 */
export const findAnyKeywords = (
  parts: { text: string; kind: string }[],
): { text: string; kind: string }[] => {
  return parts.filter(
    (p) => (p.kind === 'type' || p.kind === 'keyword') && p.text === 'any',
  )
}

/**
 * Decide whether a tokenized hover constitutes an `any`-keyword offender.
 *
 * Filters out two false-positive patterns:
 *
 *   1. The token isn't really a type keyword — handled upstream by
 *      `findAnyKeywords` (caller checks for emptiness).
 *   2. The `any` sits inside a template-literal span of the form
 *      `\`${any}${string}\``, which is the intentional escape-hatch
 *      pattern in `LiteralUnion` / `Label` / `NBTAllNumbers`-style types —
 *      `any` here lets TS accept any string prefix while `${string}`
 *      constrains the rest. Don't flag it.
 *
 * Detection of (2): tree-sitter-typescript emits the closing `}` of the
 * first `${any}` as its own `kind: "punctuation"` segment, followed by
 * a text segment containing `${`, then `string`. Match ONLY when BOTH
 * hold within a short window:
 *   - a `}` punctuation shows up within 2 parts after `any`
 *   - a `string` type/keyword follows within 5 parts after that `}`
 *
 * The bounded window prevents matching coincidental `string`s from later
 * overload parameters (e.g. `DataVariable`'s `name?: string`).
 */
export const isAnyOffender = (
  parts: { text: string; kind: string }[],
): boolean => {
  const matches = findAnyKeywords(parts)
  if (matches.length === 0) return false
  for (const m of matches) {
    if (m.text !== 'any') continue
    const i = parts.indexOf(m)
    if (i === -1) continue
    const closeIdx = parts
      .slice(i + 1, i + 3)
      .findIndex((q) => q.kind === 'punctuation' && q.text === '}')
    if (closeIdx === -1) continue
    const closeAbs = i + 1 + closeIdx
    for (let j = closeAbs + 1; j < Math.min(closeAbs + 6, parts.length); j++) {
      const q = parts[j]
      if (
        (q.kind === 'type' || q.kind === 'keyword') &&
        q.text.trim() === 'string'
      ) {
        return false
      }
    }
  }
  return true
}

// ── Host file helpers (AST walk via typescript6) ────────────────────────

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

const findImportPositions = (
  sf: ts.SourceFile,
  exportName: string,
  importPath: string,
): { valuePos: number | null; typePos: number | null } => {
  let valuePos: number | null = null
  let typePos: number | null = null
  const targetImport = importPath.replace(/^['"]|['"]$/g, '')
  for (const stmt of sf.statements) {
    if (!ts.isImportDeclaration(stmt)) continue
    if (stmt.moduleSpecifier.getText().replace(/^['"]|['"]$/g, '') !== targetImport) continue
    const stmtIsTypeOnly = (stmt as { isTypeOnly?: boolean }).isTypeOnly
    const clauseIsTypeOnly =
      (stmt.importClause as { isTypeOnly?: boolean } | undefined)?.isTypeOnly
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
 * Strip a markdown-fenced code block down to the bare TS source.
 * Handles `` ```ts ``, `` ```typescript ``, and bare `` ``` `` fences.
 * If the markdown has no fence, return as-is (best-effort).
 */
export const stripMarkdownFences = (md: string): string => {
  // The first matching fenced block wins; everything outside is dropped
  // (LSP hover responses are usually a single block, but be tolerant).
  const fenceRe = /```(?:ts|typescript|tsx|javascript|js)?\s*\n([\s\S]*?)\n```/
  const m = fenceRe.exec(md)
  if (m) return m[1]
  // Fallback: trim leading/trailing backtick lines.
  const trimmed = md.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```\s*$/, '')
  return trimmed
}

// ── HoverEnv (one per (resolved-package, tsconfigPath) pair) ────────────

export type HoverEnv = {
  /** The active LSP session. Replaces the old `ts.LanguageService`. */
  session: LspSession
  projectDir: string
  /**
   * Resolve a named import to its hover-displayed type string. Each call
   * rewrites the host file with ONLY the current symbol so the LS sees a
   * fresh import surface (avoids TS collapsing complex types to `any`
   * after many calls in one process).
   */
  resolve: (importPath: string, name: string) => Promise<string>
  /**
   * Combined hover + optional definition call. Pass
   * `{ includeDefinition: true }` to also fetch the declaration site via
   * LSP `textDocument/definition`. Definition requests run in parallel
   * with the hover so opt-in adds ~one parallel round-trip, not a serial
   * one. Default (no options) skips the definition entirely.
   */
  describe: (
    importPath: string,
    name: string,
    options?: { includeDefinition?: boolean },
  ) => Promise<{
    signature: string
    contents: string
    definition?: DefinitionResult | null
  }>
  /**
   * Stage-1 shape: returns the entire hover blob as one entry. Stage 2
   * (planned) will split this into per-token `{text, kind}` entries via
   * tree-sitter.
   */
  parts: (
    importPath: string,
    name: string,
  ) => Promise<{ text: string; kind: string }[]>
}

/**
 * Boot (or reuse) an LSP-backed hover env for the given package + tsconfig.
 * Memoized per-process across calls (one tsc subprocess per process).
 */
export const getHoverEnv = async (options: {
  resolved: ResolvedPackage
  tsconfigPath: string
}): Promise<HoverEnv> => {
  const { resolved, tsconfigPath } = options
  const { packageName, tarball } = resolved

  const projectDir = path.join(PROJECTS_DIR, packageName)
  const useDefault = tsconfigPath === DEFAULT_TSCONFIG || tsconfigPath === '__default__'
  const tsconfigOptions = useDefault
    ? DEFAULT_TSCONFIG_OBJECT
    : loadTsconfig(tsconfigPath)

  // Rebuild the staged project if it's missing — package was just built, or
  // first call in this process.
  if (!fs.existsSync(path.join(projectDir, 'node_modules', packageName))) {
    if (fs.existsSync(projectDir)) fs.rmSync(projectDir, { recursive: true, force: true })
    await installPackage(projectDir, packageName, tarball)
    if (!useDefault) {
      stageTemplate(path.dirname(tsconfigPath), projectDir, tsconfigOptions)
    }
    const stagedTsconfig = path.join(projectDir, 'tsconfig.json')
    if (!fs.existsSync(stagedTsconfig)) {
      fs.writeFileSync(stagedTsconfig, JSON.stringify(tsconfigOptions, null, 2))
    }
  }

  const hostFile = path.join(projectDir, 'src', '__hover_host__.ts')

  // Boot one LSP subprocess per process. The session reads tsconfig.json
  // off disk in `projectDir` — staging already put one there.
  const tscBin = resolveTscBinary()
  const session = new LspSession(tscBin, projectDir)

  let opened = false
  // Open/change the host file with the current symbol's import. Idempotent
  // — first call sends didOpen, subsequent calls send didChange.
  const ensureHostOpen = async (
    importPath: string,
    name: string,
  ): Promise<void> => {
    const source = buildHostSource([{ importPath, name }])
    if (!opened) {
      await session.openFile(hostFile, source)
      opened = true
    } else {
      await session.changeFile(hostFile, source)
    }
  }

  // Find the (line, character) of the imported name in the host file via
  // a typescript6 AST walk. Cheap, in-process; LSP doesn't expose this
  // without documentSymbol.
  const resolvePosition = async (
    importPath: string,
    name: string,
  ): Promise<{ line: number; character: number; isValueImport: boolean }> => {
    const source = buildHostSource([{ importPath, name }])
    const sf = ts.createSourceFile(
      hostFile,
      source,
      ts.ScriptTarget.Latest,
      true,
    )
    const { valuePos, typePos } = findImportPositions(sf, name, importPath)
    if (valuePos === null && typePos === null) {
      throw new Error(`Could not locate import for "${name}" from ${importPath}`)
    }
    const pos = valuePos ?? typePos!
    const { line, character } = sf.getLineAndCharacterOfPosition(pos)
    return { line, character, isValueImport: valuePos !== null }
  }

  // Format a raw hover response into the cleaned-up signature string the
  // old API exposed: drop the trailing `import <name>` line TS LS appends,
  // unwrap the `import type { Foo as FooType }` alias when needed.
  const formatHover = (
    contents: string,
    name: string,
    isValueImport: boolean,
  ): string => {
    const lines = contents.split('\n')
    if (
      lines.length > 1 &&
      lines[lines.length - 1].trim() === `import ${name}`
    ) {
      lines.pop()
    }
    const stripped = lines.join('\n')
    return isValueImport
      ? stripped
      : stripped.replace(new RegExp(`\\b${name}Type\\b`, 'g'), name)
  }

  /**
   * Single combined call: returns the hover signature, and optionally the
   * LSP `textDocument/definition` location for an export. When the
   * definition is requested, the hover + definition requests fire in
   * parallel against the same LSP session after a single host-file
   * open/change, so the cost is one round-trip + one parallel round-trip
   * rather than three serial ones.
   *
   * The definition is only fetched when the caller passes
   * `includeDefinition: true`. The default `resolve` path skips it
   * entirely — most callers don't care, and `textDocument/definition`
   * is an extra LSP round-trip we'd rather not pay by default.
   */
  const describe = async (
    importPath: string,
    name: string,
    options: { includeDefinition?: boolean } = {},
  ): Promise<{
    signature: string
    contents: string
    /** `undefined` when `includeDefinition` was not requested; `null` when it was but the server has no resolution. */
    definition?: DefinitionResult | null
  }> => {
    await ensureHostOpen(importPath, name)
    const { line, character, isValueImport } = await resolvePosition(
      importPath,
      name,
    )
    const hoverP = session.hover(hostFile, line, character)
    const defP = options.includeDefinition
      ? session.definition(hostFile, line, character)
      : undefined
    const hoverResult = await hoverP
    if (!hoverResult?.contents) {
      throw new Error(`No hover info for "${name}" from ${importPath}`)
    }
    return {
      contents: hoverResult.contents,
      signature: formatHover(hoverResult.contents, name, isValueImport),
      definition: defP ? await defP : undefined,
    }
  }

  const resolve = async (importPath: string, name: string): Promise<string> =>
    (await describe(importPath, name)).signature

  const parts = async (
    importPath: string,
    name: string,
  ): Promise<{ text: string; kind: string }[]> => {
    const { contents } = await describe(importPath, name)
    const stripped = stripMarkdownFences(contents).trim()
    // Stage 2: re-tokenize the markdown-stripped TS snippet via
    // web-tree-sitter-typescript to recover per-token kinds. The
    // Language/Query/Parser are process-global — no per-env setup.
    // Falls back to a single `kind: "string"` entry when the grammar
    // fails to load — findAnyKeywords will then return nothing, the
    // safe default.
    const segmented = await tokenizeHover(stripped)
    if (!segmented || segmented.length === 0) {
      return [{ text: stripped, kind: 'string' }]
    }
    return segmented
  }

  return { session, projectDir, resolve, parts, describe }
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
