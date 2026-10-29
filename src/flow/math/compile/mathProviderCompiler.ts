import type { DataPointClass } from '../../../variables/Data'
import { NBTFloat, NBTInt } from '../../../variables/nbt/NBTs'
import type { Score } from '../../../variables/Score'
import type { NamespacedString, NonEmptyString } from '../../../utils'
import type {
  JsonContextFloatProvider,
  JsonFloatRef,
} from '../../../arguments/generated/_json/data/number_provider/context_float.ts'
import type {
  JsonContextIntProvider,
  JsonIntRef,
} from '../../../arguments/generated/_json/data/number_provider/context_int.ts'
import type { MathExpressionNode } from '../ast/MathExpressionNode'
import { StorageRefNode, LiteralNode, CopyNode, RandomNode, ScoreboardRefNode } from '../ast/nodes/leaves'
import { BinaryOpNode, AggregateNode, UnaryOpNode } from '../ast/nodes/operators'
import { ConversionNode } from '../ast/nodes/conversion'
import type { BinaryOp } from '../ast/nodes/operators'

/**
 * Compile a math expression AST node into an MC number-provider JSON
 * tree.
 *
 * Two provider families exist, one per numeric kind:
 *
 *   - `minecraft:context_float_provider` — the float context.
 *   - `minecraft:context_int_provider` — the integer context.
 *
 * The node's own `kind` picks the family. An integer expression
 * therefore lowers to an int provider, an integer literal to an
 * `NBTInt` (`5`), and an integer storage read to an int `storage`
 * provider — no float ever appears in the output.
 *
 * The two families do NOT have the same operator set. MC's int context
 * has no `sqrt` / `sin` / `cos` / `ceil` / `floor` / `round` /
 * `truncate` / `length` provider — those raise a hard error rather
 * than silently routing through a float. Conversely the int context
 * has `floor_div` / `floor_mod`, which the float context lacks.
 *
 * Each family also compiles its OWN operands: a float provider's
 * operands must be float refs, an int provider's must be int refs.
 * There is no automatic conversion between the two contexts — a
 * mismatch raises instead of being bridged.
 *
 * Each variant has a bare `type` discriminator (`'mul'`, `'add'`,
 * `'storage'`, …) and a shape (`{ inputs: [...] }` for aggregate,
 * `{left, right }` for two-arg binary, etc.). MC accepts the bare
 * name; `minecraft:<op>` is equivalent and resolves to the same shape
 * — we emit the bare form so the literal matches the discriminated
 * union keys.
 *
 * Wire the result into the producer side via:
 *
 *   `core.pack.NumberProvider('float', '<ns>:<name>', compiledJSON)` — registry JSON.
 *   `core.pack.commands.data.modify(dp).compute.default().float(<providerRef>)` — inline command.
 *
 * The `integer` variants of both exist and are used when the compiled
 * expression's kind is `integer`.
 */

// ---------------------------------------------------------------------------
// Operator tables — one per provider family.
//
// The float family carries `length` (vector length) and the rounding /
// trig ops; the int family carries `floor_div` / `floor_mod` instead.
// An op that isn't in a family's table has no provider in that
// context and raises.
// ---------------------------------------------------------------------------

const FLOAT_AGGREGATE_PROVIDER_OPS = [
  'mul', 'add', 'min', 'max', 'avg', 'length',
] as const

const INT_AGGREGATE_PROVIDER_OPS = [
  'mul', 'add', 'min', 'max', 'avg',
] as const

/**
 * Binary providers whose JSON shape is `{left, right}`. Standard
 * left/right arithmetic — distinct from `pow` (which uses
 * `{base, exponent}`).
 *
 * The int context adds `floor_div` / `floor_mod`: MC's plain `div` /
 * `mod` truncate toward zero, the `floor_` variants round down.
 */
const FLOAT_BINARY_PROVIDER_OPS = [
  'div', 'mod', 'sub',
] as const

const INT_BINARY_PROVIDER_OPS = [
  'div', 'mod', 'sub', 'floor_div', 'floor_mod',
] as const

/**
 * Single-input providers — unary math. MC's shape is `{input}`
 * for all of them; the `type` discriminator is what selects the
 * specific transform.
 *
 * The int context has only `abs` and `negate` — the rounding and trig
 * transforms exist solely in the float context.
 */
const FLOAT_SINGLE_PROVIDER_OPS = [
  'abs', 'ceil', 'cos', 'floor', 'negate',
  'round', 'sin', 'sqrt', 'truncate',
] as const

const INT_SINGLE_PROVIDER_OPS = [
  'abs', 'negate',
] as const

/**
 * Widest range of MC's `uniform` int provider, used when the caller
 * omits one of the bounds. Mirrors the float provider's "full range"
 * default (see the `RandomNode` branch below): the whole signed
 * 32-bit range.
 */
const INT_MIN = -2147483648
const INT_MAX = 2147483647

function isIn<T extends readonly string[]>(list: T, op: string): op is T[number] {
  return (list as readonly string[]).includes(op)
}

/**
 * Build the `inputs` list of an aggregate provider.
 *
 * MC's aggregate providers take a list of AT LEAST ONE operand. The
 * generated type spells that as `Ref[] & { 0: Ref }` — an array that
 * is guaranteed to have a first element. A plain `Ref[]` (what
 * `Array#map` returns) doesn't carry that guarantee, so the list is
 * rebuilt as a tuple with a known first element.
 */
function aggregateInputs<T>(refs: T[]): [T, ...T[]] {
  const [first, ...rest] = refs
  return [first, ...rest]
}

/**
 * A compiled provider JSON — either family's shape. The concrete
 * family is decided by the expression's kind, not by the caller.
 */
export type MathProviderJson = JsonContextFloatProvider | JsonContextIntProvider

/**
 * Compile an expression to its provider JSON, picking the provider
 * family from the expression's kind.
 */
export function compileMathExpressionToProvider(node: MathExpressionNode): MathProviderJson {
  return node.kind === 'integer'
    ? compileIntProvider(node)
    : compileFloatProvider(node)
}

// ---------------------------------------------------------------------------
// Float context.
// ---------------------------------------------------------------------------

export function compileFloatProvider(node: MathExpressionNode): JsonContextFloatProvider {
  if (ConversionNode.is(node)) {
    // The conversion produces a FLOAT — so it is MC's `from_int`,
    // the float context's bridge from the integer one. The source
    // keeps its own family: it compiles as an INT provider.
    return { type: 'from_int', input: compileIntProvider(node.source) }
  }
  if (StorageRefNode.is(node)) {
    return floatStorageProvider(node.dataPoint as DataPointClass<'storage'>)
  }
  if (LiteralNode.is(node)) {
    // Literal values are wrapped in `NBTFloat` so the JSON output
    // carries the explicit float type (`21.5f` in SNBT) rather than
    // a bare number. Bare numbers in the provider JSON get parsed by
    // MC as floats in most contexts but the explicit type makes the
    // provider byte-identical to what a hand-written SNBT provider
    // would emit and avoids any ambiguity at integer/float
    // boundaries.
    return new NBTFloat(node.value)
  }
  if (CopyNode.is(node)) {
    return compileFloatProvider(node.source)
  }
  if (ScoreboardRefNode.is(node)) {
    // A score is an integer source — the float context does not
    // convert it automatically. Use an integer math block instead.
    throw new Error(
      'MathProviderCompiler: a score was read inside a float computation. '
      + 'Automatic int → float conversion is not supported yet — use an '
      + 'integer math block (`_.Math(Integer, …)`) for score inputs.',
    )
  }
  if (RandomNode.is(node)) {
    // `_.random({min, max})` — emits MC's `uniform` provider. The
    // JSON shape is `{type, min, max}` — `min` / `max` are
    // optional `JsonFloatRef`. Missing bounds default to Java's
    // FULL-PRECISION float range — the safe precision boundary
    // (per IEEE 754 single-precision, Java `float`):
    //
    //   min = Float.MIN_NORMAL = 2^-126 ≈ 1.1754944E-38.
    //         Smallest NORMAL float (Java's `Float.toString` form).
    //         Below this threshold (down to `MIN_VALUE` = 1.4e-45)
    //         values are still representable, but as SUBNORMALS —
    //         they progressively lose precision (linearly growing
    //         absolute gap, not constant relative error). The user
    //         asked for the boundary BEFORE precision starts
    //         degrading, so we stop at MIN_NORMAL, not MIN_VALUE.
    //   max = Float.MAX_VALUE = (2 - 2^-23) × 2^127 ≈ 3.4028235E+38.
    //         Largest finite float — above this, MC evaluates to
    //         `Infinity`, which silently poisons downstream
    //         `compute` / `data modify` chains.
    //
    // Both literals use Java's 7-significant-digit float string form
    // (matching `Float.toString`) so the SNBT/JSON provider output
    // is byte-identical to what MC's Java backend would emit if it
    // serialized the same constants. A literal with more digits
    // (e.g. `1.17549435e-38`) parses to the same float but prints
    // differently, which can cause string-comparison tooling to
    // flag the provider as changed.
    //
    // Using `0` as a default would also compile, just badly — it
    // collapses the random's effective range to a single value,
    // which is almost certainly not what the user wants when they
    // omit a bound. Full-precision float range is the next-best
    // thing the type system can do for a missing bound.
    const min: JsonFloatRef = node.min
      ? compileFloatOperand(node.min)
      : 1.1754944e-38
    const max: JsonFloatRef = node.max
      ? compileFloatOperand(node.max)
      : 3.4028235e+38
    return { type: 'uniform', min, max }
  }
  if (BinaryOpNode.is(node)) {
    const left = compileFloatOperand(node.operands[0])
    const right = compileFloatOperand(node.operands[1])
    return floatBinaryProvider(node.op, left, right)
  }
  if (AggregateNode.is(node)) {
    if (!isIn(FLOAT_AGGREGATE_PROVIDER_OPS, node.op)) {
      throwUnsupportedOp(node.op, 'aggregate', 'float')
    }
    const op = node.op
    const inputs = aggregateInputs(node.inputs.map((n) => compileFloatOperand(n)))
    return { type: op, inputs }
  }
  if (UnaryOpNode.is(node)) {
    if (!isIn(FLOAT_SINGLE_PROVIDER_OPS, node.op)) {
      throwUnsupportedOp(node.op, 'single', 'float')
    }
    const input = compileFloatOperand(node.operand)
    return { type: node.op, input }
  }
  throw new Error(
    `MathProviderCompiler: unhandled math node ${node.constructor.name}. `
      + `Wrap in MCFunction lowering (out of scope for v1).`,
  )
}

/**
 * A map of chain nodes → the storage their value was last written to.
 *
 * The INCREMENTAL provider compile walks the expression tree and
 * replaces every chain node with a `storage` read of the handle's
 * intermediate storage. Keying the map on the DataPoint (rather than
 * on a pre-built provider JSON) keeps each provider family strictly
 * typed: the same DataPoint compiles to a float `storage` provider in
 * the float context and an int one in the int context.
 */
export type ChainStorageMap = Map<MathExpressionNode, DataPointClass<'storage'>>

/**
 * Compile an expression to a provider JSON, substituting every chain
 * node in `chainStorage` with a `storage` read of that handle's
 * intermediate storage.
 *
 * The provider family follows the expression's kind.
 */
export function compileWithChainReads(
  expression: MathExpressionNode,
  chainStorage: ChainStorageMap,
): MathProviderJson {
  return expression.kind === 'integer'
    ? compileIntWithChainReads(expression, chainStorage)
    : compileFloatWithChainReads(expression, chainStorage)
}

export function compileFloatWithChainReads(
  expression: MathExpressionNode,
  chainStorage: ChainStorageMap,
): JsonContextFloatProvider {
  const dp = chainStorage.get(expression)
  if (dp) return floatStorageProvider(dp)
  if (ConversionNode.is(expression)) {
    // `from_int` — the conversion produces a float, so its source is
    // an INT provider and reads INT chain storage.
    return {
      type: 'from_int',
      input: compileIntWithChainReads(expression.source, chainStorage),
    }
  }
  if (BinaryOpNode.is(expression)) {
    const left = compileFloatWithChainReads(expression.operands[0], chainStorage)
    const right = compileFloatOperand(expression.operands[1])
    return floatBinaryProvider(expression.op, left, right)
  }
  if (AggregateNode.is(expression)) {
    if (!isIn(FLOAT_AGGREGATE_PROVIDER_OPS, expression.op)) {
      throwUnsupportedOp(expression.op, 'aggregate', 'float')
    }
    const op = expression.op
    const inputs = aggregateInputs(expression.inputs.map((n, i) => (
      i === 0
        ? compileFloatWithChainReads(n, chainStorage)
        : compileFloatOperand(n)
    )))
    return { type: op, inputs }
  }
  if (UnaryOpNode.is(expression)) {
    if (!isIn(FLOAT_SINGLE_PROVIDER_OPS, expression.op)) {
      throwUnsupportedOp(expression.op, 'single', 'float')
    }
    const input = compileFloatOperand(expression.operand)
    return { type: expression.op, input }
  }
  return compileFloatProvider(expression)
}

export function compileIntWithChainReads(
  expression: MathExpressionNode,
  chainStorage: ChainStorageMap,
): JsonContextIntProvider {
  const dp = chainStorage.get(expression)
  if (dp) return intStorageProvider(dp)
  if (ConversionNode.is(expression)) {
    // `from_float` — the conversion produces an integer, so its
    // source is a FLOAT provider and reads FLOAT chain storage.
    return {
      type: 'from_float',
      input: compileFloatWithChainReads(expression.source, chainStorage),
    }
  }
  if (BinaryOpNode.is(expression)) {
    const left = compileIntWithChainReads(expression.operands[0], chainStorage)
    const right = compileIntOperand(expression.operands[1])
    return intBinaryProvider(expression.op, left, right)
  }
  if (AggregateNode.is(expression)) {
    if (!isIn(INT_AGGREGATE_PROVIDER_OPS, expression.op)) {
      throwUnsupportedOp(expression.op, 'aggregate', 'integer')
    }
    const op = expression.op
    const inputs = aggregateInputs(expression.inputs.map((n, i) => (
      i === 0
        ? compileIntWithChainReads(n, chainStorage)
        : compileIntOperand(n)
    )))
    return { type: op, inputs }
  }
  if (UnaryOpNode.is(expression)) {
    if (!isIn(INT_SINGLE_PROVIDER_OPS, expression.op)) {
      throwUnsupportedOp(expression.op, 'single', 'integer')
    }
    const input = compileIntOperand(expression.operand)
    return { type: expression.op, input }
  }
  return compileIntProvider(expression)
}

/**
 * Build a binary provider in the FLOAT context. `pow` uses
 * `{base, exponent}`; the rest use `{left, right}`.
 */
function floatBinaryProvider(
  op: BinaryOp,
  left: JsonFloatRef,
  right: JsonFloatRef,
): JsonContextFloatProvider {
  if (isIn(FLOAT_BINARY_PROVIDER_OPS, op)) {
    return { type: op, left, right }
  }
  if (op === 'pow') {
    return { type: 'pow', base: left, exponent: right }
  }
  throwUnsupportedOp(op, 'binary', 'float')
}

/**
 * Build a binary provider in the INTEGER context. `pow` uses
 * `{base, exponent}`; the rest use `{left, right}`.
 */
function intBinaryProvider(
  op: BinaryOp,
  left: JsonIntRef,
  right: JsonIntRef,
): JsonContextIntProvider {
  if (isIn(INT_BINARY_PROVIDER_OPS, op)) {
    return { type: op, left, right }
  }
  if (op === 'pow') {
    return { type: 'pow', base: left, exponent: right }
  }
  throwUnsupportedOp(op, 'binary', 'integer')
}

/**
 * Compile an operand of a FLOAT provider.
 *
 * The operand is consumed in the FLOAT context, so an integer
 * operand is bridged by MC's `from_int` provider — the float
 * context's bridge from the integer one. The widening is exact (an
 * int always fits a float's range), so no value is lost.
 *
 * `NumericCoalescingVisitor` normally inserts the conversion into the
 * AST before lowering; this is the defensive path for an expression
 * compiled outside the visitor pipeline.
 */
function compileFloatOperand(node: MathExpressionNode): JsonFloatRef {
  if (node.kind === 'integer') {
    return { type: 'from_int', input: compileIntProvider(node) }
  }
  return compileFloatProvider(node)
}

// ---------------------------------------------------------------------------
// Integer context.
// ---------------------------------------------------------------------------

export function compileIntProvider(node: MathExpressionNode): JsonContextIntProvider {
  if (ConversionNode.is(node)) {
    // The conversion produces an INTEGER — so it is MC's `from_float`,
    // the int context's bridge from the float one. The source keeps
    // its own family: it compiles as a FLOAT provider.
    return { type: 'from_float', input: compileFloatProvider(node.source) }
  }
  if (StorageRefNode.is(node)) {
    return intStorageProvider(node.dataPoint as DataPointClass<'storage'>)
  }
  if (LiteralNode.is(node)) {
    // An integer literal lowers to MC's `constant` int provider — the
    // bare `NBTInt` form (`5`) that the int provider union accepts
    // directly.
    return new NBTInt(node.value)
  }
  if (CopyNode.is(node)) {
    return compileIntProvider(node.source)
  }
  if (ScoreboardRefNode.is(node)) {
    // MC scores are integers — the int context reads them natively.
    return scoreProvider(node.score)
  }
  if (RandomNode.is(node)) {
    // `_.random({min, max}, 'integer')` — MC's `uniform` int provider.
    // Missing bounds default to the full signed 32-bit range, the
    // integer counterpart of the float provider's full-range default.
    const min: JsonIntRef = node.min
      ? compileIntOperand(node.min)
      : INT_MIN
    const max: JsonIntRef = node.max
      ? compileIntOperand(node.max)
      : INT_MAX
    return { type: 'uniform', min, max }
  }
  if (BinaryOpNode.is(node)) {
    const left = compileIntOperand(node.operands[0])
    const right = compileIntOperand(node.operands[1])
    return intBinaryProvider(node.op, left, right)
  }
  if (AggregateNode.is(node)) {
    if (!isIn(INT_AGGREGATE_PROVIDER_OPS, node.op)) {
      throwUnsupportedOp(node.op, 'aggregate', 'integer')
    }
    const op = node.op
    const inputs = aggregateInputs(node.inputs.map((n) => compileIntOperand(n)))
    return { type: op, inputs }
  }
  if (UnaryOpNode.is(node)) {
    if (!isIn(INT_SINGLE_PROVIDER_OPS, node.op)) {
      throwUnsupportedOp(node.op, 'single', 'integer')
    }
    const input = compileIntOperand(node.operand)
    return { type: node.op, input }
  }
  throw new Error(
    `MathProviderCompiler: unhandled math node ${node.constructor.name}. `
      + `Wrap in MCFunction lowering (out of scope for v1).`,
  )
}

/**
 * Compile an operand of an INTEGER provider.
 *
 * The operand is consumed in the INT context, so a float operand is
 * bridged by MC's `from_float` provider — the int context's bridge
 * from the float one. `from_float` TRUNCATES TOWARD ZERO (verified
 * live against the server: `from_float(-2.5)` is `-2`, not `-3`).
 *
 * `NumericCoalescingVisitor` normally inserts the conversion into the
 * AST before lowering; this is the defensive path for an expression
 * compiled outside the visitor pipeline.
 */
function compileIntOperand(node: MathExpressionNode): JsonIntRef {
  if (node.kind === 'float') {
    return { type: 'from_float', input: compileFloatProvider(node) }
  }
  return compileIntProvider(node)
}

function throwUnsupportedOp(
  op: string,
  kind: 'binary' | 'aggregate' | 'single',
  family: 'float' | 'integer',
): never {
  if (family === 'integer') {
    throw new Error(
      `MathProviderCompiler: ${kind} '${op}' has no minecraft context-int `
        + `provider. Integer math does not convert floats — the int context `
        + `only has abs, add, avg, div, floor_div, floor_mod, max, min, mod, `
        + `mul, negate, pow, sub, uniform, constant, storage and score.`,
    )
  }
  throw new Error(
    `MathProviderCompiler: ${kind} '${op}' has no minecraft context-float `
      + `provider (need wrapper-MCFunction lowering).`,
  )
}

/**
 * Build a `storage` provider JSON. The MC JSON spec accepts an
 * empty `path` (meaning "storage root") but the generated MCDOC
 * `JsonContextFloatProviderStorage.path` type excludes `''`. We
 * construct the variant with the proper literal-typed fields and
 * only assert the outer provider union at the return site — the inner
 * shape is genuinely correct (storage keys must be namespaced;
 * `path` is non-empty modulo root reads).
 */
function storagePath(dp: DataPointClass<'storage'>): NonEmptyString {
  const subPathRaw = Array.isArray(dp.path) ? dp.path.join('.') : String(dp.path ?? '')
  // The generated `JsonContextFloatProviderStorage.path` is typed as
  // `NonEmptyString` — MCDOC excludes `''`. For our purposes (root
  // reads + `DataPoint` paths that are naturally non-empty) this is
  // fine: when `subPathRaw === ''` we substitute `'.'` which MC
  // still resolves to the storage root (a single-dot traversal).
  return (subPathRaw.length === 0 ? '.' : subPathRaw) as NonEmptyString
}

/** The `storage` provider for the FLOAT context. */
function floatStorageProvider(dp: DataPointClass<'storage'>): JsonContextFloatProvider {
  return {
    type: 'storage',
    storage: dp.currentTarget as NamespacedString,
    path: storagePath(dp),
  }
}

/** The `storage` provider for the INTEGER context. */
function intStorageProvider(dp: DataPointClass<'storage'>): JsonContextIntProvider {
  return {
    type: 'storage',
    storage: dp.currentTarget as NamespacedString,
    path: storagePath(dp),
  }
}

/**
 * Build a `score` provider JSON. MC's shape is
 * `{type: 'score', target: <score provider>, score: <objective>}` —
 * the score holder goes in `target` (as MC's `fixed` score provider),
 * the objective name in `score`.
 */
function scoreProvider(score: Score): JsonContextIntProvider {
  return {
    type: 'score',
    target: {
      type: 'fixed',
      name: String(score.target),
    },
    score: score.objective.name as NonEmptyString,
  }
}
