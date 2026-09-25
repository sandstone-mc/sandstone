import type { SandstoneCore } from '../../../../core/sandstoneCore'
import * as util from 'util'
import type { Float, Integer } from '../handles'
import {
  formatMath,
  formatMathLeaf,
  getIndent,
  MATH_NODE_DEFAULT_DEPTH,
} from '../inspectHelpers'
import type { MathExpressionNode } from '../MathExpressionNode'
import { MathConditionNode } from '../MathConditionNode'
import { MathConditionContainerNode } from '../MathConditionContainerNode'
import { LiteralNode } from './leaves'

/**
 * Operators supported by `ComparisonConditionNode`. Map 1:1 to the MC
 * provider's integer/float comparison ops. Lowering converts these to
 * Predicate resource JSON shapes (the Predicate dispatch table covers
 * all of these as `value_check`-style predicates).
 */
export type ComparisonOp = '==' | '!=' | '<' | '<=' | '>' | '>='

/**
 * `x == y`, `x < y`, etc. Both operands are expression nodes (Float or
 * Integer handles). Always lowers to an inline `LootCondition` JSON
 * embedded in the surrounding `number_dispatcher` case — no Predicate
 * resource file emitted.
 *
 * Concrete lowerings:
 *   - `Float == Float` / `Float < Float` / etc. →
 *     `{"condition":"minecraft:float_value_check","value":<x>,"test":<y>}`
 *     (or `{"min":<x>,"max":<y>}` for range form). Both sides accept
 *     `FloatNumberProviderRef` — provider refs, inline JSON, or class
 *     instances all valid.
 *   - `Integer == Integer` / etc. → same with `integer_value_check`.
 *   - `Float op Integer` / `Integer op Float` → lowerer inserts an
 *     implicit `from_int` / `from_float` provider to homogenize kinds.
 *
 * No mcfunction branching needed for pure comparisons — operands are
 * provider refs, evaluable by MC at dispatch time.
 */
export class ComparisonConditionNode extends MathConditionNode {
  /** Type guard. */
  static is(node: unknown): node is ComparisonConditionNode {
    return node instanceof ComparisonConditionNode
  }

  constructor(
    sandstoneCore: SandstoneCore,
    readonly op: ComparisonOp,
    readonly left: MathExpressionNode,
    readonly right: MathExpressionNode,
  ) {
    super(sandstoneCore)
    // Comparison operands are independent values.
  }

  getValue() {
    return {
      type: 'Comparison',
      op: this.op,
      left: this.left.getValue(),
      right: this.right.getValue(),
    }
  }

  /** @internal */
  getStructuralKey(): string {
    return `Comparison:${this.op}:${this.left.getStructuralKey()}:${this.right.getStructuralKey()}`
  }

  /** @internal — comparisons are always inlineable LootConditions. */
  canInlineAsLootCondition(): boolean {
    return true
  }

  /** @internal */
  evaluateConstant(): boolean | undefined {
    const l = this.left.evaluateAsConstant()
    const r = this.right.evaluateAsConstant()
    if (l === undefined || r === undefined) return undefined
    switch (this.op) {
      case '==': return l === r
      case '!=': return l !== r
      case '<': return l < r
      case '<=': return l <= r
      case '>': return l > r
      case '>=': return l >= r
      default: return undefined
    }
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    return formatMath(
      this.inspectClassName,
      `op=${JSON.stringify(this.op)}`,
      [this.left, this.right],
      depth,
      getIndent(options),
    this
    )
  }
}

/**
 * `and(a, b, c, ...)` — all sub-conditions must be true.
 *
 * Always lowers to inline `{"condition":"minecraft:all_of","terms":[...]}`
 * in the surrounding `number_dispatcher` case. No separate Predicate
 * resource, no mcfunction. Children are inlined recursively (their own
 * inline LootCondition JSON, or refs to existing predicates).
 *
 * Empty `and()` trivially holds (`true`) — lowerer drops the term and
 * uses the parent `default` branch.
 */
export class AndConditionNode extends MathConditionContainerNode {
  /** Type guard. */
  static is(node: unknown): node is AndConditionNode {
    return node instanceof AndConditionNode
  }

  constructor(
    sandstoneCore: SandstoneCore,
    conditions: MathConditionNode[],
  ) {
    super(sandstoneCore)
    this._body = conditions
  }

  getValue() {
    return {
      type: 'And',
      conditions: this.body.map((c) => c.getValue()),
    }
  }

  /** @internal */
  getStructuralKey(): string {
    return `And:${this.body.map((c) => c.getStructuralKey()).join('|')}`
  }

  /** @internal */
  canInlineAsLootCondition(): boolean {
    return this.body.every((c) => c.canInlineAsLootCondition())
  }

  /** @internal */
  evaluateConstant(): boolean | undefined {
    let sawUnknown = false
    for (const c of this.body) {
      const v = c.evaluateConstant()
      if (v === undefined) { sawUnknown = true; continue }
      if (v === false) return false // short-circuit: any false → false
    }
    if (sawUnknown) return undefined
    return true // all true
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    return formatMath(this.inspectClassName, undefined, this.body, depth, getIndent(options), this)
  }
}

/**
 * `or(a, b, c, ...)` — at least one sub-condition must be true.
 *
 * Always lowers to inline `{"condition":"minecraft:any_of","terms":[...]}`
 * in the surrounding `number_dispatcher` case. No separate resource.
 *
 * Empty `or()` trivially fails (`false`) — lowerer skips the parent
 * case entirely.
 */
export class OrConditionNode extends MathConditionContainerNode {
  /** Type guard. */
  static is(node: unknown): node is OrConditionNode {
    return node instanceof OrConditionNode
  }

  constructor(
    sandstoneCore: SandstoneCore,
    conditions: MathConditionNode[],
  ) {
    super(sandstoneCore)
    this._body = conditions
  }

  getValue() {
    return {
      type: 'Or',
      conditions: this.body.map((c) => c.getValue()),
    }
  }

  /** @internal */
  getStructuralKey(): string {
    return `Or:${this.body.map((c) => c.getStructuralKey()).join('|')}`
  }

  /** @internal */
  canInlineAsLootCondition(): boolean {
    return this.body.every((c) => c.canInlineAsLootCondition())
  }

  /** @internal */
  evaluateConstant(): boolean | undefined {
    let sawUnknown = false
    for (const c of this.body) {
      const v = c.evaluateConstant()
      if (v === undefined) { sawUnknown = true; continue }
      if (v === true) return true // short-circuit
    }
    if (sawUnknown) return undefined
    return false
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    return formatMath(this.inspectClassName, undefined, this.body, depth, getIndent(options), this)
  }
}

/**
 * `not(c)` — inverts a single sub-condition.
 *
 * Always lowers to inline `{"condition":"minecraft:inverted","term":<inner>}`
 * in the surrounding `number_dispatcher` case. No separate resource,
 * no mcfunction — even when `c` itself would be `McfunctionCheck`, the
 * inversion still inlines (the inner mcfunction is the separate resource,
 * the inversion just wraps its predicate ref).
 */
export class NotConditionNode extends MathConditionNode {
  /** Type guard. */
  static is(node: unknown): node is NotConditionNode {
    return node instanceof NotConditionNode
  }

  constructor(
    sandstoneCore: SandstoneCore,
    readonly condition: MathConditionNode,
  ) {
    super(sandstoneCore)
    // Operand stays parent-less (independent condition).
  }

  getValue() {
    return {
      type: 'Not',
      condition: this.condition.getValue(),
    }
  }

  /** @internal */
  getStructuralKey(): string {
    return `Not:${this.condition.getStructuralKey()}`
  }

  /** @internal */
  canInlineAsLootCondition(): boolean {
    return this.condition.canInlineAsLootCondition()
  }

  /** @internal */
  evaluateConstant(): boolean | undefined {
    const v = this.condition.evaluateConstant()
    if (v === undefined) return undefined
    return !v
  }

  [util.inspect.custom](depth: number = MATH_NODE_DEFAULT_DEPTH, options?: unknown): string {
    return formatMath(this.inspectClassName, undefined, [this.condition], depth, getIndent(options), this)
  }
}

/**
 * Reference to an existing Predicate resource (built outside the Math
 * DSL and imported via id). Lowering inlines the resource id into the
 * generated Predicate's composition.
 *
 * `predicate` is intentionally typed `unknown` here — the actual
 * `PredicateClass` type lives in `core/resources/datapack/predicate.ts`
 * and would create a circular import. The lowering pass imports the
 * real type when it walks this node.
 */
export class PredicateRefConditionNode extends MathConditionNode {
  /** Type guard. */
  static is(node: unknown): node is PredicateRefConditionNode {
    return node instanceof PredicateRefConditionNode
  }

  constructor(
    sandstoneCore: SandstoneCore,
    readonly predicate: unknown,
  ) {
    super(sandstoneCore)
  }

  getValue() {
    return {
      type: 'PredicateRef',
      predicate: '<PredicateClass>',
    }
  }

  [util.inspect.custom](_depth?: number, options?: unknown): string {
    return formatMathLeaf(this.inspectClassName, [['predicate', '<PredicateClass>']], getIndent(options), this)
  }
}

/**
 * Condition that requires an mcfunction to evaluate. `callback` runs
 * imperatively (e.g., mutating state, calling other mcfunctions, using
 * sleep, etc.) and must set a known flag storage path to 1 (true) or 0
 * (false) before returning.
 *
 * Lowering:
 *   - Generates a child MCFunction named after the Math DSL call site
 *     that runs the callback and writes the flag.
 *   - Emits a Predicate resource that reads the flag path via
 *     `storage` predicate.
 *
 * This is the "branching" path — it forces an mcfunction to exist for
 * the Math DSL evaluation. Use only when no pure-predicate form exists.
 */
export class McfunctionCheckConditionNode extends MathConditionNode {
  /** Type guard. */
  static is(node: unknown): node is McfunctionCheckConditionNode {
    return node instanceof McfunctionCheckConditionNode
  }

  constructor(
    sandstoneCore: SandstoneCore,
    readonly callback: () => void,
    readonly flagStoragePath: string = '__sandstone:math_flag',
  ) {
    super(sandstoneCore)
    this.callback()
  }

  getValue() {
    return {
      type: 'McfunctionCheck',
      flagStoragePath: this.flagStoragePath,
    }
  }

  [util.inspect.custom](_depth?: number, options?: unknown): string {
    return formatMathLeaf(this.inspectClassName, [['flagStoragePath', this.flagStoragePath]], getIndent(options), this)
  }
}

/**
 * Always-true / always-false condition. Lowering drops these (no
 * Predicate emitted) and uses the `default` branch of the surrounding
 * `number_dispatcher` provider.
 */
export class ConstantConditionNode extends MathConditionNode {
  /** Type guard. */
  static is(node: unknown): node is ConstantConditionNode {
    return node instanceof ConstantConditionNode
  }

  constructor(
    sandstoneCore: SandstoneCore,
    readonly value: boolean,
  ) {
    super(sandstoneCore)
  }

  getValue() {
    return {
      type: 'Constant',
      value: this.value,
    }
  }

  [util.inspect.custom](_depth?: number, options?: unknown): string {
    return formatMathLeaf(this.inspectClassName, [['value', this.value]], getIndent(options), this)
  }
}

// ---------------------------------------------------------------------------
// Convenience constructors — used by `handles.ts` operator methods that
// produce condition nodes (`['=='](other)`).
// ---------------------------------------------------------------------------

export function compare(
  core: SandstoneCore,
  op: ComparisonOp,
  left: Float | Integer,
  right: Float | Integer | number,
): ComparisonConditionNode {
  // Unwrap handles via `.node`; a raw number literal becomes a
  // `LiteralNode` so the resulting condition carries a real
  // expression at runtime (the comparison ctor's `left: MathExpressionNode`
  // slots would otherwise receive `undefined` for `1` and crash the
  // AST inspector).
  //
  // `right` literals here are `internal` — the user wrote a
  // positional number (`scale['=='](1)`), not a standalone variable.
  // They should not duplicate at the top of the audit trail;
  // logging them only inside the condition is correct.
  const leftNode = left.node
  const rightNode: MathExpressionNode =
    typeof right === 'number' ? new LiteralNode(core, right) : right.node
  if (typeof right === 'number') rightNode.internal = true
  return new ComparisonConditionNode(core, op, leftNode, rightNode)
}

export function andOf(
  core: SandstoneCore,
  conditions: MathConditionNode[],
): AndConditionNode {
  return new AndConditionNode(core, conditions)
}

export function orOf(
  core: SandstoneCore,
  conditions: MathConditionNode[],
): OrConditionNode {
  return new OrConditionNode(core, conditions)
}

export function notOf(
  core: SandstoneCore,
  condition: MathConditionNode,
): NotConditionNode {
  return new NotConditionNode(core, condition)
}