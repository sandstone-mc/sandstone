import type { DataPointClass } from '../../../variables/Data'
import { NBTFloat } from '../../../variables/nbt/NBTs'
import type { NamespacedString, NonEmptyString } from '../../../utils'
import type {
  JsonAggregateOperands,
  JsonContextFloatProvider,
  JsonFloatRef,
} from '../../../arguments/generated/_json/data/number_provider/context_float.ts'
import type { MathExpressionNode } from '../ast/MathExpressionNode'
import { StorageRefNode, LiteralNode, CopyNode, RandomNode } from '../ast/nodes/leaves'
import { BinaryOpNode, AggregateNode, UnaryOpNode } from '../ast/nodes/operators'

/**
 * Compile a math expression AST node into an MC
 * `minecraft:context_float_provider` JSON tree.
 *
 * The return type is `JsonContextFloatProvider` — the discriminated
 * union of every provider shape the type system accepts. Each variant
 * has a bare `type` discriminator (`'mul'`, `'add'`, `'storage'`, …)
 * and a shape (`{ inputs: [...] }` for aggregate, `{ argument,
 * input }` for single-arg binary, `{ left, right }` for two-arg
 * binary, etc.). MC accepts the bare name; `minecraft:<op>` is
 * equivalent and resolves to the same shape — we emit the bare form
 * so the literal matches the discriminated union keys.
 *
 * Wire the result into the producer side via:
 *
 *   `core.pack.NumberProvider('float', '<ns>:<name>', compiledJSON)` — registry JSON.
 *   `core.pack.commands.data.modify(dp).compute.default().float(<providerRef>)` — inline command.
 *
 * Throws on shapes not in the union (`floor_div` / `floor_mod` /
 * `pow`, score reads, `ArcSineNode`'s polyfill) — they need
 * wrapper-MCFunction lowering, not in scope for v1.
 */

const AGGREGATE_PROVIDER_OPS = [
  'mul', 'add', 'min', 'max', 'avg', 'length',
] as const
type AggregateProviderOp = (typeof AGGREGATE_PROVIDER_OPS)[number]

/**
 * Binary providers whose JSON shape is `{left, right}`. Standard
 * left/right arithmetic — distinct from `pow` (which uses
 * `{base, exponent}`) and `floor_div` / `floor_mod` (no MC provider).
 */
const BINARY_PROVIDER_OPS = [
  'div', 'mod', 'sub',
] as const
type BinaryProviderOp = (typeof BINARY_PROVIDER_OPS)[number]

/**
 * Binary providers with non-standard field names. Mapped to their
 * MC JSON shape so the compiler can emit the right keys.
 *
 * - `pow` → `{base, exponent}` (not `{left, right}`).
 *
 * Future: `floor_div`, `floor_mod`, `clamped` etc. once MC's
 * generated types include them.
 */
const SPECIAL_BINARY_PROVIDER_OPS = ['pow'] as const
type SpecialBinaryProviderOp = (typeof SPECIAL_BINARY_PROVIDER_OPS)[number]

/**
 * Single-input providers — unary math (abs / ceil / cos / floor /
 * negate / round / sin / sqrt / truncate). MC's shape is `{input}`
 * for all of them; the `type` discriminator is what selects the
 * specific transform.
 */
const SINGLE_PROVIDER_OPS = [
  'abs', 'ceil', 'cos', 'floor', 'negate',
  'round', 'sin', 'sqrt', 'truncate',
] as const
type SingleProviderOp = (typeof SINGLE_PROVIDER_OPS)[number]

function isAggregateOp(op: string): op is AggregateProviderOp {
  return (AGGREGATE_PROVIDER_OPS as readonly string[]).includes(op)
}
function isBinaryOp(op: string): op is BinaryProviderOp {
  return (BINARY_PROVIDER_OPS as readonly string[]).includes(op)
}
function isSpecialBinaryOp(op: string): op is SpecialBinaryProviderOp {
  return (SPECIAL_BINARY_PROVIDER_OPS as readonly string[]).includes(op)
}
function isSingleOp(op: string): op is SingleProviderOp {
  return (SINGLE_PROVIDER_OPS as readonly string[]).includes(op)
}

export function compileMathExpressionToProvider(
  node: MathExpressionNode,
): JsonContextFloatProvider {
  if (StorageRefNode.is(node)) {
    return storageProviderJson(node.dataPoint as DataPointClass<'storage'>)
  }
  if (LiteralNode.is(node)) {
    // Literal values are wrapped in `NBTFloat` so the JSON output
    // carries the explicit float type (`21.5f` in SNBT) rather than
    // a bare number. Bare numbers in the provider JSON get parsed by
    // MC as floats in most contexts but the explicit type makes the
    // provider byte-identical to what a hand-written SNBT provider
    // would emit and avoids any ambiguity at integer/float
    // boundaries.
    //
    // Math is float-only at this layer (integer kinds are widened
    // upstream by the handle constructors), so every literal here
    // is a float. If integer-math support is added later, switch
    // on `node.kind` to pick `NBTFloat` vs `NBTInt` — the
    // discriminated provider union (`JsonContextFloatProvider`) only
    // accepts float refs in this builder.
    return new NBTFloat(node.value)
  }
  if (CopyNode.is(node)) {
    return compileMathExpressionToProvider(node.source)
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
      ? compileMathExpressionToProvider(node.min)
      : (1.1754944e-38 as JsonFloatRef)
    const max: JsonFloatRef = node.max
      ? compileMathExpressionToProvider(node.max)
      : (3.4028235e+38 as JsonFloatRef)
    return { type: 'uniform', min, max }
  }
  if (BinaryOpNode.is(node)) {
    if (isBinaryOp(node.op)) {
      const op: BinaryProviderOp = node.op
      const left = compileMathExpressionToProvider(node.operands[0])
      const right = compileMathExpressionToProvider(node.operands[1])
      return { type: op, left, right }
    }
    if (isSpecialBinaryOp(node.op)) {
      const op: SpecialBinaryProviderOp = node.op
      if (op === 'pow') {
        // `pow` uses `{base, exponent}` (not `{left, right}`).
        const base = compileMathExpressionToProvider(node.operands[0])
        const exponent = compileMathExpressionToProvider(node.operands[1])
        return { type: 'pow', base, exponent }
      }
    }
    throwUnsupportedOp(node.op, 'binary')
  }
  if (AggregateNode.is(node)) {
    if (!isAggregateOp(node.op)) {
      throwUnsupportedOp(node.op, 'aggregate')
    }
    const op: AggregateProviderOp = node.op
    const inputs = node.inputs.map((n) =>
      compileMathExpressionToProvider(n),
    ) as unknown as JsonAggregateOperands
    return { type: op, inputs }
  }
  if (UnaryOpNode.is(node)) {
    if (!isSingleOp(node.op)) {
      throwUnsupportedOp(node.op, 'single')
    }
    const input = compileMathExpressionToProvider(node.operand)
    return { type: node.op, input }
  }
  throw new Error(
    `MathProviderCompiler: unhandled math node ${node.constructor.name}. `
      + `Wrap in MCFunction lowering (out of scope for v1).`,
  )
}

function throwUnsupportedOp(
  op: string,
  kind: 'binary' | 'aggregate' | 'single',
): never {
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
 * only assert the outer `JsonContextFloatProvider` at the return
 * site — the inner shape is genuinely correct (storage keys must
 * be namespaced; `path` is non-empty modulo root reads).
 */
function storageProviderJson(
  dp: DataPointClass<'storage'>,
): JsonContextFloatProvider {
  const target = dp.currentTarget as unknown as NamespacedString
  const subPathRaw = Array.isArray(dp.path) ? dp.path.join('.') : String(dp.path ?? '')
  // The generated `JsonContextFloatProviderStorage.path` is typed as
  // `NonEmptyString` — MCDOC excludes `''`. For our purposes (root
  // reads + `DataPoint` paths that are naturally non-empty) this is
  // fine: when `subPathRaw === ''` we substitute `'.'` which MC
  // still resolves to the storage root (a single-dot traversal).
  const path = subPathRaw.length === 0 ? '.' : subPathRaw
  return {
    type: 'storage',
    storage: target,
    path: path as NonEmptyString,
  }
}
