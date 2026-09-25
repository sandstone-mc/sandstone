import * as util from 'util'

/**
 * Internal helpers shared by every Math DSL AST node's
 * `[util.inspect.custom]` method. Mirrors the convention of
 * `formatDebugString` in `src/utils.ts` (the MCFunction inspector)
 * so math and command tree formatting look the same in `console.log`.
 *
 * Protocol
 * --------
 *
 * Each node implements `[util.inspect.custom](depth, options)` and
 * delegates here. The two arguments come from Bun/Node's
 * `util.inspect` machinery: `depth` is the configured max depth
 * minus current nesting, and `options.indent` is read for child
 * formatting (every level adds `MATH_INDENT` to the child's
 * `options.indent`).
 *
 * Formatting
 * ----------
 *
 * - Class names print in green (`util.styleText('green', className)`).
 * - Container bodies print with rainbow braces — color rotates on
 *   indent depth (cycle identical to `formatDebugString`).
 * - Values that aren't nodes (numbers, strings, simple fields) go
 *   through `util.inspect(v, options)` — same as `formatDebugString`.
 *   Child nodes also go through `util.inspect(node, options)`, so
 *   Bun's seen-set tracks each visit and any node-graph cycle is
 *   rendered as `[Circular]` rather than recursing forever.
 *
 * Bun seems to behave identically for math and command inspectors
 * here: the only difference is the AST shape, not the inspector
 * plumbing. The earlier `fn?.call(n, ...)` recursion I used avoided
 * `util.inspect` out of an abundance of caution; it isn't necessary
 * (and produces uglier indenting without going through Bun's
 * depth/indent pass). Match the established MCFunction pattern.
 */
export const MATH_NODE_DEFAULT_DEPTH = 4

/** Single-step indent string. Same width as `formatDebugString`. */
export const MATH_INDENT = '  '

/**
 * Per-process tracking of which nodes have already been emitted with
 * their full inspector (class-name + args + body). `[util.inspect.custom]`
 * delegates to `formatMath` / `formatMathLeaf` with `this` as the
 * tracker; first call from a fresh debug session runs the full
 * format, subsequent calls inside recursive walks (operator operands,
 * nested containers, the same logical node appearing in multiple
 * contexts) emit just the args or body block — class name is
 * suppressed once the reader has seen it once. The compact form
 * keeps cross-context appearances scannable without re-printing
 * the identifying header every time.
 */
const renderedFull = new WeakSet<object>()

/** Round a class name + args + children into a single string. */
export type MathNodeInspectFn = (depth?: number, options?: unknown) => string

/**
 * True iff `node` has already been emitted in its full
 * (class-named) form in this debug session. Inspectors branch on
 * this to decide between full and compact output. Safe to share
 * across the math AST via WeakSet (no leak).
 */
export function hasRenderedFull(node: unknown): boolean {
  return renderedFull.has(node as object)
}

/**
 * Mark `node` as having been emitted in its full form. Subsequent
 * recursive walks will see it in `hasRenderedFull` and emit the
 * compact variant. No-op when called from a previously-rendered
 * site (idempotent).
 */
export function markRenderedFull(node: unknown): void {
  renderedFull.add(node as object)
}

/** Forget the full-render history. Test-only — never call from
 *  inspector paths or you'll de-duplicate incorrectly across
 *  subsequent nodes of the same identity.
 */
export function _resetRenderedFull(): void {
  // WeakSet.clear is unavailable in pre-2024 typings; we recreate
  // the set so test setups can reset state cleanly.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(renderedFull as any).clear?.()
}

/**
 * Inspect options read by this module. Other keys may be present —
 * we only look at `indent`.
 */
export interface MathInspectOptions {
  indent?: string
}

/** Pull the current indent from an options bag, defaulting to `''`. */
export function getIndent(options: unknown): string {
  if (options && typeof options === 'object' && 'indent' in options) {
    return ((options as { indent?: string }).indent) ?? ''
  }
  return ''
}

/**
 * Color a value inline for arg printing. Scalars stringify directly;
 * functions collapse to a static label; OBJECTS WITH A
 * `[util.inspect.custom]` (every Math AST node) recursively
 * delegate to that custom renderer at depth=0 so nested
 * representations stay rich. Objects without one (e.g.,
 * `DataPointClass` — the giant helper object we explicitly don't
 * dive into, since `sandstoneCore` walks back through it) fall
 * back to a static class+keys summary truncated at 5 keys.
 *
 * We avoid `util.inspect(obj)` for objects without a custom
 * renderer because their default walk is what produced the 260 KB
 * `SandstoneCore.pack` dump we hit earlier.
 */
export function formatArgValue(v: unknown): string {
  if (v === undefined) return 'undefined'
  if (v === null) return 'null'
  if (typeof v === 'number' || typeof v === 'string' || typeof v === 'boolean') {
    return JSON.stringify(v)
  }
  if (typeof v === 'function') return '<function>'
  if (typeof v === 'object') {
    // Recursive delegation: if the value has its own
    // `[util.inspect.custom]`, ask for a depth-0 render so nested
    // containers truncate cleanly. Direct call (`fn.call(v, …)`)
    // instead of `util.inspect(v, …)` — we cannot route through
    // `util.inspect` here because for Math AST nodes the whole point
    // is to use our depth-bounded walker; `util.inspect` would still
    // add its own depth and the seen-set which is what we hand-rolled
    // `inspectHelpers.ts` to avoid.
    const fn = (v as { [util.inspect.custom]?: unknown })[util.inspect.custom]
    if (typeof fn === 'function') {
      try {
        const out = (fn as (depth?: number, options?: unknown) => string).call(v, 0)
        if (typeof out === 'string' && out.length > 0) return out
      } catch {
        // Fall through to the static summary below.
      }
    }
    const ctor = (v as { constructor?: { name?: string } }).constructor?.name ?? 'Object'
    const allKeys = Object.keys(v as object)
    const keyLimit = 5
    const shown = allKeys.length > keyLimit
      ? `${allKeys.slice(0, keyLimit).join(',')}, +${allKeys.length - keyLimit} more`
      : allKeys.join(',')
    return allKeys.length ? `<${ctor} {${shown}}>` : `<${ctor}>`
  }
  return String(v)
}

/**
 * Format `[k1=v1, k2=v2, …]` for an args list. Each value runs
 * through `formatArgValue` at the caller's indent (entries are
 * rendered on the args line, which is part of the class header).
 */
export function formatArgsText(
  entries: ReadonlyArray<[string, unknown]>,
): string {
  return entries.map(([k, v]) => `${k}=${formatArgValue(v)}`).join(', ')
}

/**
 * Rainbow-bracket palette for container bodies. Mirrors the cycle
 * in `formatDebugString`.
 */
const BRACKET_COLORS = [
  'yellow',
  'green',
  'cyan',
  'blue',
  'magenta',
  'redBright',
  'yellowBright',
  'greenBright',
  'cyanBright',
  'blueBright',
  'magentaBright',
] as const

function bracketColor(indent: string): typeof BRACKET_COLORS[number] {
  const idx = (indent.length / MATH_INDENT.length) % BRACKET_COLORS.length
  return BRACKET_COLORS[idx]
}

/**
 * Format a math container or operator — `className(args) { … }` with
 * green class name, rainbow braces, and children at the next indent.
 *
 * If `node` has already been emitted in full form elsewhere in the
 * same debug session, emit the compact variant — body block only,
 * no class header — so cross-context appearances stay scannable.
 *
 * Mirrors `formatDebugString` — children render via
 * `util.inspect(node, options)` so Bun tracks depth + seen-set
 * uniformly. The `options.indent` we pass (`nextIndent`) is consumed
 * by each child's own inspector (via `getIndent`); the first line
 * returned by `util.inspect` is already at that indent, and any
 * continuation lines were positioned by the child relative to it.
 *
 * Args are pre-formatted by the caller (so each leaf / operator
 * controls what shows up there).
 */
export function formatMath(
  className: string,
  argsText: string | undefined,
  children: readonly unknown[],
  depth: number,
  indent: string,
  node?: unknown,
): string {
  const alreadyRendered = node !== undefined && hasRenderedFull(node)
  if (alreadyRendered) {
    // Compact form: just `ClassName<N>` — no args, no body. The
    // reader has the full form once; the identifier alone is enough
    // for cross-referencing.
    return `${indent}${className}`
  }
  if (node !== undefined) markRenderedFull(node)
  // Class name arrives pre-styled (green + indexed-suffix) from
  // each node's `inspectClassName` getter; we don't recolor here so
  // the angle brackets stay plain in the output.
  const argsPart = argsText && argsText.length > 0 ? `(${argsText})` : ''
  if (children.length === 0) {
    return `${indent}${className}${argsPart}`
  }
  if (depth <= 0) {
    return `${indent}${className}${argsPart} <${children.length} children>`
  }
  const nextIndent = indent + MATH_INDENT
  const childOptions = { indent: nextIndent } as Parameters<typeof util.inspect>[1]
  const childBlocks = children.map((child) => {
    const out = util.inspect(child, childOptions)
    // util.inspect returns text where the first line is at the
    // requested `indent` (nextIndent here); continuation lines were
    // positioned by the child. Trust that, but trim any leading
    // whitespace on the first line that might have slipped in (a
    // string child with no indent would be at column 0, for example).
    const lines = out.split('\n')
    lines[0] = `${nextIndent}${lines[0].replace(/^\s*/, '')}`
    return lines.join('\n')
  })
  // Blank-line guard: don't emit a trailing blank if the last child
  // produced no content.
  const bodyString = childBlocks.filter((s) => s.length > 0).join('\n')
  return `${indent}${className}${argsPart} ${util.styleText(bracketColor(indent), '{')}\n${bodyString}\n${indent}${util.styleText(bracketColor(indent), '}')}`
}

/**
 * Single-line leaf / statement inspector: `ClassName(args)` —
 * no children block. Class colored green.
 *
 * If `node` has already been emitted in full form, emit just the
 * `ClassName<N>` identifier — no args body, no children. The class
 * identifier (already pre-styled by `inspectClassName`) is enough
 * for cross-referencing once the reader has seen the full form
 * elsewhere.
 */
export function formatMathLeaf(
  className: string,
  argsEntries: ReadonlyArray<[string, unknown]>,
  indent: string,
  node?: unknown,
): string {
  if (node !== undefined && hasRenderedFull(node)) {
    return `${indent}${className}`
  }
  if (node !== undefined) markRenderedFull(node)
  // Class name comes pre-styled (with green color + possibly a
  // colored `<n>` suffix) from the caller's `inspectClassName` getter;
  // we don't recolor here so the brackets stay plain.
  return `${indent}${className}(${formatArgsText(argsEntries)})`
}
