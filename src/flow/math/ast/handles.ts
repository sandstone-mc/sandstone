import type { DataPointClass } from '../../../variables/Data'
import type { DataPointPickClass } from '../../../core/Macro'
import type { Score } from '../../../variables/Score'
import type { SandstoneCore } from '../../../core/sandstoneCore'
import type { BindingScope } from './BindingScope'
import type { MathKind } from './MathExpressionNode'
import { MathExpressionNode } from './MathExpressionNode'
import { BinaryOpNode, AggregateNode, UnaryOpNode, ArcSineNode, ArcCosineNode } from './nodes/operators'
import { LiteralNode } from './nodes/leaves'
import { CopyNode } from './nodes/leaves'
import { StorageRefNode } from './nodes/leaves'
import { ScoreboardRefNode } from './nodes/leaves'
import { compare } from './nodes/conditions'
import type { ComparisonConditionNode } from './nodes/conditions'

/**
 * Handle wrapping a `MathExpressionNode` so user code can chain operations
 * without touching the AST directly.
 *
 * Branding: each handle carries a `kind` (`'float'` or `'integer'`) and a
 * private symbol that prevents cross-kind mixing (a `FloatHandle` is not
 * assignable to an `IntegerHandle`, even though both wrap the same node
 * type at runtime).
 *
 * **Mutability model**: `rx.add(5).multiply(2)` reads as
 * `rx = ((rx + 5) * 2)` — operator methods mutate `rx` in place and
 * return `this` for chaining. Each mutation allocates a fresh expression
 * node and swaps it into `this.node`, then syncs the change to the
 * binding scope via `_link`/`setNode`. The handle carries a back-ref to
 * its scope set by `BindingScope.define`; unbound handles (no scope
 * link) mutate silently — fine for throwaway intermediates.
 *
 * The mutable model is the one the Math.ts placeholder API expects
 * (`add(...): this`). The previous immutable design was wrong for the
 * actual user-visible surface.
 */
declare const FloatBrand: unique symbol
declare const IntegerBrand: unique symbol

interface FloatBranded {
  readonly [FloatBrand]: true
}
interface IntegerBranded {
  readonly [IntegerBrand]: true
}

abstract class BaseHandle {
  /** Mutable: operator methods replace this on each mutation. */
  abstract node: MathExpressionNode

  abstract readonly kind: MathKind

  /** Back-ref to the binding scope, set by `BindingScope.define`. */
  binding: { scope: BindingScope; name: string } | null = null

  /** Internal — `BindingScope.define` calls this to establish the link. */
  _link(scope: BindingScope, name: string): void {
    this.binding = { scope, name }
  }

  /**
   * Replace the wrapped expression node AND propagate to the binding
   * scope. Used by all mutating operator methods.
   */
  setNode(node: MathExpressionNode): void {
    this.node = node
    this.binding?.scope._update(this.binding.name, this as unknown as Float | Integer)
  }
}

/**
 * Float-typed handle.
 *
 * `add`/`multiply` are variadic (MC's `add`/`mul` accept an `inputs`
 * array). `subtract`/`divide`/`modulo` are binary. Mixing Float and
 * Integer operands in `add`/`multiply` is allowed; the lowerer inserts
 * implicit `from_int` providers to homogenize kinds.
 */
export class _RawFloatHandle extends BaseHandle implements FloatBranded {
  readonly [FloatBrand] = true as const

  override node: MathExpressionNode

  readonly kind: MathKind = 'float'

  constructor(node: MathExpressionNode) {
    super()
    this.node = node
  }

  add(value: Float | Integer): this
  add(values: (Float | Integer)[]): this
  add(...values: (Float | Integer)[]): this
  add(...args: [Float | Integer | (Float | Integer)[]] | (Float | Integer)[]) {
    const inputs = args.flat().map(handleToExpr)
    this.setNode(new AggregateNode(this.node.sandstoneCore, 'add', [this.node, ...inputs]))
    return this
  }

  subtract(value: Float | Integer): this {
    this.setNode(new BinaryOpNode(this.node.sandstoneCore, 'sub', [this.node, handleToExpr(value)]))
    return this
  }

  multiply(value: Float | Integer): this
  multiply(values: (Float | Integer)[]): this
  multiply(...values: (Float | Integer)[]): this
  multiply(...args: [Float | Integer | (Float | Integer)[]] | (Float | Integer)[]) {
    const inputs = args.flat().map(handleToExpr)
    this.setNode(new AggregateNode(this.node.sandstoneCore, 'mul', [this.node, ...inputs]))
    return this
  }

  divide(value: Float | Integer): this {
    this.setNode(new BinaryOpNode(this.node.sandstoneCore, 'div', [this.node, handleToExpr(value)]))
    return this
  }

  modulo(value: Float | Integer): this {
    this.setNode(new BinaryOpNode(this.node.sandstoneCore, 'mod', [this.node, handleToExpr(value)]))
    return this
  }

  // Sugar: `rx['*='](scale)` ≡ `rx.multiply(scale)`.
  // Overload order matters: `number` first so TS picks it for numeric
  // literals (otherwise the `Float | Integer` overload wins by order
  // and TS reports a brand-conflict error).
  ['*='](value: number): this
  ['*='](value: Float | Integer): this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ['*='](value: Float | Integer | number): this {
    return this.multiply(value as Float | Integer)
  }

  ['+='](value: number): this
  ['+='](value: Float | Integer): this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ['+='](value: Float | Integer | number): this {
    return this.add(value as Float | Integer)
  }

  ['-='](value: number): this
  ['-='](value: Float | Integer): this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ['-='](value: Float | Integer | number): this {
    return this.subtract(value as Float | Integer)
  }

  ['/='](value: number): this
  ['/='](value: Float | Integer): this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ['/='](value: Float | Integer | number): this {
    return this.divide(value as Float | Integer)
  }

  ['%='](value: Float | Integer): this
  ['%='](value: number): this
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ['%='](value: Float | Integer | number): this {
    return this.modulo(value as Float | Integer)
  }

  negate(): this {
    this.setNode(new UnaryOpNode(this.node.sandstoneCore, 'negate', this.node))
    return this
  }

  abs(): this {
    this.setNode(new UnaryOpNode(this.node.sandstoneCore, 'abs', this.node))
    return this
  }

  ceil(): this {
    this.setNode(new UnaryOpNode(this.node.sandstoneCore, 'ceil', this.node))
    return this
  }

  floor(): this {
    this.setNode(new UnaryOpNode(this.node.sandstoneCore, 'floor', this.node))
    return this
  }

  round(): this {
    this.setNode(new UnaryOpNode(this.node.sandstoneCore, 'round', this.node))
    return this
  }

  truncate(): this {
    this.setNode(new UnaryOpNode(this.node.sandstoneCore, 'truncate', this.node))
    return this
  }

  sqrt(): this {
    this.setNode(new UnaryOpNode(this.node.sandstoneCore, 'sqrt', this.node))
    return this
  }

  sin(): this {
    this.setNode(new UnaryOpNode(this.node.sandstoneCore, 'sin', this.node))
    return this
  }

  cos(): this {
    this.setNode(new UnaryOpNode(this.node.sandstoneCore, 'cos', this.node))
    return this
  }

  // arcSine / arcCosine: no MC provider exists. Polyfill TBD — AST nodes
  // exist so the API surface is stable; lowering throws until a polyfill
  // is written (likely a storage-based Newton's method requiring an
  // mcfunction).
  arcSine(): this {
    this.setNode(new ArcSineNode(this.node.sandstoneCore, this.node))
    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  arcCosine(): this {
    this.setNode(new ArcCosineNode(this.node.sandstoneCore, this.node))
    return this
  }

  // Comparison — returns a `MathConditionNode`. The lowering pass decides
  // whether this folds inline into a `number_dispatcher` case, or
  // branches to an mcfunction (see `nodes/conditions.ts` for the
  // agnostic lowering contract).
  // Overload order matters: `number` first so numeric literals resolve
  // to the loose overload (the branded `Float | Integer` overload wins
  // otherwise and TS reports a brand-conflict error).
  ['=='](other: number): ComparisonConditionNode
  ['=='](other: Float | Integer): ComparisonConditionNode
  ['=='](other: Float | Integer | number): ComparisonConditionNode {
    return this.equals(other)
  }

  /**
   * `equals(value)` — primary comparison entry point. `['==']` sugar
   * delegates here. Accepts `number`, `Float`, `Integer`, or any
   * combination (cross-kind compare is allowed; the lowerer inserts
   * implicit `from_int`/`from_float`).
   */
  equals(other: number | Float | Integer): ComparisonConditionNode {
    return compare(this.node.sandstoneCore, '==', this, other as Float | Integer)
  }
}

/**
 * Integer-typed handle. Same mutability contract as Float.
 * `divide(value, floored=true)` uses `floor_div` / `floor_mod` for the
 * integer-compatible lowering (matches the placeholder's optional
 * second arg).
 */
export class _RawIntegerHandle extends BaseHandle implements IntegerBranded {
  readonly [IntegerBrand] = true as const

  override node: MathExpressionNode

  readonly kind: MathKind = 'integer'

  constructor(node: MathExpressionNode) {
    super()
    this.node = node
  }

  add(value: Integer): this
  add(values: Integer[]): this
  add(...values: Integer[]): this
  add(...args: [Integer | Integer[]] | Integer[]) {
    const inputs = args.flat().map(handleToExpr)
    this.setNode(new AggregateNode(this.node.sandstoneCore, 'add', [this.node, ...inputs]))
    return this
  }

  subtract(value: Integer): this {
    this.setNode(new BinaryOpNode(this.node.sandstoneCore, 'sub', [this.node, handleToExpr(value)]))
    return this
  }

  multiply(value: Integer): this
  multiply(values: Integer[]): this
  multiply(...values: Integer[]): this
  multiply(...args: [Integer | Integer[]] | Integer[]) {
    const inputs = args.flat().map(handleToExpr)
    this.setNode(new AggregateNode(this.node.sandstoneCore, 'mul', [this.node, ...inputs]))
    return this
  }

  divide(value: Integer, floored = true): this {
    const op = floored ? 'floor_div' : 'div'
    this.setNode(new BinaryOpNode(this.node.sandstoneCore, op, [this.node, handleToExpr(value)]))
    return this
  }

  modulo(value: Integer, floored = true): this {
    const op = floored ? 'floor_mod' : 'mod'
    this.setNode(new BinaryOpNode(this.node.sandstoneCore, op, [this.node, handleToExpr(value)]))
    return this
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ['*='](value: Integer | number): this
  ['*='](value: number): this {
    return this.multiply(value as unknown as Integer)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ['+='](value: Integer | number): this
  ['+='](value: number): this {
    return this.add(value as unknown as Integer)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ['-='](value: Integer | number): this
  ['-='](value: number): this {
    return this.subtract(value as unknown as Integer)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ['/='](value: Integer | number, floored?: boolean): this
  ['/='](value: number, floored?: boolean): this {
    return this.divide(value as unknown as Integer, floored)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ['%='](value: Integer | number, floored?: boolean): this
  ['%='](value: number, floored?: boolean): this {
    return this.modulo(value as unknown as Integer, floored)
  }

  negate(): this {
    this.setNode(new UnaryOpNode(this.node.sandstoneCore, 'negate', this.node))
    return this
  }

  abs(): this {
    this.setNode(new UnaryOpNode(this.node.sandstoneCore, 'abs', this.node))
    return this
  }

  // Comparison — returns a `MathConditionNode` (agnostic of how it is
  // evaluated). Same lowering contract as the Float variant.
  ['=='](other: number): ComparisonConditionNode
  ['=='](other: Integer): ComparisonConditionNode
  ['=='](other: Integer | number): ComparisonConditionNode {
    return this.equals(other)
  }

  /** `equals(value)` — primary comparison entry point. `['==']` delegates here. */
  equals(other: number | Float | Integer): ComparisonConditionNode {
    if (typeof other === 'number') {
      throw new Error('IntegerHandle["=="]: wrap literals via _.integer(...) first')
    }
    return compare(this.node.sandstoneCore, '==', this, other)
  }
}

function handleToExpr(h: Float | Integer | number): MathExpressionNode {
  if (typeof h === 'number') {
    throw new Error('handleToExpr(number): wrap literals via _.float(...) / _.integer(...) first')
  }
  return h.node
}

// ---------------------------------------------------------------------------
// Constructors — produce handles from raw inputs.
// ---------------------------------------------------------------------------

/**
 * `_.float(5)` — raw literal. Uses `LiteralNode` (no kind at
 * construction). The compiler picks the NBT tag based on the owning
 * handle's kind — for `FloatHandle` it's a float tag (`5.0d`); for
 * `IntegerHandle` it's an int tag (`5b`/`5s`/`5`/`5L`). Width selection
 * (byte/short/int/long vs float/double) is the lowerer's call too.
 */
export function floatFromLiteral(core: SandstoneCore, value: number): Float {
  return new _RawFloatHandle(new LiteralNode(core, value))
}

export function integerFromLiteral(core: SandstoneCore, value: number): Integer {
  return new _RawIntegerHandle(new LiteralNode(core, value))
}

/**
 * `_.float(x)` where `x` is already a `Float` — snapshot copy.
 *
 * Returns a NEW independent `FloatHandle` whose root expression is a
 * `CopyNode` pointing at `x.node` at copy time. The copy and the
 * original diverge at their roots on first mutation: the copy's `add`/
 * `subtract`/etc. allocate fresh expression nodes, replacing its own
 * root; the original's mutations replace its own root. Neither
 * subsequent mutation reaches across the boundary (root-level
 * independence — see `CopyNode` JSDoc for the subexpression-sharing
 * caveat).
 */
export function floatFromFloat(core: SandstoneCore, source: Float): Float {
  void core
  return new _RawFloatHandle(new CopyNode(source.node.sandstoneCore, source.node))
}

export function integerFromInteger(core: SandstoneCore, source: Integer): Integer {
  void core
  return new _RawIntegerHandle(new CopyNode(source.node.sandstoneCore, source.node))
}

export function floatFromScore(core: SandstoneCore, score: Score): Float {
  // Score is int; widen to float via implicit `from_float` at lower time.
  // The handle itself just wraps the score ref; the lowerer inserts
  // `from_float` when serializing this node into provider JSON.
  void core
  void score
  throw new Error('floatFromScore: TODO — needs from_float widening on lower')
}

export function integerFromScore(core: SandstoneCore, score: Score): Integer {
  return new _RawIntegerHandle(new ScoreboardRefNode(core, score))
}

export function floatFromDataPoint(core: SandstoneCore, dp: DataPointClass | DataPointPickClass): Float {
  return new _RawFloatHandle(new StorageRefNode(core, dp as DataPointClass, 'float'))
}

export function integerFromDataPoint(core: SandstoneCore, dp: DataPointClass | DataPointPickClass): Integer {
  return new _RawIntegerHandle(new StorageRefNode(core, dp as DataPointClass, 'integer'))
}

// ---------------------------------------------------------------------------
// Factory functions — wrap any `MathExpressionNode` in a branded handle
// without exposing the underlying class. Lets `Math.ts` helpers build
// handles from AST nodes without `new FloatHandle(...)` / `new IntegerHandle(...)`
// or `as Float` / `as Integer` casts at call sites. The brand cast
// happens once here.
// ---------------------------------------------------------------------------

/** Wrap a `MathExpressionNode` in a `FloatHandle` typed as `Float`. */
export function float(core: SandstoneCore, node: MathExpressionNode): Float {
  void core
  return new _RawFloatHandle(node) as Float
}

/** Wrap a `MathExpressionNode` in an `IntegerHandle` typed as `Integer`. */
export function integer(core: SandstoneCore, node: MathExpressionNode): Integer {
  void core
  return new _RawIntegerHandle(node) as Integer
}

/**
 * Branch on `kind` and dispatch to `float()` or `integer()`. Lets
 * helpers return the right handle without explicit casts at the call
 * site.
 */
export function handleFromKind(
  core: SandstoneCore,
  node: MathExpressionNode,
  kind: MathKind,
): Float | Integer {
  return kind === 'float' ? float(core, node) : integer(core, node)
}

// ---------------------------------------------------------------------------
// User-facing exports — `Float` and `Integer` exist as both value
// (the class itself) and type (branded instance). Same dual-export
// pattern as `ObjectiveClass`. Declared AFTER the raw class definitions
// so the `const Float = _RawFloatHandle` binding is forward-referenced.
// ---------------------------------------------------------------------------

/**
 * `Float` — exposed as both value (the class) and type (branded
 * instance). Mirrors `ObjectiveClass` style. Users can:
 *   - annotate: `x: Float`
 *   - reference the class: `Float.is(node)` (static type guard on the class)
 *   - use as a constructor in tests if needed (not the user-facing path)
 */
export const Float = _RawFloatHandle
export type Float = _RawFloatHandle & FloatBranded

/**
 * `Integer` — exposed as both value and type (mirror of `Float`).
 */
export const Integer = _RawIntegerHandle
export type Integer = _RawIntegerHandle & IntegerBranded