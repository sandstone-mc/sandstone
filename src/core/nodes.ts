import type { SandstonePack } from 'sandstone/pack'
import type { LoopArgument } from 'sandstone/variables'
import { ResolvedNBT } from 'sandstone/variables/nbt/NBTs'
import * as util from 'util'
import { formatDebugString } from '../utils'
import { isMacroArgument, type MacroArgument } from './Macro'
import type { MCFunctionClass, MCFunctionNode } from './resources/datapack'
import type { SandstoneCore } from './sandstoneCore'
import type { TestMCFunctionNode } from 'sandstone/test'

/**
 * One frame of a captured command stack trace.
 *
 * Mirrors the V8 `Error.stack` format (`at <name> (<file>:<line>:<col>)` or
 * `at <file>:<line>:<col>` for anonymous frames).
 */
export interface CommandStackFrame {
  /** Function/method name, or `null` for top-level code. */
  name: string | null

  /** Absolute path of the source file the frame ran in. */
  file: string

  /** 1-based line number. */
  line: number

  /** 1-based column number. */
  column: number
}

/**
 * Capture and parse the current call stack, skipping frames internal to
 * Sandstone itself.
 *
 * Returns an array of `CommandStackFrame`s starting at the first frame
 * that isn't part of this library. The leading `Error`/`captureCommandStackTrace`
 * frames, plus the Sandstone command-class `finalCommand` wrapper that
 * initiated the capture, are stripped so the first remaining frame points
 * at the user's call site.
 *
 * @internal
 */
export function captureCommandStackTrace(extraSkipFrames: string[] = []): CommandStackFrame[] {
  const stackHolder: { stack?: string } = {}
  Error.captureStackTrace(stackHolder, captureCommandStackTrace)
  const raw = stackHolder.stack
  if (!raw) return []

  const skipNames = new Set([
    'captureCommandStackTrace',
    'attachStackTrace',
    'finalCommandWithStackTrace',
    'Error',
    ...extraSkipFrames,
  ])

  const frames: CommandStackFrame[] = []
  // Skip the leading "Error\n" line; remaining lines are V8 frame entries.
  const lines = raw.split('\n').slice(1)
  for (const line of lines) {
    const frame = parseStackFrameLine(line)
    if (frame === null) continue

    // Strip library-internal frames so the user sees their own call site
    // first. Skip while we're still in the leading library frames; once
    // we hit a user frame we stop, leaving the call site as the only
    // entry — the test runner only needs the originating source line.
    if (
      frames.length === 0
      && (skipNames.has(frame.name ?? '') || isSandstoneInternalFrame(frame.file))
    ) {
      continue
    }
    frames.push(frame)
    break
  }
  return frames
}

/**
 * `true` for frames whose source file lives inside the Sandstone
 * library — these are the ones to strip from the head of a captured
 * stack so the first remaining frame is the originating user call site.
 *
 * @internal
 */
function isSandstoneInternalFrame(file: string): boolean {
  // V8 reports inlined frames as `<anonymous>` in source position. Treat
  // them as internal until proven otherwise — the user file path will
  // never be empty.
  if (!file) return false
  return (
    file.includes('/sandstone/dist/')
    || file.includes('/sandstone/src/')
    || file.endsWith('/sandstone/dist/_internal/index.js')
  )
}

/**
 * Parse a single V8 stack-trace line into a `CommandStackFrame`.
 *
 * Accepts both:
 * - `at funcName (file:line:col)`
 * - `at file:line:col`
 *
 * @internal
 */
function parseStackFrameLine(line: string): CommandStackFrame | null {
  // V8 prefixes every frame with "    at ".
  const match = line.match(/^\s*at\s+(.*?)(?:\s+\(([^)]+)\))?\s*$/)
  if (!match) return null

  const [, rawName, rawLoc] = match
  const loc = rawLoc ?? rawName
  const locMatch = loc.match(/^(.*?):(\d+):(\d+)$/)
  if (!locMatch) return null

  const [, file, lineStr, colStr] = locMatch

  return {
    name: rawLoc === undefined ? null : (rawName === 'Object.<anonymous>' ? null : rawName),
    file,
    line: Number(lineStr),
    column: Number(colStr),
  }
}

export abstract class Node {
  constructor(public sandstoneCore: SandstoneCore) {}

  [util.inspect.custom](_depth: number, _options: any) {
    return `${this.constructor.name}()`
  }

  abstract getValue(): any

  type = this.constructor.name
}

/**
 * A node that includes other nodes.
 */
export abstract class ContainerNode extends Node {
  _body: Node[]

  constructor(sandstoneCore: SandstoneCore) {
    super(sandstoneCore)

    this._body = []
  }

  get body(): Node[] {
    return this._body
  }

  set body(body: Node[]) {
    this._body = body
  }

  generateBody(callback: () => void): Node[] {
    // Enter the current node's body
    this.sandstoneCore.insideContext(this, () => {
      callback()
    })

    // Return the body of this node.
    return this.body
  }

  /**
   * Appends a node at the end of this node's body.
   */
  append<NODE extends Node>(node: NODE): NODE

  /**
   * Appends several nodes at the end of this node's body.
   */
  append<NODES extends Node[]>(...nodes: NODES): NODES

  append(...nodes: Node[]) {
    this.body.push(...nodes)
    return nodes.length === 1 ? nodes[0] : nodes
  }

  /**
   * Prepends a node to the beginning of this node's body.
   */
  prepend<NODE extends Node>(node: NODE): NODE

  /**
   * Prepends several nodes to the beginning of this node's body.
   */
  prepend<NODES extends Node[]>(...nodes: NODES): NODES

  prepend(...nodes: Node[]) {
    this.body.unshift(...nodes)
    return nodes.length === 1 ? nodes[0] : nodes
  }

  [util.inspect.custom](depth: number, options: any) {
    return formatDebugString(this.constructor.name, undefined, this.body, options.indent)
  }
}

/**
 * A node that represents a generic command.
 */
export abstract class CommandNode<ARGS extends unknown[] = unknown[]> extends Node {
  abstract command: string

  args: ARGS

  commited = false

  isMacro = false

  /**
   * When `true`, this command may only be committed from inside a test
   * mcfunction (`TestMCFunctionClass`). `finalCommand` will refuse to
   * commit it if the current MCFunction is anything else — including
   * the absence of an active MCFunction context.
   *
   * Set this to `true` on `CommandNode` subclasses that are provided by
   * server mods which are only loaded in the test environment (e.g.
   * PackTest's `assert`, `await`, `dummy`, `fail`, `succeed`).
   */
  readonly testExclusive: boolean = false

  /**
   * Stack trace captured at the call site that constructed this command.
   *
   * Set by command classes that override `finalCommand` to capture their
   * origin (e.g. the test assertion/await/fail helpers) so test runners
   * can point users at the line of `src/` that produced the failing
   * assertion. `undefined` for commands that don't capture a trace.
   *
   * Separate from `AwaitNode.stackTrace` (the string-form raw V8 stack
   * that awaits capture themselves) to avoid type clashes on nodes that
   * inherit from both.
   *
   * @see captureCommandStackTrace
   */
  commandStackTrace?: readonly CommandStackFrame[]

  constructor(
    public sandstonePack: SandstonePack,
    ...args: ARGS
  ) {
    super(sandstonePack.core)
    this.args = args
  }

  getValue() {
    if (this.sandstoneCore.commandSerializationDepth === 0) {
      this.sandstoneCore.macroAlreadyUsed = false
    }
    this.sandstoneCore.commandSerializationDepth++
    const filteredArgs: unknown[] = this.command === '' ? [] : [this.command]

    // `this.isMacro` is the sole signal that decides the `$` prefix. It must
    // be set at construction by `Macro as $`, helpers.ts propagation, or the
    // node's own constructor when the syntax is intrinsically macro (e.g.
    // `function <name-with-$(...)>`).
    //
    // We track `hasMacroArgs` purely as a sanity check: an arg that IS a
    // macro argument landing on a non-macro-declared node means the caller
    // forgot to declare macro → throw.
    //
    // Note: `function <name> with storage <path>` is NOT a macro command.
    // The `with` clause routes env-var resolution at runtime, but the
    // function name has no `$(...)`, so the serialized args are plain
    // strings — `hasMacroArgs` stays false.
    let hasMacroArgs = false

    for (const arg of this.args) {
      if (arg !== undefined && arg !== null) {
        // Yes these are cursed, unfortunately, there's not really a better way to do this as visitors only visit the root nodes.
        if (typeof arg === 'object') {
          if (arg instanceof ResolvedNBT) {
            // ResolvedNBT carries macro info forward from nbtResolver recursion,
            // so we can detect $(...) substitutions that originated inside nested
            // NBT values rather than from a top-level MacroArgument object.
            if (arg.containsMacro) {
              hasMacroArgs = true
              this.sandstoneCore.macroAlreadyUsed = true
            }
            filteredArgs.push(arg)
          } else if (isMacroArgument(this.sandstoneCore, arg)) {
            hasMacroArgs = true
            this.sandstoneCore.macroAlreadyUsed = true

            filteredArgs.push((arg as MacroArgument).toMacro())
          } else if (Object.hasOwn(arg, '_hasMacro') && (arg as { _hasMacro: boolean })._hasMacro) {
            // Selector (and any similar complex arg that stringifies `$(...)`
            // via its own toString) exposes macro info via _hasMacro so the
            // command can still be flagged as a macro command.
            hasMacroArgs = true
            this.sandstoneCore.macroAlreadyUsed = true

            filteredArgs.push(arg)
          } else if (Object.hasOwn(arg, 'toLoop')) {
            filteredArgs.push((arg as LoopArgument).toLoop())
          } else {
            filteredArgs.push(arg)
          }
        } else {
          filteredArgs.push(arg)
        }
      }
    }

    if (hasMacroArgs && !this.isMacro) {
      throw new Error(`[${this.constructor.name}#getValue] Received macro argument(s) but was not declared as a macro command.`)
    }
    if (!hasMacroArgs && this.isMacro && !this.sandstoneCore.macroAlreadyUsed) {
      throw new Error(`[${this.constructor.name}#getValue] Command was declared as a macro command but received no macro argument(s).`)
    }

    this.sandstoneCore.commandSerializationDepth--
    return `${this.isMacro ? '$' : ''}${filteredArgs.join(' ')}`
  }

  /**
   * Commits the command to the current MCFunction context.
   */
  commit() {
    if (this.commited) {
      return this
    }
    this.commited = true

    return this.sandstonePack.appendNode(this)
  }

  [util.inspect.custom](depth: number, options: any) {
    return formatDebugString(this.constructor.name, this.args, undefined, options.indent)
  }
}

/**
 * A node that includes other nodes.
 */
export abstract class ContainerCommandNode<ARGS extends unknown[] = unknown[]>
  extends CommandNode<ARGS>
  implements ContainerNode {
  abstract command: string

  _body: Node[]

  constructor(sandstonePack: SandstonePack, ...args: ARGS) {
    super(sandstonePack, ...args)
    this._body = []
  }

  get body(): Node[] {
    return this._body
  }

  set body(body: Node[]) {
    this._body = body
  }

  generateBody(callback: () => void): Node[] {
    // Enter the current node's body
    this.sandstoneCore.insideContext(this, () => {
      callback()
    })

    // Return the body of this node.
    this._body = this.body
    return this._body
  }

  /**
   * Appends a node at the end of this node's body.
   */
  append(node: Node) {
    this.body.push(node)
    return node
  }

  /**
   * Appends a node at the end of this node's body.
   */
  prepend(node: Node) {
    this.body.unshift(node)
    return node
  }

  [util.inspect.custom](depth: number, options: any) {
    return formatDebugString(this.constructor.name, this.args, this.body, options.indent)
  }

  /**
   * Create a MCFunction from this node.
   * It shouldn't be added to Sandstone's core.
   *
   * The returned node will replace
   */
  createMCFunction: (currentMCFunction: TestMCFunctionNode | MCFunctionNode | null) => { node: Node | Node[]; mcFunction?: MCFunctionNode } =
    (_currentMCFunction) => ({ node: this })
}

export abstract class AwaitNode extends ContainerCommandNode {
  mcfunction: MCFunctionClass<any, any> = undefined as unknown as MCFunctionClass<any, any>

  /**
   * The MCFunction whose body currently contains this AwaitNode. Captured
   * at construction (the MCFunction whose context the node was appended
   * to via `enterContext`) and refreshed by
   * `ContainerCommandsToMCFunctionVisitor` when the node's containing
   * execute body is extracted into a new MCFunction. Lets
   * `AwaitBodyVisitor.cleanupUntil` find the await's direct parent in
   * O(1) instead of scanning `core.resourceNodes`.
   */
  parentMCFunction: MCFunctionNode | undefined
}

export type AwaitNodeClass = new (core: SandstoneCore, ...args: any[]) => AwaitNode