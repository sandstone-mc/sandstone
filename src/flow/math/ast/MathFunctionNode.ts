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
import type { DataPointClass } from '../../../variables/Data'
import type { JsonContextFloatProvider } from '../../../arguments/generated/_json/data/number_provider/context_float.ts'
import type { JsonContextIntProvider } from '../../../arguments/generated/_json/data/number_provider/context_int.ts'
import { StorageRefNode } from './nodes/leaves'
import type { MathExpressionNode } from './MathExpressionNode'
import type { MathNode } from './MathNode'
import type { Float, Integer } from './handles'
import type { MathChainAnalysis } from '../visitors/mathChainAnalysis'

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

/**
 * A provider JSON queued for registration at save time. The `kind`
 * discriminates the two MC provider families, so the registration
 * pass picks the right resource type without casting.
 */
export type QueuedProvider =
  | { name: string; kind: 'float'; json: JsonContextFloatProvider }
  | { name: string; kind: 'integer'; json: JsonContextIntProvider }

/**
 * MC's resource id path charset. A record output's field names end
 * up in the provider resource names, and MC only allows
 * `[a-z0-9._-]` in a resource id — a capital letter makes the
 * provider file unloadable (*"Invalid path in pack"*) and the
 * registry lookup for it then fails at runtime.
 */
const MC_RESOURCE_ID_PATH = /^[a-z0-9._-]+$/

/**
 * Reject an output schema whose field names can't be part of a
 * resource id.
 *
 * Checked as soon as the schema is declared, so the user hears about
 * it at the call site rather than as an unloadable provider file
 * much later.
 */
export function assertValidOutputFieldNames(fieldNames: readonly string[]): void {
  for (const field of fieldNames) {
    if (MC_RESOURCE_ID_PATH.test(field)) continue
    throw new Error(
      `Math: the output field '${field}' is not a valid Minecraft resource `
      + `id. Resource ids may only contain lowercase letters, digits, '_', `
      + `'.', and '-' — name the output fields in snake_case.`,
    )
  }
}

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
  allNodes: MathNode[] = []

  /**
   * Read-only analysis results produced by the math visitor pipeline.
   * Each entry is keyed by the analysis visitor's `key` field; the
   * compiler reads the entries it needs (e.g. `'chain'` for
   * `MathChainAnalysis`) and ignores the rest. The map is populated
   * by `runDefaultMathVisitors` after every transform visitor has
   * run; AST transforms mutate `allNodes` first, then analyses read
   * the post-transform state.
   *
   * `unknown` keeps the map untyped at this layer — concrete
   * analyses cast at the read site (e.g. `fn.analyses.get('chain') as
   * MathChainAnalysis`). Future analyses register their own key.
   */
  analyses: Map<string, unknown> = new Map()

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
   * Set by `ConstantFoldingVisitor` when the entire math function
   * chain folded to a single literal value (e.g. `add([rx, rx,
   * selfSub=0, selfDiv=1])` → `Literal(101)`). The chain analysis
   * reads this to produce one synthetic update whose expression
   * IS the literal — so the compiler emits a single command with
   * a single-literal provider JSON (`101`) instead of producing
   * no command at all.
   *
   * Without this handoff, the constant folder's fold would be
   * invisible to the compiler (the chain analysis has no operator
   * to walk). The field is a one-way signal: written by the
   * constant folder, read once by the chain analysis, then never
   * consulted again.
   */
  constantResult: MathExpressionNode | null = null

  /**
   * Record-output equivalent of `constantResult`. When the return
   * value is a record (`_.return({ x: ..., y: ... })`) and every
   * field folds to a literal, this map stores `{ fieldName: literal
   * value }`. The compiler emits one `set value` per field's result
   * path. Without this, record outputs produce no commands at all
   * (chain analysis can't walk a record, `constantResult` is a
   * single value).
   */
  recordConstantResult: Record<string, number> | null = null

  /**
   * Per-field `StorageRefNode` for record outputs. Populated by
   * `_RawMathFunction.makeDeferredResult` when each field's
   * `StorageRefNode` is allocated. The compiler reads this to find
   * each field's chain root in `rootToId` (so it can fold the last
   * chain update into the field's result path with a `set compute`).
   */
  fieldResultRoots: Map<string, StorageRefNode> = new Map()

  /**
   * Typed accessor for the chain-analysis result. The underlying
   * `analyses` map is `Map<string, unknown>` because each visitor
   * registers its own key; this helper narrows to `MathChainAnalysis`
   * so call sites don't repeat the `as` cast.
   *
   * Throws if the analysis is missing — `MathChainAnalysisVisitor`
   * is unconditionally registered by `runDefaultMathVisitors`, so a
   * missing entry indicates a pipeline ordering bug. Surface that
   * as a hard error rather than letting downstream `analysis.x`
   * accesses silently produce `undefined`.
   */
  get chainAnalysisResult(): MathChainAnalysis {
    const v = this.analyses.get('chain') as MathChainAnalysis | undefined
    if (v === undefined) {
      throw new Error(
        'MathFunctionNode.chainAnalysisResult: chain analysis missing — '
          + 'runDefaultMathVisitors must run before reading analysis results.',
      )
    }
    return v
  }

  /**
   * Typed accessor for the return-handle analysis. Returns the
   * chain handle ID (or `null` if the return is a literal).
   */
  get returnHandleNameResult(): string | null {
    return (this.analyses.get('returnHandle') as string | null | undefined) ?? null
  }

  /**
   * Caches for the storage-DataPoint allocators below. The compiler
   * can call `getHandleStorage` / `getResultStorage` /
   * `getResultStorageForField` many times for the same key (once
   * per bridge, per plan-emit iteration); without caching every
   * call instantiates a fresh `DataVariable` whose only difference
   * is the cached `.path` string. Memoize so identity matches
   * across the bridge loop and the user-side `.data()` reads.
   */
  private readonly handleStorageCache: Map<string, DataPointClass<'storage'>> = new Map()
  private readonly resultStorageCache: Map<string, DataPointClass<'storage'>> = new Map()
  private readonly fieldStorageCache: Map<string, DataPointClass<'storage'>> = new Map()

  /**
   * Provider JSONs deferred to a save-time pass. Each call to
   * `queueProvider(entry)` records an entry; the core visitor
   * in `defaultVisitors` iterates these once at save time (after
   * every `__call__` for this math fn has happened) and registers
   * the providers exactly once total. The last registration wins,
   * which is the desired multi-call behaviour: the second call's
   * provider (with the user's input path rewritten to the shared
   * input path) replaces the first call's user-path provider.
   *
   * The entry is a discriminated union on the provider's numeric
   * kind, so the registration pass picks the matching MC provider
   * resource family (`context_float_provider` vs
   * `context_int_provider`) without any casting.
   */
  providersToRegister: QueuedProvider[] = []

  /**
   * Append a provider to the deferred-registration queue. Called by
   * `compileMathInvocation` after the per-op provider JSON has been
   * computed; the save-time visitor reads `providersToRegister`
   * to materialize the resource files.
   */
  queueProvider(entry: QueuedProvider): void {
    // Replace earlier entries with the same name so the queue holds
    // at most one entry per provider; the final emit's content wins.
    this.providersToRegister = this.providersToRegister.filter(
      (p) => p.name !== entry.name,
    )
    this.providersToRegister.push(entry)
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
    assertValidOutputFieldNames(outputs.kind === 'record' ? Object.keys(outputs.fields) : [])
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
   * Math storage allocation. Every storage path the math layer writes
   * to or reads from flows through one of these three methods. The
   * caller passes only a logical sub-name (handle id, position,
   * callIdx); the actual full path is built inside `DataVariable` so
   * packUid/namespace/anonymousDataId suffixing stays consistent
   * with the rest of Sandstone.
   *
   * Crucial invariant: callers must NOT extract `dp.path` /
   * `dp.currentTarget` and re-build a path string elsewhere. Plumb
   * the `DataPointClass` itself through every consumer (provider
   * embed, runtime command emission) — that way write and read
   * targets are structurally guaranteed to share a single source of
   * truth and can't drift out of sync.
   *
   * Naming convention matches the prior string-concat forms so
   * generated outputs are stable across the refactor; only the
   * suffixing mechanism changes (was: bare string; now: via
   * `DataVariable`).
   */
  /**
   * Storage for a single named handle (`rx`, `ry`, etc.). Written to
   * by each math op on the handle's chain; read back by the next op's
   * incremental provider. Shared across all calls of this math fn
   * (no per-call suffix).
   */
  getHandleStorage(handleName: string): DataPointClass<'storage'> {
    let cached = this.handleStorageCache.get(handleName)
    if (cached === undefined) {
      cached = this.sandstoneCore.pack.DataVariable(
        undefined,
        `math_${this.resourceName ?? '0'}_h_${handleName}`,
      )
      this.handleStorageCache.set(handleName, cached)
    }
    return cached
  }

  /**
   * Look up the `StorageRefNode` for a record output field. Used by
   * the compiler to find each field's chain root in `rootToId`.
   * Returns `undefined` if the field doesn't exist.
   */
  getResultStorageRootForField(fieldName: string): StorageRefNode | undefined {
    return this.fieldResultRoots.get(fieldName)
  }

  /**
   * Storage `DataPoint` for a record output field. Per-call suffixed
   * when `useCallNamespace` so concurrent calls land at distinct
   * paths. Same suffix scheme as `getResultStorage`.
   */
  getResultStorageForField(
    fieldName: string,
    callIdx: number,
    useCallNamespace: boolean,
  ): DataPointClass<'storage'> {
    const key = `${fieldName}|${callIdx}|${useCallNamespace ? 'ns' : 's'}`
    let cached = this.fieldStorageCache.get(key)
    if (cached === undefined) {
      const suffix = useCallNamespace ? `_${callIdx}` : ''
      cached = this.sandstoneCore.pack.DataVariable(
        undefined,
        `math_${this.resourceName ?? '0'}_${fieldName}${suffix}`,
      )
      this.fieldStorageCache.set(key, cached)
    }
    return cached
  }

  /**
   * Storage for the math fn's final return value. Per-call suffixed
   * when `useCallNamespace` so concurrent calls don't clobber each
   * other's result; unsuffixed for the single (or first) call.
   * Same `DataPoint` is what the output handle's `.data()` returns.
   */
  getResultStorage(callIdx: number, useCallNamespace: boolean): DataPointClass<'storage'> {
    const key = `${callIdx}|${useCallNamespace ? 'ns' : 's'}`
    let cached = this.resultStorageCache.get(key)
    if (cached === undefined) {
      const suffix = useCallNamespace ? `_${callIdx}` : ''
      cached = this.sandstoneCore.pack.DataVariable(
        undefined,
        `math_${this.resourceName ?? '0'}_result${suffix}`,
      )
      this.resultStorageCache.set(key, cached)
    }
    return cached
  }

  /**
   * Shared input storage for multi-call math — every call's caller
   * value is copied here before the math runs, so the deduplicated
   * provider JSON can reference a stable path. Allocated lazily on
   * first call per position (see `_RawMathFunction.__call__`).
   */
  getSharedInputStorage(position: number): DataPointClass<'storage'> {
    return this.sandstoneCore.pack.DataVariable(
      undefined,
      `math_${this.resourceName ?? '0'}_input_${position}`,
    )
  }

  /**
   * Set of every handle's `startNode` registered while this function
   * was being populated. Populated by
   * `BaseHandle._registerHandleWithActiveFunction` (called from each
   * handle subclass constructor). Used by the compiler to discover
   * chain roots — derived handles like
   * `const funny = _.modulo(rx, val)` register their startNode here
   * so the compiler can recognise funny's chain as distinct from
   * rx's chain. Without this, the compiler sees
   * `funny.startNode.operands[0] === rx.startNode` and mis-classifies
   * funny's startNode as an rx chain extension (reading from rx's
   * intermediate storage on subsequent ops).
   *
   * Every handle created during the user's callback registers here
   * — including throwaway handles used inline as values. The compiler
   * treats every registered startNode as a potential chain root;
   * ones that aren't the startNode of a chain-extension handle just
   * cost one extra unused storage slot, which is harmless.
   */
  readonly startNodes: Set<MathExpressionNode> = new Set()

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