import type { Float, Integer } from './handles'
import { Float as _FloatClass, Integer as _IntegerClass, _RawFloatHandle, _RawIntegerHandle } from './handles'
import { DataPointClass, IntegerDataPointClass } from '../../../variables/Data'
import { Score } from '../../../variables/Score'
import type { MathFunctionOutputs } from './MathFunctionNode'
import { MathFunctionNode } from './MathFunctionNode'
import { LiteralNode, ScoreboardRefNode } from './nodes/leaves'
import type { SandstoneCore } from '../../../core/sandstoneCore'
import type { MathKind, MathExpressionNode } from './MathExpressionNode'
import { makeClassCallable } from '../../../utils'
import type { MakeInstanceCallable } from '../../../utils'
import type { NBTSerializable } from '../../../arguments'
import type { MathSchemaValue } from '../../math/Math'
import { SandstoneMath } from '../../math/Math'
import { StorageRefNode } from './nodes/leaves'
import { DataPointPickClass } from 'sandstone/core'
import { MathInvocationNode as MathInvocationBridgeNode } from '../compile/MathInvocationNode'

/**
 * Input types accepted by `Math.__call__(...inputs: P)`. Each non-handle
 * input (DataPointClass, DataPointPickClass, Score) gets rebound to the
 * matching Float/Integer handle at call time — TS narrows the parameter
 * type, runtime rebinds the value.
 *
 * `number` is intentionally NOT here — literal numbers must be wrapped
 * via `_.float()` / `_.integer()` first (runtime `rebindInput` throws).
 * Use the `MathInputs` array type at the call site for a tighter
 * signature.
 */
type MathInput = number | Float | Integer | DataPointClass | DataPointPickClass | Score

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
 */
type ExpandInputs<T> = {
  [K in keyof T]: T[K] extends Float
    ? Float | number | DataPointClass | DataPointPickClass | Score
    : T[K] extends Integer
      ? Integer | number | IntegerDataPointClass | Score
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
  public node: MathFunctionNode | undefined

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
  ) {}

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
   * Build the AST by running the user callback. Passes the actual
   * input handles so the body can reference them. Called once per
   * Math instance on first invocation; subsequent calls reuse the
   * cached AST.
   *
   * On successful first build, fires `options.onInitialAST(this.node)`
   * synchronously after the user callback returns and before the math
   * stack is popped — the body is fully populated at that point.
   */
  private buildAst(inputs: P): void {
    if (this.node) return
    // Pass the rebound input storage references to the inspector so
    // they show up in the dump ahead of the AST as `inputs`. Each
    // entry is the handle's `startNode` — a `StorageRefNode` pointing
    // at the user's data source — so the inspector renders meaningful
    // `StorageRefNode(kind=…, type=…, target=…, path=…)` lines via
    // their own `[util.inspect.custom]` rather than a static dump.
    this.node = new MathFunctionNode(
      this.sandstoneCore,
      (this._lastReboundStarts as ReadonlyArray<MathExpressionNode> | undefined) ?? [],
      this.computeOutputsRecord(),
    )
    // Stamp the deferred-result key onto the AST so the lowering
    // pass can derive the matching `math_<key>` provider name. Must
    // match `_resourceKey` so the DataPoint the inline command writes
    // to is the same path the caller's `.data()` handle reads.
    this.node.resourceName = this._resourceKey
    // Plumb user options onto the inspector so they're reported
    // alongside the AST.
    this.node.options = this.options as unknown as Record<string, unknown> | undefined
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
      const nextIndex = this.node.perClassCounters.get(cls) ?? 0
      startNode.index = nextIndex
      this.node.perClassCounters.set(cls, nextIndex + 1)
    }
    try {
      const helper = new SandstoneMath<unknown>(this.sandstoneCore)
      this.callback(helper, ...inputs)
      this.options?.onInitialAST?.(this.node)
    } finally {
      this.node.dispose()
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
    const rebound = (inputs as unknown as readonly MathInput[]).map(
      (i): Float | Integer => this.rebindInput(i),
    )
    // Snapshot the rebound handles' starting storage references so
    // the inspector can render them ahead of the AST AND so
    // `buildAst` can register them with the about-to-be-created
    // MathFunctionNode (their construction happens BEFORE that
    // node exists, so the base `MathNode` ctor's mathStack-based
    // registration skips them).
    this._lastReboundStarts = rebound.map(
      (h) => (h as unknown as { startNode: MathExpressionNode }).startNode,
    )
    this.buildAst(rebound as unknown as P)
    // Compile + emit. Passes the caller's MCFunction so the lowering
    // pass can attach the bridge `MathInvocationNode` to that body.
    // `MathInvocationInlineVisitor` later splices the bridge's
    // imperative commands into the host body inline.
    //
    // Throws if called outside any MCFunction — math runtime state
    // (the imperative `data modify ... compute ...`) must land in a
    // SandstoneFlow mcfunction, not at module top-level.
    const parentFn = this.sandstoneCore.currentMCFunction
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
    const slots: import('../compile/MathInvocationNode').SharedInputSlot[] = []
    rebound.forEach((h, i) => {
      const startNode = (h as unknown as { startNode: MathExpressionNode }).startNode
      if (!StorageRefNode.is(startNode)) return // literal or score — skip
      const callerDp = startNode.dataPoint as DataPointClass<'storage'>
      if (!this._sharedStorageInputs[i]) {
        this._sharedStorageInputs[i] = this.sandstoneCore.pack.DataVariable(
          undefined,
          `math_${this._resourceKey}_input_${i}`,
        )
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
    this.node!.invocationCount = this._invocationCount

    const bridge = new MathInvocationBridgeNode(
      this.sandstoneCore,
      this.node!,
      parentFn,
    )
    bridge.callIdx = callIdx
    bridge.useCallNamespace = useCallNamespace
    // One slot per non-literal input (position N maps to `fn.inputs[N]`
    // only when that input was storage-typed). The compiler emits one
    // `set from` copy per slot and rewrites the AST's input
    // StorageRefNode at each position to point at its shared dp.
    bridge.inputs = slots
    parentFn.body.push(bridge)

    return this.makeDeferredResult(callIdx, useCallNamespace)
  }

  /**
   * Rebind a single input value to its matching Float/Integer handle.
   * Float/Integer pass through unchanged; DataPointClass/PickClass/Score
   * are wrapped as Float/Integer pointing at the same NBT path / score.
   *
   * Kind is determined by the runtime class of the input:
   *   - `IntegerDataPointClass` → Integer handle
   *   - everything else (DataPointClass, StringDataPointClass, Score) →
   *     Float handle
   *
   * `number` literals are rejected — they must be wrapped via
   * `_.float()` / `_.integer()` first.
   */
  private rebindInput(input: MathInput): Float | Integer {
    if (typeof input === 'number') {
      // Raw number literal — wrap as a Float literal handle. Lowerer
      // substitutes the literal's value into the provider tree.
      const lit = new LiteralNode(this.sandstoneCore, input)
      return new _RawFloatHandle(lit)
    }
    if ('node' in input && 'binding' in input) {
      // Already a Float/Integer handle — pass through.
      return input as Float | Integer
    }
    if (input instanceof IntegerDataPointClass) {
      // Integer-typed NBT (or pick variant thereof) — wrap as Integer.
      return new _RawIntegerHandle(
        new StorageRefNode(this.sandstoneCore, input as DataPointClass, 'integer'),
      )
    }
    if (input instanceof DataPointClass || '_toDataPoint' in input) {
      // Float-typed NBT (or pick variant) — wrap as Float.
      return new _RawFloatHandle(
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
  private makeDeferredResult(callIdx: number, useCallNamespace: boolean): MathSchemaValue<R> {
    const suffix = useCallNamespace ? `_${callIdx}` : ''
    const baseName = `math_${this._resourceKey}`
    if (this.outputs === _FloatClass) {
      const dp = this.sandstoneCore.pack.DataVariable(undefined, `${baseName}_result${suffix}`)
      const ref = new StorageRefNode(this.sandstoneCore, dp, 'float')
      const handle = new _RawFloatHandle(ref)
      handle._isOutput = true
      return handle as unknown as MathSchemaValue<R>
    }
    if (this.outputs === _IntegerClass) {
      const dp = this.sandstoneCore.pack.DataVariable(undefined, `${baseName}_result${suffix}`)
      const ref = new StorageRefNode(this.sandstoneCore, dp, 'integer')
      const handle = new _RawIntegerHandle(ref)
      handle._isOutput = true
      return handle as unknown as MathSchemaValue<R>
    }
    const result: Record<string, _RawFloatHandle | _RawIntegerHandle> = {}
    for (const [k, v] of Object.entries(this.outputs as Record<string, typeof _RawFloatHandle | typeof _RawIntegerHandle>)) {
      const kind: MathKind = v === _RawFloatHandle ? 'float' : 'integer'
      const dp = this.sandstoneCore.pack.DataVariable(undefined, `${baseName}_${k}${suffix}`)
      const ref = new StorageRefNode(this.sandstoneCore, dp, kind)
      const handle = kind === 'float' ? new _RawFloatHandle(ref) : new _RawIntegerHandle(ref)
      handle._isOutput = true
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
export type MathFunction<P extends MathInputs, R> =
  MakeInstanceCallable<_RawMathFunction<P, R>> & NBTSerializable