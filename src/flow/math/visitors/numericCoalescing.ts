import type { MathNode } from '../ast/MathNode'
import type { MathExpressionNode } from '../ast/MathExpressionNode'
import type { MathKind } from '../ast/MathExpressionNode'
import type { MathFunctionNode } from '../ast/MathFunctionNode'
import { ConversionNode } from '../ast/nodes/conversion'
import { AggregateNode, BinaryOpNode, UnaryOpNode } from '../ast/nodes/operators'
import { MathVisitor } from './MathVisitor'

/**
 * `NumericCoalescingVisitor` — bridge the two numeric contexts where
 * they meet.
 *
 * MC's two number-provider families are separate: a
 * `context_float_provider` tree holds float providers, a
 * `context_int_provider` tree holds int providers. The only bridges
 * between them are `from_int` (a float provider wrapping an int
 * provider — widens exactly) and `from_float` (an int provider
 * wrapping a float provider — truncates toward zero).
 *
 * An operator consumes its operands in ITS OWN kind, so an operand
 * whose kind doesn't match has to be converted. This visitor makes
 * that conversion explicit in the AST: it wraps the mismatched
 * operand in a `ConversionNode`, which the lowering pass compiles
 * into the matching `from_int` / `from_float` provider.
 *
 * ## Why the operand is converted rather than the chain widening
 *
 * The operator's result kind is the RECEIVER's kind (see
 * `handles.ts`) — an integer handle's chain computes integers, a
 * float handle's chain computes floats. Converting the mismatched
 * operand keeps the chain in one context, so an integer in the chain
 * never round-trips through a float (which would lose precision
 * above 2^24) just to be converted back at the end.
 *
 * ```ts
 * // An integer chain: the float operand is truncated in place.
 * _.Math(Integer, (math, x: Integer) => {
 *   math.return(x.add(math.float(2.5)))
 * })
 * // → add(integer_x, from_float(2.5f))   →  x + 2
 * ```
 *
 * ## Pipeline position
 *
 * Runs AFTER `AlgebraicSimplificationVisitor` (which can rewrite an
 * operator's shape and change its kind — `sub(0, x)` becomes
 * `negate(x)`, whose kind follows its operand) and BEFORE
 * `ConstantFoldingVisitor` (which folds a conversion of a constant
 * source — `from_float(2.5)` is `2`, `from_int(7)` is `7.0`).
 *
 * Idempotent: a conversion's own kind already matches the operator
 * that consumes it, so a second pass finds nothing to change.
 */
export class NumericCoalescingVisitor extends MathVisitor {
  /**
   * Fresh conversions created during this pass. Pushed onto
   * `fn.allNodes` after the walk so the chain analysis can see them
   * (and mark the value they wrap as consumed by the operator).
   */
  private readonly _freshConversions: ConversionNode[] = []

  override run(fn: MathFunctionNode): void {
    for (const node of fn.allNodes) {
      this.visit(node)
    }
    // The walk is done — publish the conversions. Assigning the
    // per-class index by hand mirrors what `MathNode`'s constructor
    // does for nodes built while the math stack is active (the stack
    // is empty during a visitor pass, so the constructor can't).
    for (const conversion of this._freshConversions) {
      const cls = conversion.constructor.name
      const nextIndex = fn.perClassCounters.get(cls) ?? 0
      conversion.index = nextIndex
      fn.perClassCounters.set(cls, nextIndex + 1)
      fn.allNodes.push(conversion)
    }
    this._freshConversions.length = 0
  }

  override visitBinaryOpNode(node: BinaryOpNode): MathNode {
    const oldL = node.operands[0]
    const oldR = node.operands[1]
    const newL = this.coerce(oldL, node.kind)
    const newR = this.coerce(oldR, node.kind)
    if (newL !== oldL) node.operands[0] = newL
    if (newR !== oldR) node.operands[1] = newR
    return node
  }

  override visitAggregateNode(node: AggregateNode): MathNode {
    for (let i = 0; i < node.inputs.length; i++) {
      const coerced = this.coerce(node.inputs[i], node.kind)
      if (coerced !== node.inputs[i]) {
        node.inputs[i] = coerced
      }
    }
    return node
  }

  override visitUnaryOpNode(node: UnaryOpNode): MathNode {
    const coerced = this.coerce(node.operand, node.kind)
    if (coerced !== node.operand) {
      node.operand = coerced
    }
    return node
  }

  /**
   * Convert `operand` to `kind` if it isn't already in that context.
   * The conversion keeps the operand's own value — only the provider
   * family it compiles into changes.
   */
  private coerce(operand: MathExpressionNode, kind: MathKind): MathExpressionNode {
    if (operand.kind === kind) return operand
    const conversion = new ConversionNode(operand.sandstoneCore, operand, kind)
    this._freshConversions.push(conversion)
    return conversion
  }
}
