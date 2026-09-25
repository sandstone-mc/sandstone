import type { DataPointClass } from '../../../variables/Data'
import type { NamespacedString, NonEmptyString } from '../../../utils'
import type {
  JsonAggregateOperands,
  JsonContextFloatProvider,
} from '../../../arguments/generated/_json/data/number_provider/context_float.ts'
import type { MathExpressionNode } from '../ast/MathExpressionNode'
import { StorageRefNode, LiteralNode, CopyNode } from '../ast/nodes/leaves'
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

const BINARY_PROVIDER_OPS = [
  'div', 'mod', 'sub',
] as const
type BinaryProviderOp = (typeof BINARY_PROVIDER_OPS)[number]

function isAggregateOp(op: string): op is AggregateProviderOp {
  return (AGGREGATE_PROVIDER_OPS as readonly string[]).includes(op)
}
function isBinaryOp(op: string): op is BinaryProviderOp {
  return (BINARY_PROVIDER_OPS as readonly string[]).includes(op)
}

export function compileMathExpressionToProvider(
  node: MathExpressionNode,
): JsonContextFloatProvider {
  if (StorageRefNode.is(node)) {
    return storageProviderJson(node.dataPoint as DataPointClass<'storage'>)
  }
  if (LiteralNode.is(node)) {
    // Literal values are encoded directly as raw numbers in the
    // provider JSON — `JsonContextFloatProvider`'s union accepts
    // `NBTFloat | number` alongside the discriminated shapes. Inlining
    // a `{type: 'constant', value: x}` wrapper adds nothing — MC
    // resolves a bare `5` to a constant provider at parse time.
    return node.value
  }
  if (CopyNode.is(node)) {
    return compileMathExpressionToProvider(node.source)
  }
  if (BinaryOpNode.is(node)) {
    if (!isBinaryOp(node.op)) {
      throwUnsupportedOp(node.op, 'binary')
    }
    const op: BinaryProviderOp = node.op
    // The generated MCDOC types only carry the `{left, right}` form
    // for binary providers (`JsonBinaryProvider`); the single-arg
    // `{argument, input}` form MC accepts at runtime isn't modeled
    // here. We always emit `{left, right}` — MC folds constants at
    // parse time either way.
    const left = compileMathExpressionToProvider(node.operands[0])
    const right = compileMathExpressionToProvider(node.operands[1])
    return { type: op, left, right }
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
    const input = compileMathExpressionToProvider(node.operand)
    return { type: node.op, input }
  }
  throw new Error(
    `MathProviderCompiler: unhandled math node ${node.constructor.name}. `
      + `Wrap in MCFunction lowering (out of scope for v1).`,
  )
}

function throwUnsupportedOp(op: string, kind: 'binary' | 'aggregate'): never {
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
