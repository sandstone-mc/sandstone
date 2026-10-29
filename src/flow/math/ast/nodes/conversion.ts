import * as util from 'util'
import type { SandstoneCore } from '../../../../core/sandstoneCore'
import { formatMathLeaf, getIndent } from '../inspectHelpers'
import type { MathKind } from '../MathExpressionNode'
import { MathExpressionNode } from '../MathExpressionNode'

/**
 * An explicit numeric conversion — MC's `from_int` / `from_float`
 * providers, as an AST node.
 *
 * MC's two number-provider families are separate: a
 * `context_float_provider` tree holds float providers, a
 * `context_int_provider` tree holds int providers. The two bridges
 * between them are the `from_int` provider (a FLOAT provider whose
 * input is an INT provider — widens exactly) and `from_float` (an INT
 * provider whose input is a FLOAT provider — truncates toward zero).
 *
 * A `ConversionNode` is one of those bridges:
 *
 *   - `targetKind === 'float'` → lowers to `{"type": "from_int", …}`.
 *   - `targetKind === 'integer'` → lowers to `{"type": "from_float", …}`.
 *
 * The node's `kind` is the TARGET kind — the kind of the value the
 * conversion produces. The source keeps its own kind and compiles in
 * its own provider family.
 *
 * Inserted by `NumericCoalescingVisitor` wherever an operand's kind
 * doesn't match the operator consuming it — the AST-level record of
 * the numeric tower's bridging step.
 */
export class ConversionNode extends MathExpressionNode {
  /** Type guard. */
  static is(node: unknown): node is ConversionNode {
    return node instanceof ConversionNode
  }

  /**
   * The kind of the value this conversion PRODUCES. Matches the
   * provider family the conversion lowers into: `from_int` produces a
   * float, `from_float` produces an integer.
   */
  readonly kind: MathKind

  constructor(
    sandstoneCore: SandstoneCore,
    /** The value being converted — compiled in ITS OWN family. */
    public source: MathExpressionNode,
    /** The kind the conversion produces. */
    readonly targetKind: MathKind,
  ) {
    super(sandstoneCore)
    this.kind = targetKind
  }

  /**
   * The chain analysis walks `operands[0]` / `inputs[0]` to find a
   * node's chain root. Exposing the source as the single operand
   * makes the conversion transparent to that walk — a conversion
   * doesn't break the chain, it just sits in front of it.
   */
  get operands(): [MathExpressionNode] {
    return [this.source]
  }

  getValue() {
    return {
      type: 'Conversion',
      kind: this.kind,
      source: this.source.getValue(),
    }
  }

  /** @internal */
  getStructuralKey(): string {
    return `Conversion(${this.kind}):${this.source.getStructuralKey()}`
  }

  /**
   * @internal
   *
   * Fold a constant source through the conversion, mirroring MC's
   * runtime semantics exactly (both verified live against the
   * server):
   *
   *   - `from_float` TRUNCATES TOWARD ZERO — `from_float(-2.5)` is
   *     `-2`, not `-3` (MC's int providers do not floor).
   *   - `from_int` widens to single precision — the value passes
   *     through `Math.fround`, so `from_int(16777217)` is
   *     `16777216.0`.
   *
   * A `from_float` result outside the 32-bit int range is `0` in MC
   * (the same out-of-range rule the int providers follow). The
   * `LiteralNode` int32 check rejects it at compile time instead —
   * a compile-time error beats a pack that quietly computes the
   * wrong number.
   */
  evaluateAsConstant(): number | undefined {
    const value = this.source.evaluateAsConstant()
    if (value === undefined) return undefined
    if (this.kind === 'integer') {
      return Math.trunc(Math.fround(value))
    }
    return Math.fround(value)
  }

  [util.inspect.custom](_depth?: number, options?: unknown): string {
    return formatMathLeaf(this.inspectClassName, [
      ['kind', this.kind],
      ['source', this.source.inspectClassName],
    ], getIndent(options), this)
  }
}
