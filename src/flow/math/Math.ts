import type { SandstoneCore } from '../../core/sandstoneCore'
import { DataPointClass } from 'sandstone/variables/Data'
import { DataPointPickClass } from 'sandstone/core/Macro'
import { Score } from 'sandstone/variables/Score'
import {
  CopyNode,
  EnchantmentLevelNode,
  EnvironmentAttributeNode,
  isNBTNumericOperand,
  LiteralNode,
  nbtOperandKind,
  nbtOperandToLiteral,
  PickNode,
  RandomNode,
  ScoreboardRefNode,
  StorageRefNode,
} from './ast/nodes/leaves'
import type { NBTNumericOperand } from './ast/nodes/leaves'
import {
  AggregateNode,
  ArcCosineNode,
  ArcSineNode,
  BinaryOpNode,
  UnaryOpNode,
  type AggregateOp,
  type BinaryOp,
  type UnaryOp,
} from './ast/nodes/operators'
import {
  float as floatFromNode,
  floatFromDataPoint,
  floatFromFloat,
  floatFromLiteral,
  floatFromNBT,
  floatFromScore,
  handleFromKind,
  handleFromNBT,
  handleToExpr,
  integerFromDataPoint,
  integerFromFloat,
  integerFromInteger,
  integerFromLiteral,
  integerFromNBT,
  integerFromScore,
  Float,
  Integer,
} from './ast/handles'
import type { FloatOperand } from './ast/handles'
import type { MathExpressionNode, MathKind } from './ast/MathExpressionNode'
import { MathConditionNode } from './ast/MathConditionNode'
import {
  andOf,
  notOf,
  orOf,
} from './ast/nodes/conditions'
import {
  MathElseNode,
  MathIfNode,
  MathLoopNode,
  MathReturnNode,
} from './ast/nodes/control'
import type { MathCaseValue } from './ast/nodes/control'
import { MathFunctionNode, type MathFunctionOutputs } from './ast/MathFunctionNode'
import { MathIfStatement, MathIfReturnOnlyStatement } from './ast/MathIfStatement'
import { snapshotMathValue } from './ast/nodes/control'
import {
  MathSwitchStatement,
  executeMathSwitchTuple,
  type MathSwitchCaseTuple,
} from './ast/MathSwitchStatement'

// ---------------------------------------------------------------------------
// User-facing handle aliases.
//
// The placeholder Math.ts exported `class Float { ... }` and
// `class Integer { ... }` as stubs. The real handles live in
// `ast/handles.ts` — `FloatHandle` and `IntegerHandle`. Re-exported
// under the short names (`Float`, `Integer`) so user code keeps the
// placeholder surface.
// ---------------------------------------------------------------------------

export { Float, Integer }

// ---------------------------------------------------------------------------
// Output schema for `_.Math<R>(outputs, callback)`.
//
// (MathOutputsSchema is defined near the top of the file alongside
// the `_Math<R>` type alias.)
// ---------------------------------------------------------------------------

/**
 * `mathFunction<R>(core, outputs, callback)` — generic entry point.
 * Creates a `MathFunctionNode`, runs the callback (populating the AST),
 * disposes, returns the node for the lowerer.
 *
 * Most callers go through `Flow.Math<R>(schema, cb)` on the outer `_`
 * rather than calling this directly. Kept exported for testability.
 */
export function mathFunction<R>(
  sandstoneCore: SandstoneCore,
  outputs: R,
  callback: () => void,
): MathFunctionNode {
  // Convert class-based schema to the discriminated `MathFunctionOutputs`.
  // Scalar `typeof Float` / `typeof Integer` → `{ kind: 'scalar', value: ... }`.
  // Record → `{ kind: 'record', fields: { key: kind, ... } }`.
  // Discriminated union avoids `result`-style key collisions with
  // user-defined record schemas.
  let schema: MathFunctionOutputs
  if (outputs === Float) {
    schema = { kind: 'scalar', value: 'float' }
  } else if (outputs === Integer) {
    schema = { kind: 'scalar', value: 'integer' }
  } else {
    const fields: Record<string, 'float' | 'integer'> = {}
    for (const [k, v] of Object.entries(outputs as Record<string, typeof Float | typeof Integer>)) {
      fields[k] = v === Float ? 'float' : 'integer'
    }
    schema = { kind: 'record', fields }
  }

  const fn = new MathFunctionNode(sandstoneCore, undefined, schema)
  try {
    callback()
  } finally {
    fn.dispose()
  }
  return fn
}

// ---------------------------------------------------------------------------
// SandstoneMath — user surface. Mirrors the placeholder shape.
// ---------------------------------------------------------------------------

/**
 * `MathOutputsSchema` is the TS type the user passes as the first arg
 * to `_.Math(schema, cb)`.
 *
 * The kind markers are the `Float` and `Integer` *classes* (also
 * exposed as types via declaration merging). Three shapes:
 *   - Scalar: `typeof Float` (scalar float) or `typeof Integer` (scalar int)
 *   - Record: `{ x: typeof Float, y: typeof Integer, ... }` — one
 *     provider resource per key, with the key's kind given by the class type
 *
 * `Float` and `Integer` as values (the classes) are the kind markers —
 * no string `'float'` / `'integer'` forms leak into the user-facing API.
 * Internally the compiler converts to MC kind strings.
 *
 * Threaded through the generic `R` of `SandstoneMath<R>` / `_Math<R>` so
 * `return<V extends R>(value)` constrains the value to match.
 */
export type MathOutputsSchema =
  | typeof Float
  | typeof Integer
  | { readonly [K: string]: typeof Float | typeof Integer }

/**
 * Extract the value type from a schema. Scalar `typeof Float` → `Float`.
 * Scalar `typeof Integer` → `Integer`. Record → exact per-field mapping
 * `{ [K in keyof R]: R[K] extends typeof Float ? Float : R[K] extends typeof Integer ? Integer }`.
 *
 * The exact-key mapping catches excess properties at the call site
 * (TS's structural excess-property check fires on literal → mapped
 * type assignment). Wider `Float | Integer` fields would let
 * `_.return({f: rx, y, z})` slip through with extra `f`.
 *
 * Used to derive the `return` overloads — e.g., `return(value: R)`
 * where R is the record form becomes
 * `return<V extends R>(value: V)`.
 */
export type MathSchemaValue<R> =
  R extends Float | typeof Float ? Float :
  R extends Integer | typeof Integer ? Integer :
  R extends Record<string, typeof Float | typeof Integer | Float | Integer>
    ? { [K in keyof R]: R[K] extends typeof Float | Float ? Float : R[K] extends typeof Integer | Integer ? Integer : never }
    : never

/**
 * The generic schema type passed as `R` to `SandstoneMath<R>` /
 * `_Math<R>`. Defaults to the broadest schema (any record) so non-
 * generic usages still compile.
 */
export type _Math<R = MathOutputsSchema> = SandstoneMath<R>

/**
 * `SandstoneMath<R>` — the user-facing math helper, generic over the
 * outputs schema `R`.
 *
 * When `R` is concrete (e.g., `{x: 'float', y: 'float', z: 'float'}`),
 * TS constrains `return<V extends R>(value: V)` so the user's
 * `_.return({x, y, z})` matches the schema. Typos like
 * `_.return({x, y, foo})` fail at compile time.
 *
 * When `R` is unconstrained (default), the constraints loosen — the
 * non-generic `SandstoneMath` still works for ad-hoc usage.
 *
 * Implementation note: most methods are type-hacks on top of the
 * non-generic behavior. The `R` is a phantom — it flows through
 * `.if`/`.elseIf`/`.else`/`.return` chains via generic wrappers but
 * has no runtime effect on the AST.
 */
export class SandstoneMath<R = MathOutputsSchema> {
  constructor(public sandstoneCore: SandstoneCore) {}

  // -------------------------------------------------------------------------
  // Constructors.
  // -------------------------------------------------------------------------

  float(init: number | Float | Score | DataPointClass | DataPointPickClass | NBTNumericOperand = 0): Float {
    if (typeof init === 'number') return floatFromLiteral(this.sandstoneCore, init)
    if (isNBTNumericOperand(init)) return floatFromNBT(this.sandstoneCore, init)
    if (init instanceof Score) return floatFromScore(this.sandstoneCore, init)
    if (init instanceof DataPointClass || (init as { constructor?: { name?: string } }).constructor?.name === 'DataPointPickClass') {
      return floatFromDataPoint(this.sandstoneCore, init as DataPointClass | DataPointPickClass)
    }
    return floatFromFloat(this.sandstoneCore, init as Float)
  }

  integer(init: number | Integer | Float | Score | DataPointClass | DataPointPickClass | NBTNumericOperand = 0): Integer {
    if (typeof init === 'number') return integerFromLiteral(this.sandstoneCore, init)
    if (isNBTNumericOperand(init)) return integerFromNBT(this.sandstoneCore, init)
    if (init instanceof Score) return integerFromScore(this.sandstoneCore, init)
    if (init instanceof DataPointClass || init instanceof DataPointPickClass) {
      return integerFromDataPoint(this.sandstoneCore, init)
    }
    // A float read in the integer context is TRUNCATED toward zero —
    // exactly what MC's `from_float` provider does.
    if (init.kind === 'float') return integerFromFloat(this.sandstoneCore, init)
    return integerFromInteger(this.sandstoneCore, init)
  }

  // -------------------------------------------------------------------------
  // Aggregates — always produce fresh intermediates (don't mutate inputs).
  // -------------------------------------------------------------------------

  sum(values: Float[]): Float
  sum(...values: Float[]): Float
  sum(values: Integer[]): Integer
  sum(...values: Integer[]): Integer
  sum(values: (Float | Integer | NBTNumericOperand)[]): Float
  sum(...values: (Float | Integer | NBTNumericOperand)[]): Float
  sum(values: (Float | Integer | NBTNumericOperand)[], result: 'float'): Float
  sum(values: (Float | Integer | NBTNumericOperand)[], result: 'integer'): Integer
  sum(...args: ((Float | Integer | NBTNumericOperand)[] | Float | Integer | NBTNumericOperand | 'float' | 'integer')[]): any {
    return aggregate(this.sandstoneCore, 'add', args, 'float', 'add')
  }

  product(values: Float[]): Float
  product(...values: Float[]): Float
  product(values: Integer[]): Integer
  product(...values: Integer[]): Integer
  product(values: (Float | Integer | NBTNumericOperand)[]): Float
  product(...values: (Float | Integer | NBTNumericOperand)[]): Float
  product(values: (Float | Integer | NBTNumericOperand)[], result: 'float'): Float
  product(values: (Float | Integer | NBTNumericOperand)[], result: 'integer'): Integer
  product(...args: ((Float | Integer | NBTNumericOperand)[] | Float | Integer | NBTNumericOperand | 'float' | 'integer')[]): any {
    return aggregate(this.sandstoneCore, 'mul', args, 'float', 'mul')
  }

  average(values: Float[]): Float
  average(...values: Float[]): Float
  average(values: Integer[]): Integer
  average(...values: Integer[]): Integer
  average(values: (Float | Integer | NBTNumericOperand)[]): Float
  average(...values: (Float | Integer | NBTNumericOperand)[]): Float
  average(values: (Float | Integer | NBTNumericOperand)[], result: 'float'): Float
  average(values: (Float | Integer | NBTNumericOperand)[], result: 'integer'): Integer
  average(...args: ((Float | Integer | NBTNumericOperand)[] | Float | Integer | NBTNumericOperand | 'float' | 'integer')[]): any {
    return aggregate(this.sandstoneCore, 'avg', args, 'float', 'avg')
  }

  // -------------------------------------------------------------------------
  // Binary operations — produce fresh intermediates.
  // -------------------------------------------------------------------------

  subtract(a: Float, b: Float | Integer | NBTNumericOperand): Float
  subtract(a: Integer, b: Float | Integer | NBTNumericOperand): Integer
  subtract(a: Float | Integer, b: Float | Integer | NBTNumericOperand): any {
    const op: BinaryOp = 'sub'
    if (a.kind === 'integer' && operandKindOf(b) === 'integer') {
      return binaryOp(this.sandstoneCore, op, a, b, 'integer')
    }
    return binaryOp(this.sandstoneCore, op, a, b, 'float')
  }

  add(values: Float[]): Float
  add(...values: Float[]): Float
  add(values: Integer[]): Integer
  add(...values: Integer[]): Integer
  add(values: (Float | Integer | NBTNumericOperand)[]): Float
  add(...values: (Float | Integer | NBTNumericOperand)[]): Float
  add(...args: ((Float | Integer | NBTNumericOperand)[] | Float | Integer | NBTNumericOperand)[]): Float | Integer {
    return aggregate(this.sandstoneCore, 'add', args, 'float', 'add')
  }

  multiply(values: Float[]): Float
  multiply(...values: Float[]): Float
  multiply(values: Integer[]): Integer
  multiply(...values: Integer[]): Integer
  multiply(values: (Float | Integer | NBTNumericOperand)[]): Float
  multiply(...values: (Float | Integer | NBTNumericOperand)[]): Float
  multiply(...args: ((Float | Integer | NBTNumericOperand)[] | Float | Integer | NBTNumericOperand)[]): Float | Integer {
    return aggregate(this.sandstoneCore, 'mul', args, 'float', 'mul')
  }

  divide(a: Float, b: Float | Integer | NBTNumericOperand): Float
  divide(a: Integer, b: Float | Integer | NBTNumericOperand, floored?: boolean): Integer
  divide(a: Float | Integer, b: Float | Integer | NBTNumericOperand, floored = true): any {
    const bothInt = a.kind === 'integer' && operandKindOf(b) === 'integer'
    const op: BinaryOp = bothInt && floored ? 'floor_div' : 'div'
    return binaryOp(this.sandstoneCore, op, a, b, bothInt ? 'integer' : 'float')
  }

  modulo(a: Float, b: Float | Integer | NBTNumericOperand): Float
  modulo(a: Integer, b: Float | Integer | NBTNumericOperand, floored?: boolean): Integer
  modulo(a: Float | Integer, b: Float | Integer | NBTNumericOperand, floored = true): any {
    const bothInt = a.kind === 'integer' && operandKindOf(b) === 'integer'
    const op: BinaryOp = bothInt && floored ? 'floor_mod' : 'mod'
    return binaryOp(this.sandstoneCore, op, a, b, bothInt ? 'integer' : 'float')
  }

  abs(value: Float): Float
  abs(value: Integer): Integer
  abs(value: Float | Integer | NBTNumericOperand): any {
    const v = this.unaryOperand(value)
    return unaryOp(this.sandstoneCore, 'abs', v, v.kind)
  }

  exponentiate(a: Float, b: Float | Integer | NBTNumericOperand): Float
  exponentiate(a: Integer, b: Float | Integer | NBTNumericOperand): Integer
  exponentiate(a: Float | Integer, b: Float | Integer | NBTNumericOperand): any {
    const op: BinaryOp = 'pow'
    const bKind = operandKindOf(b)
    return binaryOp(this.sandstoneCore, op, a, b, a.kind === 'float' || bKind === 'float' ? 'float' : 'integer')
  }

  sqrt(value: Float | NBTNumericOperand): Float {
    return unaryOp(this.sandstoneCore, 'sqrt', this.unaryOperand(value), 'float')
  }

  vectorLength(components: Float[]): Float
  vectorLength(...components: Float[]): Float
  vectorLength(components: (Float | Integer | NBTNumericOperand)[]): Float
  vectorLength(...components: (Float | Integer | NBTNumericOperand)[]): Float
  vectorLength(...args: ((Float | Integer | NBTNumericOperand)[] | Float | Integer | NBTNumericOperand)[]): any {
    return aggregate(this.sandstoneCore, 'length', args as never, 'float', 'length')
  }

  // -------------------------------------------------------------------------
  // Rounding — unary. Float-only per placeholder signature.
  // -------------------------------------------------------------------------

  ceil(value: Float | NBTNumericOperand): Float { return unaryOp(this.sandstoneCore, 'ceil', this.unaryOperand(value), 'float') }
  truncate(value: Float | NBTNumericOperand): Float { return unaryOp(this.sandstoneCore, 'truncate', this.unaryOperand(value), 'float') }
  round(value: Float | NBTNumericOperand): Float { return unaryOp(this.sandstoneCore, 'round', this.unaryOperand(value), 'float') }
  floor(value: Float | NBTNumericOperand): Float { return unaryOp(this.sandstoneCore, 'floor', this.unaryOperand(value), 'float') }

  // -------------------------------------------------------------------------
  // Trig — unary. Float-only. arcSine/arcCosine throw (polyfill gap).
  // -------------------------------------------------------------------------

  sine(angle: Float | NBTNumericOperand): Float { return unaryOp(this.sandstoneCore, 'sin', this.unaryOperand(angle), 'float') }
  arcSine(ratio: Float): Float {
    return floatFromNode(this.sandstoneCore, new ArcSineNode(this.sandstoneCore, ratio.node))
  }
  cosine(angle: Float | NBTNumericOperand): Float { return unaryOp(this.sandstoneCore, 'cos', this.unaryOperand(angle), 'float') }
  arcCosine(ratio: Float): Float {
    return floatFromNode(this.sandstoneCore, new ArcCosineNode(this.sandstoneCore, ratio.node))
  }

  // -------------------------------------------------------------------------
  // Utility ops.
  // -------------------------------------------------------------------------

  /**
   * `_.random(range, result)` — a uniform random value.
   *
   * The `result` argument picks the numeric kind, and the return type
   * follows it: an integer random yields an `Integer` handle (which
   * lowers to MC's `uniform` INT provider), a float one a `Float`.
   */
  random(range: { min?: Float | Integer | NBTNumericOperand; max?: Float | Integer | NBTNumericOperand }, result: 'integer'): Integer
  random(range?: { min?: Float | Integer | NBTNumericOperand; max?: Float | Integer | NBTNumericOperand }, result?: 'float'): Float
  random(
    range: { min?: Float | Integer | NBTNumericOperand; max?: Float | Integer | NBTNumericOperand } = {},
    result: 'float' | 'integer' = 'float',
  ): Float | Integer {
    const minNode = range.min ? operandNode(this.sandstoneCore, range.min) : undefined
    const maxNode = range.max ? operandNode(this.sandstoneCore, range.max) : undefined
    const node = new RandomNode(this.sandstoneCore, minNode, maxNode, result)
    return handleFromKind(this.sandstoneCore, node, node.kind)
  }

  /**
   * `_.pick(values)` — a weighted random pick. The picked values'
   * kind decides the result: integer values yield an `Integer` handle
   * (MC's `weighted_list` INT provider), float ones a `Float`.
   */
  pick(values: { value: Integer; weight: number | Float | NBTNumericOperand }[]): Integer
  pick(values: { value: Float; weight: number | Float | NBTNumericOperand }[]): Float
  pick(values: { value: Float | Integer | NBTNumericOperand; weight: number | Float | NBTNumericOperand }[]) {
    const entries = values.map((entry) => {
      const value = operandNode(this.sandstoneCore, entry.value)
      const weight = typeof entry.weight === 'number'
        ? entry.weight
        : operandNode(this.sandstoneCore, entry.weight)
      return { value, weight }
    })
    const node = new PickNode(this.sandstoneCore, entries)
    return handleFromKind(this.sandstoneCore, node, node.kind)
  }

  enchantmentLevel(): Float {
    // MC has no `enchantment_level` int provider — float only.
    return floatFromNode(this.sandstoneCore, new EnchantmentLevelNode(this.sandstoneCore))
  }

  environmentAttribute(): Float {
    // Float only — `IntegerEnvironmentAttribute` registry is `never` in
    // vanilla (no integer environment attributes are dispatchable).
    return floatFromNode(this.sandstoneCore, new EnvironmentAttributeNode(this.sandstoneCore))
  }

  // -------------------------------------------------------------------------
  // Flow control.
  // -------------------------------------------------------------------------

  if(condition: MathConditionNode, callback: () => void): MathIfStatement
  if(condition: MathConditionNode): MathIfReturnOnlyStatement
  if(condition: MathConditionNode, callback?: () => void): any {
    if (callback) {
      return new MathIfStatement(this.sandstoneCore, condition, callback)
    }
    // `_.if(cond)` with no body — the RETURN-ONLY form. The clause
    // is created by the `.return(...)` that follows it; there's no
    // else chain (use the callback form for that).
    return new MathIfReturnOnlyStatement(this.sandstoneCore, condition)
  }

  and(...conditions: MathConditionNode[]): MathConditionNode
  and(conditions: MathConditionNode[]): MathConditionNode
  and(...args: MathConditionNode[] | [MathConditionNode[]]): MathConditionNode {
    const list = (args.length === 1 && Array.isArray(args[0]) ? args[0] : args) as MathConditionNode[]
    return andOf(this.sandstoneCore, list)
  }

  or(...conditions: MathConditionNode[]): MathConditionNode
  or(conditions: MathConditionNode[]): MathConditionNode
  or(...args: MathConditionNode[] | [MathConditionNode[]]): MathConditionNode {
    const list = (args.length === 1 && Array.isArray(args[0]) ? args[0] : args) as MathConditionNode[]
    return orOf(this.sandstoneCore, list)
  }

  not(condition: MathConditionNode): MathConditionNode {
    return notOf(this.sandstoneCore, condition)
  }

  /**
   * Snapshot a value the user passed to `_.return(...)`: walk plain
   * records and pluck each handle's CURRENT `node` so the inspector
   * shows what was actually being set at the moment of the return,
   * not the final mutated state. Scalar / array / primitive values
   * pass through.
   */
  private snapshotValue(v: unknown): unknown {
    return snapshotMathValue(v)
  }

  /**
   * `_.return(value)` — append a return statement to the current clause.
   *
   * Schema-constrained via `MathSchemaValue<R>`:
   *   - R = `'float' | 'integer'` (scalar) → value is `Float | Integer`
   *   - R = `{x: 'float', y: 'float'}` (record) → value is `{x: Float, y: Float}`
   *
   * Typos in the record keys / wrong kinds fail at compile time.
   *
   * Each handle in the value is SNAPSHOTTED to its current `node` so the
   * inspector shows what was actually being set at this moment — `if`s
   * that fire early in the block see the early values, not the
   * final post-mutation state.
   */
  return(value: MathSchemaValue<R>) {
    const snap = this.snapshotValue(value) as Float | Integer | Record<string, Float | Integer>
    const ret = new MathReturnNode(this.sandstoneCore, snap)
    const stack = this.sandstoneCore.mathStack
    const top = stack[stack.length - 1] as { append?: (n: MathReturnNode) => void } | undefined
    if (top && typeof top.append === 'function') {
      top.append(ret)
      return
    }
    throw new Error('_.Math.return: must be called inside an `_.if`/`_.switch` body.')
  }

  while(condition: MathConditionNode, callback: () => void): MathLoopNode {
    return new MathLoopNode(this.sandstoneCore, { condition }, callback)
  }

  for(
    initial: number | Float | Integer | NBTNumericOperand,
    end: (iterator: Float | Integer) => MathConditionNode,
    iterate: (iterator: Float | Integer) => Float | Integer,
    callback: (iterator: Float | Integer | number | NBTNumericOperand, _continue: () => void) => unknown,
  ): MathLoopNode
  for(
    range: [start: number | Float | Integer | NBTNumericOperand, end: number | Float | Integer | NBTNumericOperand],
    type: 'iterate',
    callback: (iterator: Float | Integer, _continue: () => void) => unknown,
  ): MathLoopNode
  for(
    arg1: number | Float | Integer | NBTNumericOperand | [start: number | Float | Integer | NBTNumericOperand, end: number | Float | Integer | NBTNumericOperand],
    arg2: ((iterator: Float | Integer) => MathConditionNode) | 'iterate',
    arg3: ((iterator: Float | Integer) => Float | Integer) | ((iterator: Float | Integer, _continue: () => void) => unknown),
    arg4?: (iterator: Float | Integer, _continue: () => void) => unknown,
  ): MathLoopNode {
    if (arg2 === 'iterate' && Array.isArray(arg1)) {
      // Range form: `_.for([start, end], 'iterate', cb)`. Defaults: step
      // = `it['+='](1)`, end-condition = `it['=='](end)`.
      const range = arg1 as [number | Float | Integer | NBTNumericOperand, number | Float | Integer | NBTNumericOperand]
      const start = range[0]
      const end = range[1]
      const endHandle: Float | Integer = this.numericHandle(end)
      const cb = arg3 as (iterator: Float | Integer, _continue: () => void) => unknown
      const iterateFn = (it: Float | Integer): Float | Integer => it['+='](1)
      const stubIterator = this.float(0)
      const endFn = (it: Float | Integer): MathConditionNode => (it as Float)['=='](endHandle as Float)
      const condition = endFn(stubIterator as Float | Integer)
      return new MathLoopNode(
        this.sandstoneCore,
        { condition, initial: start, iterate: iterateFn, iterator: stubIterator },
        () => cb(stubIterator, () => {}),
      )
    }
    if (typeof arg2 === 'function') {
      // Explicit form: `_.for(initial, end, iterate, cb)`.
      const initial = arg1 as number | Float | Integer | NBTNumericOperand
      const cb = (arg4 ?? arg3) as (iterator: Float | Integer | number | NBTNumericOperand, _continue: () => void) => unknown
      const realIterate = arg3 as (iterator: Float | Integer) => Float | Integer
      const stubIterator: Float | Integer = this.numericHandle(initial)
      const condition = arg2(stubIterator)
      return new MathLoopNode(
        this.sandstoneCore,
        { condition, initial, iterate: realIterate, iterator: stubIterator },
        () => cb(initial, () => {}),
      )
    }
    throw new Error('_.Math.for: invalid arguments')
  }

  switch<ValueType extends Float | Integer>(
    value: ValueType,
    cases: MathSwitchCaseTuple[],
  ): MathSwitchStatement {
    const statement = executeMathSwitchTuple(this.sandstoneCore, value, cases)
    // Build the switch node now, so it lands in the math function's
    // body (the lowerer walks the body to find the branch structure).
    statement.finalize()
    return statement
  }

  case(value: MathCaseValue, callback: () => void) {
    return { __case: { value, callback } } as const
  }

  /**
   * A numeric value as a handle — an NBT primitive becomes a handle of
   * its OWN kind (the kind is intrinsic to the value), a bare number
   * becomes a float literal.
   */
  private numericHandle(value: number | Float | Integer | NBTNumericOperand): Float | Integer {
    if (typeof value === 'number') return this.float(value)
    if (isNBTNumericOperand(value)) return handleFromNBT(this.sandstoneCore, value)
    return value
  }

  /**
   * A unary operand as a handle — an NBT primitive becomes a handle of
   * its own kind, a handle passes through.
   */
  private unaryOperand(value: Float | Integer | NBTNumericOperand): Float | Integer {
    if (isNBTNumericOperand(value)) return handleFromNBT(this.sandstoneCore, value)
    return value
  }

  mcfunction(fn: unknown): Integer {
    throw new Error('_.Math.mcfunction: TODO — needs mcfunction-tracker flag plumbing.')
  }
}

// ---------------------------------------------------------------------------
// Internal helpers.
// ---------------------------------------------------------------------------

/**
 * Aggregate helper behind `_.add` / `_.sum` / `_.product` / `_.average`.
 *
 * Result kind — the numeric tower:
 *   - An explicit `'float'` / `'integer'` argument wins outright.
 *   - Otherwise, all-integer operands → `integer`; any float operand
 *     → `defaultKind` (the mixed-operand result kind, always `float`).
 *
 * The kind travels onto the `AggregateNode`, which is what the
 * provider compiler reads to pick MC's `context_int_provider` vs
 * `context_float_provider`.
 */
function aggregate(
  core: SandstoneCore,
  op: AggregateOp,
  args: unknown[],
  defaultKind: MathKind,
  _opName: string,
): Float | Integer {
  const flat: (Float | Integer | number | NBTNumericOperand)[] = []
  let explicitKind: MathKind | undefined
  for (const a of args) {
    if (a === 'float' || a === 'integer') {
      explicitKind = a
      continue
    }
    if (Array.isArray(a)) {
      for (const inner of a) {
        if (inner === 'float' || inner === 'integer') {
          explicitKind = inner
          continue
        }
        flat.push(inner as Float | Integer | number | NBTNumericOperand)
      }
      continue
    }
    flat.push(a as Float | Integer | number | NBTNumericOperand)
  }
  if (flat.length === 0) {
    throw new Error(`SandstoneMath.aggregate(${op}): no inputs provided.`)
  }
  // A bare number is a literal — it takes the aggregate's kind, and a
  // fractional one makes the aggregate float (the numeric tower). An
  // NBT primitive carries its own kind.
  const allInt = flat.every((v) => (typeof v === 'number' ? Number.isInteger(v) : operandKindOf(v) === 'integer'))
  const kind: MathKind = explicitKind ?? (allInt ? 'integer' : defaultKind)
  const inputs = flat.map((v) => handleToExpr(core, v, kind))
  return handleFromKind(core, new AggregateNode(core, op, inputs, kind), kind)
}

/**
 * The numeric kind a value contributes to the numeric tower.
 *
 * A bare number has no kind of its own — it takes the kind of the
 * context it's used in. A handle carries its own kind, and so does an
 * NBT primitive (`NBT.int(3)` is an integer, `NBT.float(2.5)` a float).
 */
function operandKindOf(value: Float | Integer | number | NBTNumericOperand): MathKind | undefined {
  if (typeof value === 'number') return undefined
  if (isNBTNumericOperand(value)) return nbtOperandKind(value)
  return value.kind
}

/**
 * A value as an expression node — a handle's own node, or a literal
 * for an NBT primitive.
 */
function operandNode(
  core: SandstoneCore,
  value: Float | Integer | NBTNumericOperand,
): MathExpressionNode {
  if (isNBTNumericOperand(value)) return nbtOperandToLiteral(core, value)
  return value.node
}

function binaryOp<K extends MathKind>(
  core: SandstoneCore,
  op: BinaryOp,
  a: Float | Integer,
  b: FloatOperand,
  resultKind: K,
): K extends 'float' ? Float : Integer {
  return handleFromKind(core, new BinaryOpNode(core, op, [a.node, handleToExpr(core, b, resultKind)], resultKind), resultKind) as K extends 'float' ? Float : Integer
}

function unaryOp<K extends MathKind>(
  core: SandstoneCore,
  op: UnaryOp,
  value: Float | Integer,
  resultKind: K,
): K extends 'float' ? Float : Integer {
  return handleFromKind(core, new UnaryOpNode(core, op, value.node), resultKind) as K extends 'float' ? Float : Integer
}
