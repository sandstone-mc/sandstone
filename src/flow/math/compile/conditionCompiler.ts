import type {
  JsonFloatRef,
} from '../../../arguments/generated/_json/data/number_provider/context_float.ts'
import type {
  JsonIntRef,
} from '../../../arguments/generated/_json/data/number_provider/context_int.ts'
import type { JsonPredicateRef } from '../../../arguments/generated/_json/data/predicate.ts'
import type { MathKind } from '../ast/MathExpressionNode'
import type { MathExpressionNode } from '../ast/MathExpressionNode'
import type { MathConditionNode } from '../ast/MathConditionNode'
import {
  AndConditionNode,
  ComparisonConditionNode,
  NotConditionNode,
  OrConditionNode,
} from '../ast/nodes/conditions'
import type { ComparisonOp } from '../ast/nodes/conditions'
import { compileFloatOperand, compileIntOperand } from './mathProviderCompiler'
import { LiteralNode } from '../ast/nodes/leaves'

/**
 * Compile a math condition into an MC **loot condition** (a
 * predicate).
 *
 * MC's number providers can branch on a predicate — the `conditional`
 * provider's `condition`, and the `number_dispatcher`'s per-case
 * `condition` — and the predicates that fit a numeric test are
 * `minecraft:int_value_check` / `minecraft:float_value_check`:
 *
 * ```json
 * { "type": "minecraft:int_value_check", "value": <int provider>, "test": { "min": 1, "max": 3 } }
 * ```
 *
 * `value` is a PROVIDER and `test`'s bounds are providers too — so
 * the comparison is evaluated by MC, exactly, in the provider's own
 * numeric context. No mcfunction, no score round-trip, no precision
 * loss.
 *
 * The predicate's family follows the comparison's kind: an integer
 * comparison lowers to `int_value_check`, a float one to
 * `float_value_check`. A mixed comparison is bridged by the numeric
 * tower's `from_int` / `from_float` provider, exactly like an
 * operator's operands are.
 */

/**
 * The kind a comparison is evaluated in — the widest of its two
 * operands (the numeric tower), so `int == float` compares in the
 * float context.
 */
function comparisonKind(node: ComparisonConditionNode): MathKind {
  if (node.left.kind === 'float' || node.right.kind === 'float') return 'float'
  return 'integer'
}

/**
 * The bounds a comparison's range test uses.
 *
 * MC's value-check ranges are INCLUSIVE on both ends (verified live
 * against the server) and have no exclusivity flag. So:
 *
 *   - `==` → `[y, y]`
 *   - `<=` → `(-inf, y]`
 *   - `>=` → `[y, +inf)`
 *   - `<`  → `(-inf, y)` — expressed as `[.., y-1]` for integers, and
 *     as `[.., the float just below y]` for floats.
 *   - `>`  → `(y, +inf)` — the mirror image.
 *
 * A strict comparison against a float needs the neighbouring
 * representable value, because the range's upper bound is inclusive.
 */
interface RangeBounds {
  min?: number
  max?: number
}

/**
 * The float immediately below `value` (in MC's single precision).
 *
 * MC's float providers run in single precision, so the neighbouring
 * value is the next float32 — not the next JS double. `Math.fround`
 * rounds to single precision; stepping down one ULP needs the bit
 * pattern.
 */
function floatBelow(value: number): number {
  const bits = new Int32Array(1)
  const floats = new Float32Array(bits.buffer)
  floats[0] = Math.fround(value)
  if (Number.isNaN(floats[0])) return value
  if (floats[0] === Infinity) return Math.fround(3.4028234663852886e38)
  // Decrement the magnitude: for negatives the bit pattern grows.
  bits[0] = floats[0] > 0 ? bits[0] - 1 : bits[0] + 1
  return floats[0]
}

/**
 * The float immediately above `value` (in MC's single precision).
 */
function floatAbove(value: number): number {
  const bits = new Int32Array(1)
  const floats = new Float32Array(bits.buffer)
  floats[0] = Math.fround(value)
  if (Number.isNaN(floats[0])) return value
  if (floats[0] === -Infinity) return Math.fround(-3.4028234663852886e38)
  bits[0] = floats[0] > 0 ? bits[0] + 1 : bits[0] - 1
  return floats[0]
}

/**
 * The range a comparison tests, given the operator and the value
 * being compared against.
 *
 * `against` is the right-hand operand's CONSTANT value — the bound of
 * the range. A comparison against a non-constant is handled by the
 * caller (its bound is a provider, and a strict comparison against a
 * provider can't be expressed exactly).
 */
function boundsFor(
  op: ComparisonOp,
  against: number,
  kind: MathKind,
): RangeBounds {
  switch (op) {
    case '==': return { min: against, max: against }
    case '<=': return { max: against }
    case '>=': return { min: against }
    case '<': {
      if (kind === 'integer') return { max: against - 1 }
      return { max: floatBelow(against) }
    }
    case '>': {
      if (kind === 'integer') return { min: against + 1 }
      return { min: floatAbove(against) }
    }
    // `!=` is the inverse of `==` — handled by the caller (it wraps
    // the equality test in `inverted`).
    default: return {}
  }
}

/**
 * Compile a comparison into an `int_value_check` / `float_value_check`
 * predicate.
 *
 * The compared value is the LEFT operand (the RIGHT is the bound). A
 * literal on the left and an expression on the right is swapped, so
 * `5 == x` compares the same way `x == 5` does.
 */
function compileComparison(node: ComparisonConditionNode): JsonPredicateRef {
  const kind = comparisonKind(node)

  // `!=` is `inverted` around the equality test.
  if (node.op === '!=') {
    return {
      type: 'minecraft:inverted',
      term: compileTest(node, '==', kind),
    } as JsonPredicateRef
  }
  return compileTest(node, node.op, kind)
}

/**
 * Compile the range test for a comparison operator.
 *
 * Two shapes, depending on whether the bound is a literal:
 *
 *   - A LITERAL bound → the range's bound is the number itself (a
 *     strict comparison steps to the neighbouring representable
 *     value).
 *   - A COMPUTED bound → the range's bound is a PROVIDER (MC's
 *     ranges accept providers), and a strict comparison is rewritten
 *     so the range stays exact — see `compileComputedTest`.
 */
function compileTest(
  node: ComparisonConditionNode,
  op: ComparisonOp,
  kind: MathKind,
): JsonPredicateRef {
  const { left, right } = node

  // Which side is the bound? A constant side is the bound; the other
  // side is the value being tested.
  const rightIsConstant = isConstantNode(right)
  const leftIsConstant = isConstantNode(left)

  if (!leftIsConstant && !rightIsConstant) {
    return compileComputedTest(node, op, kind)
  }

  let valueNode = left
  let boundNode = right
  if (leftIsConstant && !rightIsConstant) {
    valueNode = right
    boundNode = left
  }

  const bound = LiteralNode.is(boundNode) ? boundNode.value : 0

  if (kind === 'integer') {
    const test = boundsFor(op, bound, 'integer')
    return {
      type: 'minecraft:int_value_check',
      value: compileIntOperand(valueNode),
      test: toIntRange(test),
    } as JsonPredicateRef
  }

  const test = boundsFor(op, bound, 'float')
  return {
    type: 'minecraft:float_value_check',
    value: compileFloatOperand(valueNode),
    test: toFloatRange(test),
  } as JsonPredicateRef
}

/**
 * Compile a comparison whose bound is COMPUTED — neither side is a
 * literal.
 *
 * MC's value-check ranges take PROVIDERS as their bounds, so an
 * inclusive comparison against a computed value is exact:
 *
 *   - `==` → `[y, y]`
 *   - `<=` → `(-inf, y]`
 *   - `>=` → `[y, +inf)`
 *
 * A STRICT comparison needs an exclusive bound, and MC's ranges have
 * no exclusivity flag — so the comparison is rewritten:
 *
 *   - Integers: the bound becomes a provider expression — `y - 1` /
 *     `y + 1` — so `x < y` is the range `(-inf, y-1]`, exactly.
 *   - Floats: there's no "the float just below y" provider, so the
 *     VALUE side is rewritten instead — `x < y` ⟺
 *     `floor(x - y) <= -1`. A negative difference floors to at most
 *     -1, a non-negative one to at least 0, so the test is exact.
 */
function compileComputedTest(
  node: ComparisonConditionNode,
  op: ComparisonOp,
  kind: MathKind,
): JsonPredicateRef {
  const { left, right } = node

  if (kind === 'integer') {
    const value = compileIntOperand(left)
    const bound = compileIntOperand(right)
    switch (op) {
      case '==':
        return intCheck(value, { min: bound, max: bound })
      case '<=':
        return intCheck(value, { max: bound })
      case '>=':
        return intCheck(value, { min: bound })
      case '<':
        return intCheck(value, { max: { type: 'sub', left: bound, right: 1 } })
      case '>':
        return intCheck(value, { min: { type: 'add', inputs: [bound, 1] } })
      default:
        break
    }
  }

  const value = compileFloatOperand(left)
  const bound = compileFloatOperand(right)
  switch (op) {
    case '==':
      return floatCheck(value, { min: bound, max: bound })
    case '<=':
      return floatCheck(value, { max: bound })
    case '>=':
      return floatCheck(value, { min: bound })
    case '<':
      return floatCheck(
        { type: 'floor', input: { type: 'sub', left: value, right: bound } },
        { max: -1 },
      )
    case '>':
      return floatCheck(
        { type: 'floor', input: { type: 'sub', left: bound, right: value } },
        { max: -1 },
      )
    default:
      break
  }

  throw new Error(
    `Math: cannot lower the comparison operator '${op}' into an MC predicate.`,
  )
}

/**
 * An `int_value_check` predicate.
 */
function intCheck(
  value: JsonIntRef,
  test: { min?: JsonIntRef, max?: JsonIntRef },
): JsonPredicateRef {
  return {
    type: 'minecraft:int_value_check',
    value,
    test,
  } as JsonPredicateRef
}

/**
 * A `float_value_check` predicate.
 */
function floatCheck(
  value: JsonFloatRef,
  test: { min?: JsonFloatRef, max?: JsonFloatRef },
): JsonPredicateRef {
  return {
    type: 'minecraft:float_value_check',
    value,
    test,
  } as JsonPredicateRef
}

/** True iff the node is a literal with a known value. */
function isConstantNode(node: MathExpressionNode): boolean {
  return LiteralNode.is(node)
}

/**
 * An int range bound. MC's int ranges are plain numbers (or int
 * providers) — the exclusive upper bound of a strict comparison is
 * folded into the number itself.
 */
function toIntRange(bounds: RangeBounds): { min?: number, max?: number } {
  const range: { min?: number, max?: number } = {}
  if (bounds.min !== undefined) range.min = bounds.min
  if (bounds.max !== undefined) range.max = bounds.max
  return range
}

/**
 * A float range bound — same shape, but the bounds are floats.
 */
function toFloatRange(bounds: RangeBounds): { min?: number, max?: number } {
  const range: { min?: number, max?: number } = {}
  if (bounds.min !== undefined) range.min = Math.fround(bounds.min)
  if (bounds.max !== undefined) range.max = Math.fround(bounds.max)
  return range
}

/**
 * Compile any math condition into an MC predicate.
 *
 * - A comparison → `int_value_check` / `float_value_check` (or
 *   `inverted` around one, for `!=`).
 * - `and(a, b)` → `all_of`.
 * - `or(a, b)` → `any_of`.
 * - `not(a)` → `inverted`.
 */
export function compileCondition(condition: MathConditionNode): JsonPredicateRef {
  if (ComparisonConditionNode.is(condition)) {
    return compileComparison(condition)
  }
  if (AndConditionNode.is(condition)) {
    return {
      type: 'minecraft:all_of',
      terms: condition.body.map((c) => compileCondition(c)),
    } as JsonPredicateRef
  }
  if (OrConditionNode.is(condition)) {
    return {
      type: 'minecraft:any_of',
      terms: condition.body.map((c) => compileCondition(c)),
    } as JsonPredicateRef
  }
  if (NotConditionNode.is(condition)) {
    return {
      type: 'minecraft:inverted',
      term: compileCondition(condition.condition),
    } as JsonPredicateRef
  }
  throw new Error(
    `Math: cannot lower the condition ${condition.constructor.name} into an MC `
    + 'predicate.',
  )
}

/**
 * The provider family a condition's predicate belongs to — the
 * comparison's kind. Used to pick the `int_value_check` vs
 * `float_value_check` shape at the call site.
 */
export function conditionKind(condition: MathConditionNode): MathKind {
  if (ComparisonConditionNode.is(condition)) return comparisonKind(condition)
  return 'float'
}

export type { JsonFloatRef, JsonIntRef }
