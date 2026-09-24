import type { SandstoneCore } from '../../core/sandstoneCore'
import { DataPointClass } from 'sandstone/variables/Data'
import type { DataPointPickClass } from 'sandstone/core/Macro'
import { Score } from 'sandstone/variables/Score'
import {
  CopyNode,
  EnchantmentLevelNode,
  EnvironmentAttributeNode,
  LiteralNode,
  PickNode,
  RandomNode,
  ScoreboardRefNode,
  StorageRefNode,
} from './ast/nodes/leaves'
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
  floatFromScore,
  handleFromKind,
  integerFromDataPoint,
  integerFromInteger,
  integerFromLiteral,
  integerFromScore,
  Float,
  Integer,
} from './ast/handles'
import type { MathKind } from './ast/MathExpressionNode'
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
import { MathFunctionNode, type MathFunctionOutputs } from './ast/MathFunctionNode'
import { MathIfStatement } from './ast/MathIfStatement'
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

  const fn = new MathFunctionNode(sandstoneCore, schema)
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

  float(init: number | Float | Score | DataPointClass | DataPointPickClass = 0): Float {
    if (typeof init === 'number') return floatFromLiteral(this.sandstoneCore, init)
    if (init instanceof Score) return floatFromScore(this.sandstoneCore, init)
    if (init instanceof DataPointClass || (init as { constructor?: { name?: string } }).constructor?.name === 'DataPointPickClass') {
      return floatFromDataPoint(this.sandstoneCore, init as DataPointClass | DataPointPickClass)
    }
    return floatFromFloat(this.sandstoneCore, init as Float)
  }

  integer(init: number | Integer | Score | DataPointClass | DataPointPickClass = 0): Integer {
    if (typeof init === 'number') return integerFromLiteral(this.sandstoneCore, init)
    if (init instanceof Score) return integerFromScore(this.sandstoneCore, init)
    if (init instanceof DataPointClass || (init as { constructor?: { name?: string } }).constructor?.name === 'DataPointPickClass') {
      return integerFromDataPoint(this.sandstoneCore, init as DataPointClass | DataPointPickClass)
    }
    return integerFromInteger(this.sandstoneCore, init as Integer)
  }

  // -------------------------------------------------------------------------
  // Aggregates — always produce fresh intermediates (don't mutate inputs).
  // -------------------------------------------------------------------------

  sum(values: Float[]): Float
  sum(...values: Float[]): Float
  sum(values: Integer[]): Integer
  sum(...values: Integer[]): Integer
  sum(values: (Float | Integer)[]): Float
  sum(...values: (Float | Integer)[]): Float
  sum(values: (Float | Integer)[], result: 'float'): Float
  sum(values: (Float | Integer)[], result: 'integer'): Integer
  sum(...args: ((Float | Integer)[] | Float | Integer | 'float' | 'integer')[]): any {
    return aggregate(this.sandstoneCore, 'add', args, 'float', 'add')
  }

  product(values: Float[]): Float
  product(...values: Float[]): Float
  product(values: Integer[]): Integer
  product(...values: Integer[]): Integer
  product(values: (Float | Integer)[]): Float
  product(...values: (Float | Integer)[]): Float
  product(values: (Float | Integer)[], result: 'float'): Float
  product(values: (Float | Integer)[], result: 'integer'): Integer
  product(...args: ((Float | Integer)[] | Float | Integer | 'float' | 'integer')[]): any {
    return aggregate(this.sandstoneCore, 'mul', args, 'float', 'mul')
  }

  average(values: Float[]): Float
  average(...values: Float[]): Float
  average(values: Integer[]): Integer
  average(...values: Integer[]): Integer
  average(values: (Float | Integer)[]): Float
  average(...values: (Float | Integer)[]): Float
  average(values: (Float | Integer)[], result: 'float'): Float
  average(values: (Float | Integer)[], result: 'integer'): Integer
  average(...args: ((Float | Integer)[] | Float | Integer | 'float' | 'integer')[]): any {
    return aggregate(this.sandstoneCore, 'avg', args, 'float', 'avg')
  }

  // -------------------------------------------------------------------------
  // Binary operations — produce fresh intermediates.
  // -------------------------------------------------------------------------

  subtract(a: Float, b: Float | Integer): Float
  subtract(a: Integer, b: Float | Integer): Integer
  subtract(a: Float | Integer, b: Float | Integer): any {
    const op: BinaryOp = 'sub'
    if (a.kind === 'integer' && b.kind === 'integer') {
      return binaryOp(this.sandstoneCore, op, a, b, 'integer')
    }
    return binaryOp(this.sandstoneCore, op, a, b, 'float')
  }

  divide(a: Float, b: Float | Integer): Float
  divide(a: Integer, b: Float | Integer, floored?: boolean): Integer
  divide(a: Float | Integer, b: Float | Integer, floored = true): any {
    const op: BinaryOp = a.kind === 'integer' && b.kind === 'integer' && floored ? 'floor_div' : 'div'
    return binaryOp(this.sandstoneCore, op, a, b, a.kind === 'integer' && b.kind === 'integer' ? 'integer' : 'float')
  }

  modulo(a: Float, b: Float | Integer): Float
  modulo(a: Integer, b: Float | Integer, floored?: boolean): Integer
  modulo(a: Float | Integer, b: Float | Integer, floored = true): any {
    const op: BinaryOp = a.kind === 'integer' && b.kind === 'integer' && floored ? 'floor_mod' : 'mod'
    return binaryOp(this.sandstoneCore, op, a, b, a.kind === 'integer' && b.kind === 'integer' ? 'integer' : 'float')
  }

  abs(value: Float): Float
  abs(value: Integer): Integer
  abs(value: Float | Integer): any {
    return unaryOp(this.sandstoneCore, 'abs', value, value.kind)
  }

  exponentiate(a: Float, b: Float | Integer): Float
  exponentiate(a: Integer, b: Float | Integer): Integer
  exponentiate(a: Float | Integer, b: Float | Integer): any {
    const op: BinaryOp = 'pow'
    return binaryOp(this.sandstoneCore, op, a, b, a.kind === 'float' || b.kind === 'float' ? 'float' : 'integer')
  }

  sqrt(value: Float): Float {
    return unaryOp(this.sandstoneCore, 'sqrt', value, 'float')
  }

  vectorLength(components: Float[]): Float
  vectorLength(...components: Float[]): Float
  vectorLength(components: (Float | Integer)[]): Float
  vectorLength(...components: (Float | Integer)[]): Float
  vectorLength(...args: ((Float | Integer)[] | Float | Integer)[]): any {
    return aggregate(this.sandstoneCore, 'length', args as never, 'float', 'length')
  }

  // -------------------------------------------------------------------------
  // Rounding — unary. Float-only per placeholder signature.
  // -------------------------------------------------------------------------

  ceil(value: Float): Float { return unaryOp(this.sandstoneCore, 'ceil', value, 'float') }
  truncate(value: Float): Float { return unaryOp(this.sandstoneCore, 'truncate', value, 'float') }
  round(value: Float): Float { return unaryOp(this.sandstoneCore, 'round', value, 'float') }
  floor(value: Float): Float { return unaryOp(this.sandstoneCore, 'floor', value, 'float') }

  // -------------------------------------------------------------------------
  // Trig — unary. Float-only. arcSine/arcCosine throw (polyfill gap).
  // -------------------------------------------------------------------------

  sine(angle: Float): Float { return unaryOp(this.sandstoneCore, 'sin', angle, 'float') }
  arcSine(ratio: Float): Float {
    return floatFromNode(this.sandstoneCore, new ArcSineNode(this.sandstoneCore, ratio.node))
  }
  cosine(angle: Float): Float { return unaryOp(this.sandstoneCore, 'cos', angle, 'float') }
  arcCosine(ratio: Float): Float {
    return floatFromNode(this.sandstoneCore, new ArcCosineNode(this.sandstoneCore, ratio.node))
  }

  // -------------------------------------------------------------------------
  // Utility ops.
  // -------------------------------------------------------------------------

  random(
    range: { min?: Float | Integer; max?: Float | Integer } = {},
    result: 'float' | 'integer' = 'float',
  ): Float | Integer {
    const minNode = range.min ? (range.min as Float | Integer).node : undefined
    const maxNode = range.max ? (range.max as Float | Integer).node : undefined
    const node = new RandomNode(this.sandstoneCore, minNode, maxNode, result)
    return handleFromKind(this.sandstoneCore, node, node.kind)
  }

  pick(values: { value: Float; weight: number | Float }[] | { value: Integer; weight: number | Float }[]) {
    const entries = values.map((entry) => {
      const value = (entry.value as Float | Integer).node
      const weight = typeof entry.weight === 'number' ? entry.weight : (entry.weight as Float | Integer).node
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
  if(condition: MathConditionNode): MathIfStatement
  if(condition: MathConditionNode, callback?: () => void): any {
    if (callback) {
      return new MathIfStatement(this.sandstoneCore, condition, callback)
    }
    return new MathIfStatement(this.sandstoneCore, condition, () => {
      throw new Error('Math if without callback requires a body — use `_.if(cond, () => {...})`.')
    })
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
   * `_.return(value)` — append a return statement to the current clause.
   *
   * Schema-constrained via `MathSchemaValue<R>`:
   *   - R = `'float' | 'integer'` (scalar) → value is `Float | Integer`
   *   - R = `{x: 'float', y: 'float'}` (record) → value is `{x: Float, y: Float}`
   *
   * Typos in the record keys / wrong kinds fail at compile time.
   */
  return(value: MathSchemaValue<R>): void {
    void ({} as MathSchemaValue<R>)
    const ret = new MathReturnNode(this.sandstoneCore, value as unknown as Float | Integer | Record<string, Float | Integer>)
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
    initial: number | Float | Integer,
    end: (iterator: Float | Integer) => MathConditionNode,
    iterate: (iterator: Float | Integer) => Float | Integer,
    callback: (iterator: Float | Integer | number, _continue: () => void) => unknown,
  ): MathLoopNode
  for(
    range: [start: number | Float | Integer, end: number | Float | Integer],
    type: 'iterate',
    callback: (iterator: Float | Integer, _continue: () => void) => unknown,
  ): MathLoopNode
  for(
    arg1: number | Float | Integer | [start: number | Float | Integer, end: number | Float | Integer],
    arg2: ((iterator: Float | Integer) => MathConditionNode) | 'iterate',
    arg3: ((iterator: Float | Integer) => Float | Integer) | ((iterator: Float | Integer, _continue: () => void) => unknown),
    arg4?: (iterator: Float | Integer, _continue: () => void) => unknown,
  ): MathLoopNode {
    if (arg2 === 'iterate' && Array.isArray(arg1)) {
      // Range form: `_.for([start, end], 'iterate', cb)`. Defaults: step
      // = `it['+='](1)`, end-condition = `it['=='](end)`.
      const range = arg1 as [number | Float | Integer, number | Float | Integer]
      const start = range[0]
      const end = range[1]
      const endHandle: Float | Integer = typeof end === 'number' ? this.float(end) : end
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
      const initial = arg1 as number | Float | Integer
      const cb = (arg4 ?? arg3) as (iterator: Float | Integer | number, _continue: () => void) => unknown
      const realIterate = arg3 as (iterator: Float | Integer) => Float | Integer
      const stubIterator: Float | Integer = typeof initial === 'number' ? this.float(0) : initial
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
    return executeMathSwitchTuple(this.sandstoneCore, value, cases)
  }

  case(value: Float | Integer | number, callback: () => void) {
    return { __case: { value, callback } } as const
  }

  mcfunction(fn: unknown): Integer {
    void fn
    throw new Error('_.Math.mcfunction: TODO — needs mcfunction-tracker flag plumbing.')
  }
}

// ---------------------------------------------------------------------------
// Internal helpers.
// ---------------------------------------------------------------------------

function aggregate(
  core: SandstoneCore,
  op: AggregateOp,
  args: unknown[],
  defaultKind: MathKind,
  _opName: string,
): Float | Integer {
  void _opName
  const flat: (Float | Integer)[] = []
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
        flat.push(inner as Float | Integer)
      }
      continue
    }
    flat.push(a as Float | Integer)
  }
  if (flat.length === 0) {
    throw new Error(`SandstoneMath.aggregate(${op}): no inputs provided.`)
  }
  const allInt = flat.every((v) => v.kind === 'integer')
  const kind: MathKind = explicitKind ?? (allInt && defaultKind === 'integer' ? 'integer' : 'float')
  const inputs = flat.map((v) => v.node)
  return handleFromKind(core, new AggregateNode(core, op, inputs, kind), kind)
}

function binaryOp<K extends MathKind>(
  core: SandstoneCore,
  op: BinaryOp,
  a: Float | Integer,
  b: Float | Integer,
  resultKind: K,
): K extends 'float' ? Float : Integer {
  return handleFromKind(core, new BinaryOpNode(core, op, [a.node, b.node], resultKind), resultKind) as K extends 'float' ? Float : Integer
}

function unaryOp<K extends MathKind>(
  core: SandstoneCore,
  op: UnaryOp,
  value: Float | Integer,
  resultKind: K,
): K extends 'float' ? Float : Integer {
  return handleFromKind(core, new UnaryOpNode(core, op, value.node), resultKind) as K extends 'float' ? Float : Integer
}

// Reference unused-but-imported symbols so TS doesn't drop the import
// (some are kept for the AST surface even if not called here).
void MathIfNode
void MathElseNode
void StorageRefNode
void ScoreboardRefNode
void LiteralNode
void CopyNode