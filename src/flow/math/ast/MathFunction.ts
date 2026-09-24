import type { Float, Integer } from './handles'
import { Float as _FloatClass, Integer as _IntegerClass, _RawFloatHandle, _RawIntegerHandle } from './handles'
import type { MathFunctionOutputs } from './MathFunctionNode'
import { MathFunctionNode } from './MathFunctionNode'
import type { SandstoneCore } from '../../../core/sandstoneCore'
import type { MathKind } from './MathExpressionNode'
import { makeClassCallable } from '../../../utils'
import type { MakeInstanceCallable } from '../../../utils'
import type { NBTSerializable } from '../../../arguments'
import type { MathSchemaValue } from '../../math/Math'
import { SandstoneMath } from '../../math/Math'
import { StorageRefNode } from './nodes/leaves'

/**
 * Runtime shape of the input tuple `_.Math` accepts. An array of
 * `Float | Integer` handles, one per input param of the callback.
 */
type MathInputs = readonly (Float | Integer)[]

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
class _RawMathFunction<P extends MathInputs, R>
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
   * @returns A deferred reference — `MathSchemaValue<R>` shaped handle(s)
   *   pointing at `math_<n>_...` storage paths. The lowerer replaces
   *   each `StorageRefNode` with an actual provider when emitting.
   */
  __call__ = (...inputs: P): MathSchemaValue<R> => {
    this.buildAst(inputs)
    return this.makeDeferredResult()
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
      return new _RawFloatHandle(ref) as unknown as MathSchemaValue<R>
    }
    if (this.outputs === _IntegerClass) {
      const dp = this.sandstoneCore.pack.DataVariable(undefined, `${baseName}_result`)
      const ref = new StorageRefNode(this.sandstoneCore, dp, 'integer')
      return new _RawIntegerHandle(ref) as unknown as MathSchemaValue<R>
    }
    const result: Record<string, _RawFloatHandle | _RawIntegerHandle> = {}
    for (const [k, v] of Object.entries(this.outputs as Record<string, typeof _RawFloatHandle | typeof _RawIntegerHandle>)) {
      const kind: MathKind = v === _RawFloatHandle ? 'float' : 'integer'
      const dp = this.sandstoneCore.pack.DataVariable(undefined, `${baseName}_${k}`)
      const ref = new StorageRefNode(this.sandstoneCore, dp, kind)
      result[k] = kind === 'float' ? new _RawFloatHandle(ref) : new _RawIntegerHandle(ref)
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