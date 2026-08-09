import { expect } from 'bun:test'
import { createSandstonePack } from '../../dist/exports/index.js'

export type CompileOptions = {
  /**
   * Distinct prefix for auto-generated storage paths. Should be an 8-char
   * alphanumeric id matching what the CLI generates via `nanoid(8)` —
   * see `sandstone-cli/src/commands/create.ts:392`. Each test file should
   * pass a stable id so snapshots stay deterministic across runs.
   */
  packUid?: string
  /** Pack description. Defaults to `flow snapshot tests`. */
  description?: string
}

/**
 * Compile a single MCFunction and return every resource produced by the
 * visitor pipeline as `Map<relativePath, string>`.
 *
 * Uses `pack.compile()` — the public helper that runs the same visitor
 * pipeline as a real `pack.save()`, but returns a `Map<path, string>`
 * instead of writing to disk. This is the canonical way to inspect
 * Sandstone's output in tests.
 *
 * `pack.compile()` recreates what `pack.MCFunction` does: the callback
 * runs inside a real MCFunction context, with `currentMCFunction` set
 * and command emissions routed into the new function's body.
 */
export const compile = (
  name: string,
  callback: (pack: ReturnType<typeof createSandstonePack>) => void,
  options: CompileOptions = {},
): Map<string, string> => {
  const pack = createSandstonePack({
    workingDir: process.cwd(),
    namespace: 'test',
    packUid: options.packUid ?? 'kZZpDK67',
    packOptions: {
      datapack: {
        packFormat: 80,
        description: options.description ?? 'flow snapshot tests',
      },
    },
  })

  return pack.compile(name, () => callback(pack))
}

/** Snapshot every resource produced for a given test, sorted by path. */
export const snapshotAll = (out: Map<string, string>) => {
  const all = [...out.entries()].sort(([a], [b]) => a.localeCompare(b))
  expect(all).toMatchSnapshot()
}

/** Return the .mcfunction body for the given function name, or empty string. */
export const mcfunctionBody = (out: Map<string, string>, fnName: string): string => {
  for (const [path, content] of out.entries()) {
    if (path === `datapack/data/test/function/${fnName}.mcfunction`) {
      return content
    }
  }
  return ''
}

/**
 * Run `fn` with a debug env var set and `console.log` intercepted,
 * returning the captured lines whose first argument starts with `prefix`,
 * together with `fn`'s return value.
 *
 * The visitor reads the env var once at construction, so this must wrap
 * the *whole* call to `compile()` / `pack.compile()` — setting the env
 * after the visitor already exists has no effect.
 *
 * Lines that don't match `prefix` pass through to the original
 * `console.log`, so unrelated output from `fn` (or Bun's test runner)
 * still surfaces normally.
 *
 * Restores both the env var and `console.log` even if `fn` throws.
 *
 * @param envVar  Name of the env var the target visitor checks
 *                (e.g. `'SANDSTONE_DEBUG_SIMPLIFY_EXEC'`).
 *                Set to `'1'` for the duration of `fn`.
 * @param prefix  Only `console.log` calls whose joined message starts
 *                with this string are captured. Match against the same
 *                prefix the visitor uses in its log lines.
 *
 * Usage:
 *   const { result, logs } = withDebugLogs({
 *     envVar: 'SANDSTONE_DEBUG_SIMPLIFY_EXEC',
 *     prefix: '[SimplifyExec:',
 *     fn: () => {
 *       const out = compile('foo', () => { … })
 *       return out
 *     },
 *   })
 *   expect(logs).toMatchSnapshot()
 */
export const withDebugLogs = <T>(opts: {
  envVar: string
  prefix: string
  fn: () => T
}): { result: T; logs: string[] } => {
  const { envVar, prefix, fn } = opts
  const previousEnv = process.env[envVar]
  process.env[envVar] = '1'

  const logs: string[] = []
  const originalLog = console.log
  console.log = (...args: unknown[]) => {
    const msg = args
      .map((a) => (typeof a === 'string' ? a : (a as { toString(): string }).toString()))
      .join(' ')
    if (msg.startsWith(prefix)) {
      logs.push(msg)
    } else {
      originalLog(...args)
    }
  }

  try {
    const result = fn()
    return { result, logs }
  } finally {
    console.log = originalLog
    if (previousEnv === undefined) {
      delete process.env[envVar]
    } else {
      process.env[envVar] = previousEnv
    }
  }
}
