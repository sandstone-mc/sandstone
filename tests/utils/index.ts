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
