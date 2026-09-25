import type { SandstoneCore } from '../../../core/sandstoneCore'
import * as util from 'util'
import { MathContainerNode } from './MathContainerNode'
import { BindingScope } from './BindingScope'
import {
  formatArgValue,
  formatMath,
  getIndent,
  MATH_NODE_DEFAULT_DEPTH,
  MATH_INDENT,
} from './inspectHelpers'
import type { MathExpressionNode } from './MathExpressionNode'
import type { MathNode } from './MathNode'
import type { Float, Integer } from './handles'

/**
 * Top-level Math DSL container — the analog of `MCFunctionNode` for math.
 *
 * One `MathFunctionNode` is created per `_.Math(...)` call. It owns:
 *   - `body`: the math AST (expression nodes, container nodes like
 *     `MathIfNode`, return markers, etc.). Imperative commands emitted
 *     by math nodes (`MathCommandNode` subclasses) commit themselves to
 *     whichever MCFunction is currently active — at top level the
 *     `MathFunction` registers a wrapper MCFunction for this purpose.
 *   - `bindings`: let-binding scope for `const rx = ...; rx['*='](...)`.
 *   - `outputs`: the return-shape schema (scalar or record of fields).
 *     Discriminated union avoids `result` key collisions with user-defined
 *     record schemas. The compile pass uses this to emit one provider
 *     resource per field (or one for scalar).
 *   - `currentReturn`: a per-frame "pending return value" handle. Set by
 *     `MathReturnNode`; merged into the final output DAG by the compiler.
 *
 * Context stack (`sandstoneCore.mathStack`) lets nested math containers
 * (`MathIfNode`, `MathSwitchNode`, ...) push/pop their own body context
 * without touching the MCFunction stack.
 */
export type MathFunctionOutputs =
  | { kind: 'scalar'; value: 'float' | 'integer' }
  | { kind: 'record'; fields: Record<string, 'float' | 'integer'> }

export class MathFunctionNode extends MathContainerNode {
  /** Type guard. */
  static is(node: unknown): node is MathFunctionNode {
    return node instanceof MathFunctionNode
  }

  readonly bindings = new BindingScope()
  readonly outputs: MathFunctionOutputs

  /**
   * Audit trail of every AST node constructed inside this function —
   * populated by `MathNode`'s base constructor (which pushes `this`
   * onto the active `MathFunctionNode.allNodes` whenever the math
   * stack top carries the field). `body` only holds flow-control
   * statements; `allNodes` captures the full computation record:
   *   - `CopyNode` from `_.float(x)` / `_.float(y)` / etc.
   *   - `BinaryOpNode` from `rx['*='](-1)` / `ry['*='](scale)` / etc.
   *   - `LiteralNode` / `ComparisonConditionNode` from `scale['=='](1)`.
   *
   * Used by `[util.inspect.custom]` to render the whole trace for
   * debug logging via `console.log` or the `onInitialAST` callback
   * added in `Flow.Math(outputs, callback, options)`.
   */
  readonly allNodes: MathNode[] = []

  /**
   * Rebound inputs the user passed to `mathFunction(...)` — i.e.,
   * each input's STARTING storage reference, captured by `__call__`
   * after `rebindInput`. We render these ahead of the AST so the
   * reader sees where the data is flowing from before they dig into
   * operator bodies.
   *
   * Storing the rebound (not raw) values gives us AST nodes that
   * carry their own `[util.inspect.custom]`, so `formatArgValue`
   * delegates recursively and renders each as `StorageRefNode(kind=…,
   * type=…, target=…, path=…)` rather than a static class+key dump.
   */
  inputs: ReadonlyArray<MathExpressionNode> = []

  /**
   * Per-class construction counter, keyed by class name. Each
   * `MathNode` ctor reads + increments its own slot. Used by
   * `MathNode.inspectClassName` to render the `<n>` suffix as
   * `ClassName<0>`, `ClassName<1>`, ... within one CLASS — so
   * `CopyNode<0>`, `CopyNode<1>`, `CopyNode<2>` track the three
   * distinct `_.float(...)` instances, while `LiteralNode<0>` tracks
   * the first literal independently.
   *
   * Scoped to this `MathFunctionNode` so each math block has its
   * own numbering; readers can match the same logical node across
   * every appearance site by `(className, index)`.
   */
  readonly perClassCounters: Map<string, number> = new Map()

  /**
   * User-supplied options bag (e.g., `onInitialAST`). The
   * `_RawMathFunction` wrapper assigns this from its `options?`
   * ctor field; the inspector renders each defined key as
   * `key: value-summary`.
   */
  options?: Record<string, unknown>

  /**
   * Per-frame pending return value, if any. `_.return(v)` sets it;
   * subsequent nodes until the next control-flow boundary read from it
   * (or it is captured by the compile pass as one branch of a
   * `number_dispatcher` provider).
   */
  currentReturn: Float | Integer | undefined = undefined

  /**
   * Provider JSONs deferred to a save-time pass. Each call to
   * `queueProvider(name, json)` records an entry; the core visitor
   * in `defaultVisitors` iterates these once at save time (after
   * every `__call__` for this math fn has happened) and registers
   * the providers exactly once total. The last registration wins,
   * which is the desired multi-call behaviour: the second call's
   * provider (with the user's input path rewritten to the shared
   * input path) replaces the first call's user-path provider.
   */
  providersToRegister: Array<{ name: string; json: unknown }> = []

  /**
   * Append a provider to the deferred-registration queue. Called by
   * `compileMathInvocation` after the per-op provider JSON has been
   * computed; the save-time visitor reads `providersToRegister`
   * to materialize the resource files.
   */
  queueProvider(name: string, json: unknown): void {
    // Replace earlier entries with the same name so the queue holds
    // at most one entry per provider; the final emit's content wins.
    this.providersToRegister = this.providersToRegister.filter(
      (p) => p.name !== name,
    )
    this.providersToRegister.push({ name, json })
  }

  /**
   * Resource identity. Set by the Math DSL entry-point (`SandstoneMath.Math`)
   * once the name is known. Used by the compile pass to derive provider
   * resource names (`<ns>/<name>/<field>`).
   */
  resourceName: string | undefined = undefined

  /**
   * Total number of times this math fn was invoked. Mirrored from
   * `_RawMathFunction._invocationCount` after each `__call__` so the
   * save-time compiler can tell single-call from multi-call without
   * re-scanning the host MCFunction for bridges. Set to 1 the first
   * time the fn is invoked; subsequent invocations bump it.
   *
   * Single-call optimization: when this is 1, the math reads from the
   * caller's DataPoint directly — no shared input address, no copy.
   * Multi-call: shared input address is allocated on the first call
   * (always, to keep the DataPoint reference stable) and every call
   * copies its input into it before the math runs.
   */
  invocationCount: number = 0

  /**
   * Internal flag set by `MathInvocationCompiler` after it has run the
   * optimization pass + registered the `FloatNumberProviderClass`
   * resource. Prevents repeated optimizations across multiple `__call__`
   * invocations of the same `MathFunction` (the AST is built once per
   * function and reused; the lowering pass must run once too).
   *
   * @internal
   */
  isLoweredForInline = false

  constructor(
    sandstoneCore: SandstoneCore,
    inputs: ReadonlyArray<MathExpressionNode> = [],
    outputs: MathFunctionOutputs = { kind: 'scalar', value: 'float' },
  ) {
    super(sandstoneCore)
    this.inputs = inputs
    this.outputs = outputs
    sandstoneCore.mathStack.push(this)
  }

  /**
   * Pop the active math function off the stack. Called by the entry-point
   * after the user callback returns. Idempotent if the stack is empty.
   */
  dispose(): void {
    const stack = this.sandstoneCore.mathStack
    const idx = stack.lastIndexOf(this)
    if (idx >= 0) stack.splice(idx, 1)
  }

  /**
   * Run `callback` with `node` as the active math container (so any math
   * nodes created during the callback land in `node.body`). If the
   * callback pushes additional containers onto `mathStack` (nested ifs,
   * case bodies, awaits), pop them all back to where we started — same
   * invariant as `MCFunctionNode.balanceContext`.
   *
   * Math DSL bodies are sync at compile time (no sleep/schedule), so the
   * "nested context leaks" case is narrower than MCFunction flow — but
   * condition-side sub-nodes can still construct combinator containers
   * (`MathConditionContainerNode`) without pushing the math stack. The
   * stack push/pop is for expression-side containers only.
   */
  balanceContext = (node: MathContainerNode, callback: () => void): void => {
    const stack = this.sandstoneCore.mathStack
    const depthBefore = stack.length
    node.generateBody(callback)
    while (stack.length > depthBefore) {
      stack.pop()
    }
  }

  /**
   * Skeleton. Real serialization compiles each output to a provider
   * resource (and possibly a wrapper mcfunction for imperative commands).
   */
  getValue(): unknown {
    return {
      type: 'MathFunction',
      outputs: this.outputs,
      body: this.body.map((n) => n.getValue()),
      bindings: [...this.bindings.names()],
    }
  }

  /**
   * Render the schema the user declared for the function's return
   * shape — `Float`, `Integer`, or `Object {x: float, y: float}`
   * for record outputs. Inspector emits this right after the
   * `inputs` block so readers know what to expect from the trailing
   * `_.return(...)` calls.
   */
  expectedOutputFormat(): string {
    return this.outputs.kind === 'scalar'
      ? this.outputs.value === 'float' ? 'Float' : 'Integer'
      : `Object {${Object.entries(this.outputs.fields)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ')}}`
  }

  /**
   * Render `options` entries — for each defined key in `this.options`,
   * return `key: value-summary` strings. Function values render as
   * `Function` (the body is uninteresting for this view). Joins
   * with `, ` for the inspector's parenthesis-style header.
   */
  private formatOptions(): string {
    const opts = this.options as Record<string, unknown> | undefined
    if (!opts) return ''
    return Object.entries(opts)
      .filter(([, v]) => v !== undefined)
      .map(([k, v]) => `${k}: ${typeof v === 'function' ? 'Function' : JSON.stringify(v)}`)
      .join(', ')
  }

  /**
   * Render the entire header line — `ClassName(key: val, …) {`
   * — combining user-set options into the parenthesis.
   */
  private headerLine(indent: string, depth: number): string {
    const opts = this.formatOptions()
    const argsText = opts ? `(${opts})` : ''
    if (depth <= 0) {
      return `${indent}${this.inspectClassName}${argsText}`
    }
    return `${indent}${this.inspectClassName}${argsText} ${util.styleText('yellow', '{')}`
  }

  /**
   * `outputs` + `bindings` + `body` + `allNodes` summary. Inspector
   * never reaches `getValue()` — that path hasn't been built (this is
   * a pre-visitor AST; the lowerer fills it in later). The display
   * here is a debugging aid only.
   */
  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    const indent = getIndent(options)
    if (depth <= 0) {
      return `${indent}${this.inspectClassName}`
    }
    const nextIndent = indent + MATH_INDENT
    const lines: string[] = [this.headerLine(indent, depth)]

    // Inputs the user passed to the math block — render FIRST so
    // readers see what data is flowing through before they dig into
    // the AST. `formatArgValue` delegates to `[util.inspect.custom]`
    // for AST-typed values; `DataPointClass` etc. fall back to the
    // static summary.
    if (this.inputs.length > 0) {
      lines.push(`${nextIndent}${util.styleText('gray', 'inputs')}`)
      for (const input of this.inputs) {
        const rendered = formatArgValue(input as Parameters<typeof formatArgValue>[0])
        lines.push(`${nextIndent}  ${rendered}`)
      }
    }

    // Expected output schema — render AFTER inputs (matching the
    // user-readable order: data flowing in, then what shape comes
    // out). Multi-line Object for record outputs, plain type for
    // scalars.
    lines.push(`${nextIndent}${util.styleText('gray', 'output(s)')}`)
    if (this.outputs.kind === 'scalar') {
      const scalarLabel = this.outputs.value === 'float' ? 'Float' : 'Integer'
      lines.push(`${nextIndent}  ${util.styleText('green', scalarLabel)}`)
    } else {
      lines.push(`${nextIndent}  ${util.styleText('green', 'Object')} ${util.styleText('yellow', '{')}`)
      const fields = Object.entries(this.outputs.fields)
      for (const [k, v] of fields) {
        const sep = fields[fields.length - 1][0] === k ? '' : ','
        lines.push(`${nextIndent}    ${k}: ${v}${sep}`)
      }
      lines.push(`${nextIndent}  ${util.styleText('yellow', '}')}`)
    }

    // Intelligent dedup: every user-named / user-visible node appears
    // exactly once at the top level of the chronological audit
    // trail. Two suppression rules:
    //
    //   1. `n.internal` — the node was constructed intrinsically as
    //      a stand-in for a raw user value (`handleToExpr` wrapping
    //      `rx['*='](-1)`'s `-1` literal, or `compare` wrapping a
    //      numeric right-hand side). These duplicate operands have
    //      no user-written name — they exist only to satisfy a
    //      positional argument slot — so logging them at root is
    //      noise. They render only inside the operator that needed
    //      them.
    //
    //   2. The node has an ancestor on `allNodes` and that ancestor's
    //      own `[util.inspect.custom]` walks its children via
    //      `util.inspect` (operator operands, container body,
    //      `MathIfNode`'s condition + body). The walker prints the
    //      child inline — listing it again at root would be a
    //      duplicate. The "lowest" such ancestor is the one that
    //      renders it; earlier hits in the chain don't double-print.
    //
    // Examples:
    //   CopyNode (from `_.float(x)`)
    //                          no parent, not internal                  : root
    //   LiteralNode(-1)        internal                                : hidden (only inside negate aggregate)
    //   AggregateNode(negate)  no parent, not internal                  : root
    //   AggregateNode(scale)   no parent, not internal                  : root
    //   ComparisonConditionNode  parent = MathIfNode (in allNodes)      : hidden (only inside if)
    //   LiteralNode(1)        internal                                : hidden (only inside the condition)
    //   MathIfNode             parent = MathFunctionNode (root, NOT    : root
    //                          in allNodes)
    //   MathReturnNode (inside if)  parent = MathIfNode (in allNodes)  : hidden
    //   MathReturnNode (trailing)    parent = MathFunctionNode (root)  : root
    //
    // Depends on each container / operator's inspector walking its
    // children via `util.inspect` — see `inspectHelpers.ts`.
    // No hard-coded "is LiteralNode" / "is MathReturnNode" checks;
    // both rules apply uniformly to whatever concrete subclasses
    // exist now and later.
    const allNodeSet = new Set(this.allNodes)
    const topLevel = this.allNodes.filter((n) => {
      if (n.internal) return false
      let p = n.parent
      while (p) {
        if (allNodeSet.has(p)) return false
        p = p.parent
      }
      return true
    })

    // `body` statement nodes (`MathIfNode`, `MathReturnNode`, …)
    // are also in `allNodes` (the base constructor registers every
    // node unconditionally), so they show up in `topLevel` above.
    // They're rendered via the same `util.inspect` walker as
    // everything else — no separate `body` section. Each statement
    // still uses its own `[util.inspect.custom]` to render its
    // condition + clause body, so the AST's structural shape is
    // preserved (the if's body block contains the return).
    if (topLevel.length > 0) {
      lines.push(`${nextIndent}${util.styleText('gray', 'ast')}`)
      for (const child of topLevel) {
        lines.push(util.inspect(child, { indent: nextIndent } as Parameters<typeof util.inspect>[1]))
      }
    }
    lines.push(`${indent}${util.styleText('yellow', '}')}`)
    return lines.join('\n')
  }
}