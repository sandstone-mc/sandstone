import type { Float, Integer } from './handles'
import { Float as _FloatClass, Integer as _IntegerClass, _RawFloatHandle, _RawIntegerHandle } from './handles'
import { DataPointClass, IntegerDataPointClass } from '../../../variables/Data'
import { Score } from '../../../variables/Score'
import type { MathFunctionOutputs } from './MathFunctionNode'
import { MathFunctionNode } from './MathFunctionNode'
import { LiteralNode, ScoreboardRefNode } from './nodes/leaves'
import type { SandstoneCore } from '../../../core/sandstoneCore'
import type { MathKind } from './MathExpressionNode'
import { makeClassCallable } from '../../../utils'
import type { MakeInstanceCallable } from '../../../utils'
import type { NBTSerializable } from '../../../arguments'
import type { MathSchemaValue } from '../../math/Math'
import { SandstoneMath } from '../../math/Math'
import { StorageRefNode } from './nodes/leaves'
import { DataPointPickClass } from 'sandstone/core'

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
   * Unique per-instance number used to disambiguate deferred storage
   * paths. Stored via parameter-property declaration so it's assigned
   * before the body of the constructor runs.
   */
  constructor(
    public sandstoneCore: SandstoneCore,
    public outputs: R,
    public callback: (_math: SandstoneMath<unknown>, ...inputs: P) => void,
    private readonly _resourceKey: string = String(_instanceCounter++),
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
   */
  private buildAst(inputs: P): void {
    if (this.node) return
    this.node = new MathFunctionNode(this.sandstoneCore, this.computeOutputsRecord())
    try {
      const helper = new SandstoneMath<unknown>(this.sandstoneCore)
      this.callback(helper, ...inputs)
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
    this.buildAst(rebound as unknown as P)
    return this.makeDeferredResult()
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
  private makeDeferredResult(): MathSchemaValue<R> {
    const baseName = `math_${this._resourceKey}`
    if (this.outputs === _FloatClass) {
      const dp = this.sandstoneCore.pack.DataVariable(undefined, `${baseName}_result`)
      const ref = new StorageRefNode(this.sandstoneCore, dp, 'float')
      const handle = new _RawFloatHandle(ref)
      handle._isOutput = true
      return handle as unknown as MathSchemaValue<R>
    }
    if (this.outputs === _IntegerClass) {
      const dp = this.sandstoneCore.pack.DataVariable(undefined, `${baseName}_result`)
      const ref = new StorageRefNode(this.sandstoneCore, dp, 'integer')
      const handle = new _RawIntegerHandle(ref)
      handle._isOutput = true
      return handle as unknown as MathSchemaValue<R>
    }
    const result: Record<string, _RawFloatHandle | _RawIntegerHandle> = {}
    for (const [k, v] of Object.entries(this.outputs as Record<string, typeof _RawFloatHandle | typeof _RawIntegerHandle>)) {
      const kind: MathKind = v === _RawFloatHandle ? 'float' : 'integer'
      const dp = this.sandstoneCore.pack.DataVariable(undefined, `${baseName}_${k}`)
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