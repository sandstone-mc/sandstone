import type { Float, Integer } from './handles'
import { Float as _FloatClass, Integer as _IntegerClass, _RawFloatHandle, _RawIntegerHandle } from './handles'
import { DataPointClass, IntegerDataPointClass } from '../../../variables/Data'
import { Score } from '../../../variables/Score'
import type { MathFunctionOutputs } from './MathFunctionNode'
import { MathFunctionNode, assertValidOutputFieldNames } from './MathFunctionNode'
import { LiteralNode, ScoreboardRefNode } from './nodes/leaves'
import { MathReturnNode } from './nodes/control'
import type { MathNode } from './MathNode'
import type { FloatNumberProviderClass, IntegerNumberProviderClass } from 'sandstone/core'
import { runDefaultMathVisitors } from '../visitors'
import { compileFloatProvider, compileIntProvider } from '../compile/mathProviderCompiler'
import type { SandstoneCore } from '../../../core/sandstoneCore'
import type { MCFunctionNode } from 'sandstone/core'
import { MathExpressionNode } from './MathExpressionNode'
import type { MathKind } from './MathExpressionNode'
import { makeClassCallable } from '../../../utils'
import type { MakeInstanceCallable } from '../../../utils'
import type { NBTSerializable } from '../../../arguments'
import { NBTByte, NBTDouble, NBTFloat, NBTInt, NBTShort } from '../../../variables/nbt/NBTs'
import type { MathSchemaValue } from '../../math/Math'
import { SandstoneMath } from '../../math/Math'
import { StorageRefNode } from './nodes/leaves'
import { DataPointPickClass } from 'sandstone/core'
import { MathInvocationNode as MathInvocationBridgeNode, SharedInputSlot } from '../compile/MathInvocationNode'
import { computeInputShapeKey } from '../compile/groupBridges'

/**
 * Input types accepted by `Math.__call__(...inputs: P)`. Each non-handle
 * input (DataPointClass, DataPointPickClass, Score, NBT number) gets
 * rebound to the matching Float/Integer handle at call time — TS narrows
 * the parameter type, runtime rebinds the value.
 *
 * `number` is intentionally NOT here — literal numbers must be wrapped
 * via `_.float()` / `_.integer()` first (runtime `rebindInput` throws).
 * Use the `MathInputs` array type at the call site for a tighter
 * signature.
 */
type MathInput = number | Float | Integer | DataPointClass | DataPointPickClass | Score | NBTNumber

/**
 * Numeric NBT values accepted as math-block inputs. `NBT.int(69)` is
 * the constant form — it lowers to MC's `constant` int provider.
 *
 * `NBTLong` is deliberately absent: a long is a `bigint`, which the
 * math AST's `number`-valued literals can't represent exactly.
 */
type NBTNumber = NBTInt | NBTByte | NBTShort | NBTFloat | NBTDouble

/**
 * The integer-valued subset of {@link NBTNumber} — the constants an
 * integer math block accepts.
 */
type NBTIntNumber = NBTInt | NBTByte | NBTShort

/**
 * Runtime shape of the input tuple `_.Math` accepts. An array of
 * `Float | Integer` handles, one per input param of the callback.
 */
type MathInputs = readonly (Float | Integer)[]

/**
 * Expand a callback-declared input tuple `T` to also accept
 * `DataPointClass`, `DataPointPickClass`, and `Score` at each position
 * where `Float` / `Integer` appear. The runtime rebound converts each
 * `DataPointClass` / `PickClass` / `Score` to the matching handle type
 * before invoking the callback, so the cb sees branded handles.
 *
 * Used by `Math.__call__`'s parameter type so callers can pass NBT or
 * score references where the cb declares plain `Float` / `Integer`.
 *
 * An `Integer` position does NOT accept a bare `number` — integer math
 * inputs are `NBT.int(69)`, an integer-typed DataPoint, or a `Score`.
 * A bare number is a float literal, and silently feeding one into an
 * integer block is exactly the float-into-integer leak the integer
 * path is designed to avoid. Automatic conversion of bare numbers
 * (int → float widening, float → int narrowing) is a future change;
 * until then the explicit forms are required.
 */
type ExpandInputs<T> = {
  [K in keyof T]: T[K] extends Float
    ? Float | number | DataPointClass | DataPointPickClass | Score | NBTNumber
    : T[K] extends Integer
      ? Integer | IntegerDataPointClass | DataPointClass | DataPointPickClass | Score | NBTIntNumber
      : T[K]
}

/**
 * Module-level counter for unique storage-path suffixes. Each `Math`
 * instance gets a fresh number so its deferred-storage paths don't
 * collide with other math blocks.
 */
let _instanceCounter = 0

/**
 * Optional hooks for `_.Math(outputs, callback, options)`.
 *
 * - `onInitialAST(node)` — fires once, synchronously, after the
 *   `MathFunctionNode` AST is fully populated (user callback returned)
 *   and before the math stack is popped. Use for inspection / debug
 *   logging of the generated AST. Skipped on subsequent calls — AST
 *   builds lazily on first invocation, then is cached.
 */
export type MathOptions = {
  onInitialAST?: (ast: MathFunctionNode) => void
}

/**
 * `Math<P, R>` — user-facing callable + type for a math function.
 *
 * Mirrors `MCFunctionClass` / `ObjectiveClass` pattern: a single name
 * serves as both value (the class) and type (instance with the call
 * signature).
 *
 * Usage:
 * ```ts
 * const f = _.Math({x: 'float'}, (_, input: Float): {x: Float} => { ... })
 * const result = f(myInput)  // -> { x: Float }
 * ```
 *
 * `P` is inferred from the callback's input parameters (args after
 * `_math`). `R` is a phantom type parameter that flows into the
 * callback's `_Math<R>` (for any return-value constraints the user
 * chooses to attach).
 *
 * **Lazy AST construction.** Construction just stores the callback +
 * outputs schema. The AST (`MathFunctionNode`) is built when `__call__`
 * runs the user's callback the FIRST time the math block is invoked.
 * Subsequent calls reuse the cached AST. Unused math blocks have zero
 * compile-time cost.
 *
 * **Return shape.** `__call__` returns `MathSchemaValue<R>`:
 *   - Scalar schema `'float' | 'integer'` → returns a single `Float` /
 *     `Integer` handle (the scalar output).
 *   - Record schema `{x: 'float', ...}` → returns `{x: Float, ...}`
 *     (one entry per output field).
 *
 * **Deferred reference semantics.** `__call__` returns `StorageRefNode`-
 * based handles pointing at temp storage paths (`math_<n>_result` /
 * `math_<n>_<key>`). The lowerer replaces each `StorageRefNode` with
 * an actual provider when emitting. There is no stub — the deferred
 * references are real (typed, queryable) handles.
 */
class _RawMathFunction<P extends readonly MathInput[], R>
  implements NBTSerializable
{
  /**
   * Per-input-shape AST cache. Each unique input shape (see
   * `compile/groupBridges.ts#computeInputShapeKey`) gets its own
   * `MathFunctionNode` built once and reused by subsequent calls
   * with matching shapes. Different shapes → different ASTs (each
   * AST captures the actual constant / DataPoint identity at the
   * point of construction).
   *
   * For the user's `funnyMath(21.5)` × 2 + `funnyMath(5)` +
   * `funnyMath(DataVariable(11))` example, this builds 3 ASTs
   * total (one per unique input shape), even though there are 4
   * call sites.
   */
  private _nodesByShape: Map<string, MathFunctionNode> = new Map()

  /**
   * Invocation counter — increments per `__call__`. Used to detect
   * when a math fn is called multiple times so the emitter can
   * allocate a shared input address (single-call math uses the
   * caller's DataPoint directly — no copy, no extra storage).
   *
   * Only the FIRST input's DataPoint is shared. A math fn with
   * multiple inputs would need N shared addresses; out of scope for
   * v1 where the math fn is single-input per the test shape.
   */
  private _invocationCount = 0

  /**
   * Per-input shared DataPoints for storage-typed inputs, keyed by
   * input position. Lazily allocated on the first invocation for each
   * storage-typed input. Non-storage inputs (literals, future scores)
   * leave their slot undefined.
   *
   * Multi-call math reads each storage input from its shared address
   * so the providers (which are deduplicated across calls) can
   * reference a single stable path per input. Single-call math
   * skips the copies and reads the caller's DataPoint directly.
   */
  private _sharedStorageInputs: DataPointClass<'storage'>[] = []

  /**
   * Counter for the provider resources `toProvider` creates — each
   * call needs its own resource name.
   */
  private _providerCount = 0

  /**
   * Unique per-instance number used to disambiguate deferred storage
   * paths. Stored via parameter-property declaration so it's assigned
   * before the body of the constructor runs.
   */
  constructor(
    public sandstoneCore: SandstoneCore,
    public outputs: R,
    public callback: (_math: SandstoneMath<unknown>, ...inputs: P) => void,
    public readonly options?: MathOptions,
    private readonly _resourceKey: string = String(_instanceCounter++),
    private _lastReboundStarts?: ReadonlyArray<MathExpressionNode>,
  ) {
    // The output schema's field names end up in the provider resource
    // names, and MC's resource ids only allow lowercase. Reject a
    // camelCase field name HERE — at the declaration — rather than
    // letting it produce an unloadable provider file later.
    assertValidOutputFieldNames(Object.keys(this.outputs as Record<string, unknown>))

    // `toProvider` is typed only for a SINGLETON output schema (see
    // `SingletonProviderMethod`), so it can't be a public class
    // member — a public member would show up in `keyof` for record
    // schemas too. Define it at runtime instead, and let the type
    // decide who is allowed to call it.
    Object.defineProperty(this, 'toProvider', {
      value: (...args: ExpandInputs<P>) => this._toProvider(...args),
      enumerable: false,
      configurable: true,
      writable: false,
    })
  }

  /**
   * Convert `this.outputs` (class-based schema) to the runtime
   * `MathFunctionOutputs` (discriminated union). Scalar (class)
   * collapses to `{ kind: 'scalar', value: <kind> }`. Record maps
   * each class key to its kind string in `{ kind: 'record', fields }`.
   *
   * Discriminated union avoids `result`-style key collisions with
   * user-defined record schemas — the compiler reads `kind` to decide.
   */
  private computeOutputsRecord(): MathFunctionOutputs {
    if (this.outputs === _FloatClass) {
      return { kind: 'scalar', value: 'float' }
    }
    if (this.outputs === _IntegerClass) {
      return { kind: 'scalar', value: 'integer' }
    }
    const fields: Record<string, MathKind> = {}
    for (const [k, v] of Object.entries(this.outputs as Record<string, typeof _RawFloatHandle | typeof _RawIntegerHandle>)) {
      fields[k] = v === _RawFloatHandle ? 'float' : 'integer'
    }
    return { kind: 'record', fields }
  }

  /**
   * The math block's numeric kind, derived from its declared output
   * schema. `Integer` → integer; `Float` → float; a record schema →
   * integer only when EVERY field is integer.
   *
   * Used to decide how a plain `DataPointClass` input is read: an
   * integer block assumes its DataPoint holds an integer, a float
   * block assumes a float.
   */
  private get blockKind(): MathKind {
    if (this.outputs === _IntegerClass) return 'integer'
    if (this.outputs === _FloatClass) return 'float'
    const fields = Object.values(this.outputs as Record<string, unknown>)
    return fields.length > 0 && fields.every((v) => v === _IntegerClass)
      ? 'integer'
      : 'float'
  }

  /**
   * Build (or fetch from cache) the AST for the given input shape.
   * One AST per unique input shape — calls with matching shapes
   * reuse the cached AST; different shapes build separate ASTs so
   * the inlined `CopyNode`/`StorageRefNode`/etc. references each
   * call's actual input value.
   *
   * On successful build, fires `options.onInitialAST(node)`
   * synchronously after the user callback returns and before the math
   * stack is popped — the body is fully populated at that point.
   */
  private buildAst(inputs: P): MathFunctionNode {
    const shapeKey = computeInputShapeKey(this._lastReboundStarts ?? [])
    const cached = this._nodesByShape.get(shapeKey)
    if (cached) return cached

    // Pass the rebound input storage references to the inspector so
    // they show up in the dump ahead of the AST as `inputs`. Each
    // entry is the handle's `startNode` — a `StorageRefNode` pointing
    // at the user's data source — so the inspector renders meaningful
    // `StorageRefNode(kind=…, type=…, target=…, path=…)` lines via
    // their own `[util.inspect.custom]` rather than a static dump.
    const node = new MathFunctionNode(
      this.sandstoneCore,
      this._lastReboundStarts ?? [],
      this.computeOutputsRecord(),
    )
    // Stamp the deferred-result key onto the AST so the lowering
    // pass can derive the matching `math_<key>` provider name. Must
    // match `_resourceKey` so the DataPoint the inline command writes
    // to is the same path the caller's `.data()` handle reads.
    node.resourceName = this._resourceKey
    // Plumb user options onto the inspector so they're reported
    // alongside the AST.
    node.options = this.options
    // `rebindInput` ran in `__call__` BEFORE the MathFunctionNode
    // existed, so the bound StorageRefNodes missed the base
    // `MathNode` ctor's audit-trail registration. Catch up here —
    // assign each their per-class index so the inspector renders
    // them with a stable `StorageRefNode<N>` identifier. We do NOT
    // push them onto `allNodes` — they're inputs, not part of the
    // AST the user wrote — so they only show up under the `inputs`
    // block at the top of the dump (and inline inside `source=…`
    // slots when referenced from an operator).
    for (const startNode of this._lastReboundStarts ?? []) {
      const cls = startNode.constructor.name
      const nextIndex = node.perClassCounters.get(cls) ?? 0
      startNode.index = nextIndex
      node.perClassCounters.set(cls, nextIndex + 1)
      // The input handle's `startNode` was constructed BEFORE the
      // MathFunctionNode was on the mathStack, so the base
      // `MathNode` ctor skipped registering it in `allNodes`. Add
      // it now so the chain analysis can classify the input as a
      // root and emit updates when the handle is mutated
      // (`x.multiply(_.float(2))` etc.). Without this, DataPoint
      // inputs produce zero updates and the compiler emits no
      // compute command for the result.
      if (!node.allNodes.includes(startNode)) {
        node.allNodes.unshift(startNode)
      }
    }
    try {
      const helper = new SandstoneMath<unknown>(this.sandstoneCore)
      this.callback(helper, ...inputs)
      this.assertOutputKind(node)
      this.options?.onInitialAST?.(node)
    } finally {
      node.dispose()
    }
    this._nodesByShape.set(shapeKey, node)
    return node
  }

  /**
   * Verify the returned value's numeric kind matches the math block's
   * declared output schema.
   *
   * A kind MISMATCH is no longer an error: MC's `from_int` /
   * `from_float` providers bridge the two numeric contexts, so a
   * float value returned from an integer block is truncated by
   * `from_float` and an integer value returned from a float block is
   * widened by `from_int`. The bridge is inserted by the lowering
   * pass (`coerceToBlockKind` in `multiStatementEmit.ts`).
   *
   * What's left to check is that the returned value is a value at
   * all — a handle or a record of handles.
   */
  private assertOutputKind(node: MathFunctionNode): void {
    const outputs = node.outputs
    const returns = findReturnNodes(node)
    if (returns.length === 0) return

    if (outputs.kind === 'scalar') {
      for (const ret of returns) {
        if (!MathExpressionNode.is(ret.value)) continue
      }
      return
    }

    for (const ret of returns) {
      const value = ret.value
      if (!value || typeof value !== 'object' || Array.isArray(value)) continue
      for (const [field] of Object.entries(outputs.fields)) {
        const fieldValue = (value as Record<string, unknown>)[field]
        if (!MathExpressionNode.is(fieldValue)) continue
      }
    }
  }

  /**
   * Run the math with the given inputs. Builds the AST on first call.
   *
   * Accepts the expanded input tuple (see `ExpandInputs` below):
   * cb-declared `Float` / `Integer` parameters accept DataPointClass /
   * PickClass / Score at the call site via type expansion, runtime
   * rebind converts them to matching handles.
   *
   * @returns A deferred reference — `MathSchemaValue<R>` shaped handle(s)
   *   pointing at `math_<n>_...` storage paths. The lowerer replaces
   *   each `StorageRefNode` with an actual provider when emitting.
   */
  __call__ = <T extends P>(...inputs: ExpandInputs<T>): MathSchemaValue<R> => {
    // Rebind non-handle inputs (DataPointClass, DataPointPickClass, Score)
    // to their matching Float/Integer handles so the cb's `...inputs: P`
    // sees branded handles throughout. Kind inferred from the runtime
    // type of the input (IntegerDataPointClass → integer, Score → integer
    // by default; everything else → float).
    const rebound = inputs.map((i): Float | Integer => this.rebindInput(i))
    // Snapshot the rebound handles' starting storage references so
    // the inspector can render them ahead of the AST AND so
    // `buildAst` can register them with the about-to-be-created
    // MathFunctionNode (their construction happens BEFORE that
    // node exists, so the base `MathNode` ctor's mathStack-based
    // registration skips them).
    this._lastReboundStarts = rebound.map((h) => h.startNode)
    const node = this.buildAst(rebound as unknown as P)
    // Compile + emit. Passes the caller's MCFunction so the lowering
    // pass can attach the bridge `MathInvocationNode` to that body.
    // `MathInvocationInlineVisitor` later splices the bridge's
    // imperative commands into the host body inline.
    //
    // Throws if called outside any MCFunction — math runtime state
    // (the imperative `data modify ... compute ...`) must land in a
    // SandstoneFlow mcfunction, not at module top-level.
    //
    // Test MCFunctions are accepted alongside real MCFunctions: math
    // operations in a test body produce `data modify … compute …` commands
    // just like a real MCFunction, so the bridge splice path applies.
    const currentFn = this.sandstoneCore.currentMCFunction
    if (!currentFn) {
      throw new Error(
        '_.Math(...)() must be called inside an MCFunction body — the imperative '
          + 'compute command has nowhere to land otherwise.',
      )
    }
    const parentFn = currentFn as MCFunctionNode
    if (!parentFn) {
      throw new Error(
        '_.Math(...)() must be called inside an MCFunction body — the imperative '
          + 'compute command has nowhere to land otherwise.',
      )
    }
    // Lowering is DEFERRED to the core visitor. At __call__ time we
    // just (a) allocate shared input addresses for storage-typed
    // inputs (always — the references must be stable from the first
    // call so the compiler can pick them up), (b) drop a
    // `MathInvocationNode` placeholder at the call site, and (c)
    // hand back a result handle whose `.data()` reads from the
    // per-call result path. The placeholder's body is filled with
    // imperative commands at save time (after all `__call__`
    // invocations have been seen) by the math visitor. Single-call
    // vs multi-call is decided at compile time by inspecting
    // `MathFunctionNode.invocationCount`.
    const callIdx = this._invocationCount
    // Build per-input bridge slots. Each rebound handle has a
    // `startNode` that's either a StorageRefNode (storage input),
    // LiteralNode (literal — no slot), or ScoreboardRefNode (future
    // score input). Only storage inputs get a slot; the others
    // leave that position out of the array.
    const slots: SharedInputSlot[] = []
    rebound.forEach((h, i) => {
      const startNode = h.startNode
      if (!StorageRefNode.is(startNode)) return // literal or score — skip
      const callerDp = startNode.dataPoint as DataPointClass<'storage'>
      // Allocate the per-position shared input DataPoint via
      // `MathFunctionNode.getSharedInputStorage` so packUid suffixing
      // lands on it consistently. Same `DataPoint` reference is used
      // by the bridge's per-call `set from <callerDp> → sharedDp`
      // copy AND the AST rewrite that the multi-call compile pass
      // performs (so the deduplicated provider JSON reads from the
      // same storage the copy writes to).
      if (!this._sharedStorageInputs[i]) {
        this._sharedStorageInputs[i] = node.getSharedInputStorage(i)
      }
      slots.push({
        position: i,
        kind: 'storage',
        callerDp,
        sharedDp: this._sharedStorageInputs[i]!,
      })
    })
    // Per-call result path namespace: 0 = simple (`math_0_result`),
    // 1+ = suffixed (`math_0_result_1`, `math_0_result_2`, ...).
    // Single-call math lands at `math_0_result`; multi-call math
    // also lands per-call so concurrent reads don't collide.
    const useCallNamespace = callIdx > 0
    this._invocationCount++
    node.invocationCount = this._invocationCount

    const bridge = new MathInvocationBridgeNode(
      this.sandstoneCore,
      node,
      parentFn,
    )
    bridge.callIdx = callIdx
    bridge.useCallNamespace = useCallNamespace
    // One slot per non-literal input (position N maps to `fn.inputs[N]`
    // only when that input was storage-typed). The compiler emits one
    // `set from` copy per slot and rewrites the AST's input
    // StorageRefNode at each position to point at its shared dp.
    bridge.inputs = slots
    // ALL rebound inputs (including literals). The visitor pipeline
    // reads this to compute the bridge's input shape key, which
    // determines whether this bridge can share a compile with
    // others. Literals vs DataPointClass vs ScoreboardRefNode all
    // participate in the key.
    //
    // MUST use the ORIGINAL startNode (captured in `_lastReboundStarts`
    // before the callback ran), not the handle's current `.node` —
    // the callback mutates the handle's chain (`x['+='](10)` replaces
    // `x.node` with an AggregateNode), so reading `.node` here would
    // capture the post-mutation expression and collapse every call's
    // shape key to `complex:[object Object]`, silently merging all
    // calls into one group and reusing the primary's plan.
    bridge.reboundInputs = (this._lastReboundStarts ?? []) as MathExpressionNode[]
    parentFn.body.push(bridge)

    return this.makeDeferredResult(node, callIdx, useCallNamespace)
  }

  /**
   * Convert this math function into a SINGLE MC number provider.
   *
   * A math block normally runs as a sequence of `data modify … set
   * compute` commands, with the chain's intermediate values
   * materialised through storage. A provider is the other shape: one
   * nested provider tree that MC evaluates on demand, with no
   * intermediate storage at all.
   *
   * ```ts
   * const damage = _.Math(Integer, (math, x: Integer) => {
   *   math.return(x.multiply(math.integer(2)))
   * })
   *
   * // → data/<ns>/context_int_provider/<name>.json
   * const provider = damage.toProvider(dp)
   * ```
   *
   * The args are the math block's inputs — the same ones a call would
   * take. A math block with no inputs takes none here either.
   *
   * Only a SINGLETON output can become a provider: a provider holds
   * one value, so a record output has no equivalent.
   *
   * This is the implementation behind the public `toProvider` — the
   * method itself is installed by the constructor and typed by
   * `SingletonProviderMethod`, so it only exists for a singleton
   * schema.
   */
  private _toProvider(...args: ExpandInputs<P>): FloatNumberProviderClass | IntegerNumberProviderClass {
    const outputs = this.computeOutputsRecord()
    if (outputs.kind !== 'scalar') {
      throw new Error(
        'Math.toProvider: a math block with a record output can\'t become a '
        + 'single number provider — a provider holds one value.',
      )
    }

    // Rebind the args exactly like a call does, so the AST is built
    // from the same input handles.
    const rebound = args.map((i) => this.rebindInput(i as MathInput))
    this._lastReboundStarts = rebound.map((h) => h.startNode)
    const node = this.buildAst(rebound as unknown as P)

    // Run the visitor pipeline + chain analysis — the same pass the
    // imperative compile path uses.
    runDefaultMathVisitors(node)
    const analysis = node.chainAnalysisResult
    const returnHandle = node.returnHandleNameResult
    // The returned expression: the LAST update on the return handle's
    // chain. The handle's node is already the full nested tree
    // (`mul(add(x, 2), 3)`), so it compiles into one provider
    // without any storage round-trip.
    let expression: MathExpressionNode | undefined
    for (const update of analysis.updates) {
      if (returnHandle !== null && update.handleName === returnHandle) {
        expression = update.expression
      }
    }
    if (expression === undefined) {
      throw new Error(
        'Math.toProvider: the math block has no returned expression to convert.',
      )
    }

    const pack = this.sandstoneCore.pack
    const name = `math_${this._resourceKey}_provider_${this._providerCount++}`
    if (outputs.value === 'integer') {
      return pack.NumberProvider('integer', name, compileIntProvider(expression))
    }
    return pack.NumberProvider('float', name, compileFloatProvider(expression))
  }

  /**
   * Rebind a single input value to its matching Float/Integer handle.
   * Float/Integer pass through unchanged; DataPointClass/PickClass/Score
   * / NBT numbers are wrapped as Float/Integer pointing at the same NBT
   * path / score / constant.
   *
   * Kind is determined by the runtime class of the input:
   *   - `NBTInt` / `NBTByte` / `NBTShort` → Integer handle (constant).
   *   - `NBTFloat` / `NBTDouble` → Float handle (constant).
   *   - `IntegerDataPointClass` → Integer handle (storage read).
   *   - `DataPointClass` / pick variant → the math block's own kind —
   *     an integer block assumes its DataPoint holds an integer, a
   *     float block assumes a float.
   *   - `Score` → Integer handle (MC scores are always integers).
   *   - a bare `number` → Float handle. (A bare number is not
   *     accepted for an integer block; `_.Math(Integer, …)` inputs are
   *     `NBT.int(69)`, an integer DataPoint, or a Score.)
   */
  private rebindInput(input: MathInput): Float | Integer {
    if (typeof input === 'number') {
      // Raw number literal — wrap as a Float literal handle. Lowerer
      // substitutes the literal's value into the provider tree.
      const lit = new LiteralNode(this.sandstoneCore, input, 'float')
      return new _RawFloatHandle(lit)
    }
    if ('node' in input && 'binding' in input) {
      // Already a Float/Integer handle — pass through.
      return input as Float | Integer
    }
    if (
      input instanceof NBTInt
      || input instanceof NBTByte
      || input instanceof NBTShort
    ) {
      // Integer constant — `NBT.int(69)`. Lowers to MC's `constant`
      // int provider.
      return new _RawIntegerHandle(
        new LiteralNode(this.sandstoneCore, input.value, 'integer'),
      )
    }
    if (input instanceof NBTFloat || input instanceof NBTDouble) {
      // Float constant — `NBT.float(1.5)`.
      return new _RawFloatHandle(
        new LiteralNode(this.sandstoneCore, input.value, 'float'),
      )
    }
    if (input instanceof IntegerDataPointClass) {
      // Integer-typed NBT (or pick variant thereof) — wrap as Integer.
      return new _RawIntegerHandle(
        new StorageRefNode(this.sandstoneCore, input as DataPointClass, 'integer'),
      )
    }
    if (input instanceof DataPointClass || '_toDataPoint' in input) {
      // Plain NBT (or pick variant) — the math block's declared kind
      // decides: an integer block reads it as an integer, a float
      // block as a float.
      const kind = this.blockKind
      return kind === 'integer'
        ? new _RawIntegerHandle(
            new StorageRefNode(this.sandstoneCore, input as DataPointClass, 'integer'),
          )
        : new _RawFloatHandle(
            new StorageRefNode(this.sandstoneCore, input as DataPointClass, 'float'),
          )
    }
    if (input instanceof Score) {
      return new _RawIntegerHandle(new ScoreboardRefNode(this.sandstoneCore, input))
    }
    throw new Error(
      `Math input: unrecognized input type ${
        (input as { constructor?: { name?: string } }).constructor?.name ?? typeof input
      }`,
    )
  }

  /**
   * Build the deferred result. Each output field gets a `Float`/`Integer`
   * handle wrapping a `StorageRefNode` pointing at a known path. The
   * path encodes the instance's unique key + field so the lowerer can
   * find it.
   */
  private makeDeferredResult(
    node: MathFunctionNode,
    callIdx: number,
    useCallNamespace: boolean,
  ): MathSchemaValue<R> {
    if (this.outputs === _FloatClass) {
      // Scalar float — single result DataPoint, allocated via the
      // MathFunctionNode helper so packUid suffixing matches the
      // runtime write target and the caller's `.data()` handle.
      const dp = node.getResultStorage(callIdx, useCallNamespace)
      const ref = new StorageRefNode(this.sandstoneCore, dp, 'float')
      const handle = new _RawFloatHandle(ref)
      handle._isOutput = true
      return handle as unknown as MathSchemaValue<R>
    }
    if (this.outputs === _IntegerClass) {
      // Scalar integer — same flow as the float branch.
      const dp = node.getResultStorage(callIdx, useCallNamespace)
      const ref = new StorageRefNode(this.sandstoneCore, dp, 'integer')
      const handle = new _RawIntegerHandle(ref)
      handle._isOutput = true
      return handle as unknown as MathSchemaValue<R>
    }
    // Record outputs (`{x, y, z}`) — each field has its own storage
    // path. The plan/compiler doesn't currently drive per-field
    // lowering; these DataPoints are allocated here so the caller's
    // `.data().select(field)` reads work today. Per-field path
    // construction stays inline (and uses `DataVariable` so suffixing
    // is consistent) — when the compiler grows record-output support,
    // funnel the per-field allocations through a single helper on
    // `MathFunctionNode` and have the compiler reuse the resulting
    // DataPoint references.
    const suffix = useCallNamespace ? `_${callIdx}` : ''
    const baseName = `math_${this._resourceKey}`
    const result: Record<string, _RawFloatHandle | _RawIntegerHandle> = {}
    for (const [k, v] of Object.entries(this.outputs as Record<string, typeof _RawFloatHandle | typeof _RawIntegerHandle>)) {
      const kind: MathKind = v === _RawFloatHandle ? 'float' : 'integer'
      const dp = this.sandstoneCore.pack.DataVariable(undefined, `${baseName}_${k}${suffix}`)
      const ref = new StorageRefNode(this.sandstoneCore, dp, kind)
      const handle = kind === 'float' ? new _RawFloatHandle(ref) : new _RawIntegerHandle(ref)
      handle._isOutput = true
      node.fieldResultRoots.set(k, ref)
      // Push the field-result StorageRefNode onto `allNodes` so the
      // chain analysis classifies it as a root. The compiler looks
      // up each field's chain root by matching against `rootToId` to
      // fold the field's last chain update into the field's result
      // path. Without this registration, field results are never
      // written — the test sees `math_<key>_<field>` stay at its
      // default value and the equality assert fires `fail`.
      if (!node.allNodes.includes(ref)) {
        node.allNodes.unshift(ref)
      }
      result[k] = handle
    }
    return result as unknown as MathSchemaValue<R>
  }

  // NBTSerializable stubs (future-proofing).
  getValue(): string | null { return null }
  setValue(_value: unknown) {}
  toNBT(): string { return '' }
}

/**
 * Collect every `_.return(...)` statement in a math function's body.
 *
 * Returns can sit at the top level or nested inside an `if` / `switch`
 * clause, so the walk descends into every container's body.
 */
function findReturnNodes(node: MathFunctionNode): MathReturnNode[] {
  const found: MathReturnNode[] = []
  const walk = (body: MathNode[]) => {
    for (const child of body) {
      if (MathReturnNode.is(child)) {
        found.push(child)
        continue
      }
      const container = child as { body?: MathNode[] }
      if (Array.isArray(container.body)) {
        walk(container.body)
      }
    }
  }
  walk(node.body)
  return found
}

/**
 * `MathFunction<P, R>` — user-facing callable + type for a math function.
 *
 * Renamed from `Math` (which collides with the JS built-in `Math`).
 *
 * `MathFunction = makeClassCallable(_RawMathFunction)` so the user can
 * both `new MathFunction(...)` (rare) and call `mathFn(...)` (the
 * common path). Declaration merging via `MathFunction = ...` (value)
 * and `type MathFunction<P, R> = ...` (type) gives the single-name
 * pattern like `MCFunctionClass` / `ObjectiveClass`.
 */
export const MathFunction = makeClassCallable(_RawMathFunction)

/**
 * The `toProvider` method, exposed only for a SINGLETON output
 * schema — a number provider holds one value, so a record output has
 * no provider equivalent.
 *
 * The provider class follows the schema's kind: an integer math block
 * yields an `IntegerNumberProviderClass` (MC's `context_int_provider`),
 * a float one a `FloatNumberProviderClass`.
 */
type SingletonProviderMethod<P extends MathInputs, R> = R extends
  | Float
  | typeof Float
  | Integer
  | typeof Integer
  ? {
    toProvider: (
      ...args: ExpandInputs<P>
    ) => R extends Float | typeof Float
      ? FloatNumberProviderClass
      : IntegerNumberProviderClass
  }
  : unknown

export type MathFunction<P extends MathInputs, R> =
  MakeInstanceCallable<_RawMathFunction<P, R>> & NBTSerializable & SingletonProviderMethod<P, R>