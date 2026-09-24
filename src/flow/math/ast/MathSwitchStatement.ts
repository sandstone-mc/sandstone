import type { SandstoneCore } from '../../../core/sandstoneCore'
import type { Float, Integer } from './handles'
import type { MathConditionNode } from './MathConditionNode'
import {
  MathCaseNode,
  MathConditionCaseNode,
  MathDefaultCaseNode,
  MathSwitchNode,
} from './nodes/control'

/**
 * Builder for `_.switch(value, cases)` math flow.
 *
 * Mirrors the shape of `flow/switch_case.ts#CaseStatement`:
 *   - `.case(value, callback)` — static value match. Lowerer emits a
 *     case with condition `dispatch == value` (inline
 *     `float_value_check` / `integer_value_check` LootCondition).
 *   - `.case((v) => MathConditionNode, callback)` — condition callback.
 *     Lowerer invokes it with the dispatch handle to get a
 *     `MathConditionNode`, which becomes the case's inline condition.
 *   - `.default(callback)` — terminal branch. Lowerer emits as the
 *     `default` slot of the `number_dispatcher`.
 *
 * Differs from MCFunction flow:
 *   - Math `case` values are `Float | Integer | number` (provider-
 *     trackable), not raw NBT literals.
 *   - No `entries` builder accumulator — cases are stored as
 *     pre-built nodes (`MathCaseNode`/`MathConditionCaseNode`) so the
 *     condition callback is already invoked when the lowerer walks the
 *     statement. MCFunction flow's `CaseStatement` defers callback
 *     invocation to `SwitchNode` construction; math does it eagerly.
 *
 * The final `MathSwitchNode` is built lazily on first `getNode()` call
 * (or `finalize()`), so chained `.case()` calls can each create their
 * own node without a wrapping constructor coordinating them. Builders
 * without any `.default()` still build — `default` is optional.
 */
export class MathSwitchStatement {
  private staticCases: MathCaseNode[] = []

  private conditionCases: MathConditionCaseNode[] = []

  private defaultCase: MathDefaultCaseNode | undefined

  private built: MathSwitchNode | undefined

  constructor(
    protected sandstoneCore: SandstoneCore,
    readonly dispatchValue: Float | Integer,
  ) {}

  /**
   * Add a case to the switch.
   *
   *   - First arg is a `Float | Integer | number` literal handle → static
   *     value match (lowerer emits `dispatch == value` predicate).
   *   - First arg is a `(v) => MathConditionNode` callback → condition
   *     case (lowerer invokes with the dispatch handle).
   *
   * Single signature with a union instead of overloads — TS overload
   * resolution fails on broad unions at the call site when forwarding
   * (e.g. from `executeMathSwitchTuple`).
   */
  case(
    valueOrCallback:
      | Float
      | Integer
      | number
      | ((v: Float | Integer) => MathConditionNode),
    callback: () => void,
  ): this {
    if (typeof valueOrCallback === 'function') {
      this.conditionCases.push(
        new MathConditionCaseNode(this.sandstoneCore, valueOrCallback, callback),
      )
    } else {
      this.staticCases.push(new MathCaseNode(this.sandstoneCore, valueOrCallback, callback))
    }
    return this
  }

  /** Terminal default branch. Only one allowed. */
  default(callback: () => void): this {
    if (this.defaultCase) {
      throw new Error('Math switch: only one `default` branch allowed.')
    }
    this.defaultCase = new MathDefaultCaseNode(this.sandstoneCore, callback)
    return this
  }

  /**
   * Build the `MathSwitchNode` from the accumulated cases. Idempotent:
   * subsequent calls return the same node. `default` is optional; the
   * resulting `MathSwitchNode.defaultCase` may be `undefined`.
   *
   * The lowerer reads the built node to emit a `number_dispatcher`
   * provider (MC's switch-case for number providers — ONE returned
   * value per evaluation). For multi-output math functions, this
   * happens once per output field, with the case body's record value
   * decomposed per field.
   */
  finalize(): MathSwitchNode {
    if (this.built) return this.built
    this.built = new MathSwitchNode(
      this.sandstoneCore,
      this.dispatchValue,
      this.staticCases,
      this.conditionCases,
      this.defaultCase,
    )
    return this.built
  }

  /**
   * Lazy accessor — calls `finalize()` on first read. Use this when you
   * just need the underlying node (e.g. for the lowerer).
   */
  getNode(): MathSwitchNode {
    return this.finalize()
  }
}

/**
 * Tuple form for a single case. Mirrors MCFunction flow's
 * `StaticCase` / `ConditionCase` tuples.
 *
 *   - `['case', value, callback]` — static value match
 *   - `['case', (v) => MathConditionNode, callback]` — condition callback
 *   - `['default', callback]` — terminal branch (optional, at most one)
 */
export type MathSwitchCaseTuple =
  | readonly ['case', Float | Integer | number, () => void]
  | readonly ['case', (v: Float | Integer) => MathConditionNode, () => void]
  | readonly ['default', () => void]

/**
 * Parse a tuple-array input into a `MathSwitchStatement`. Mirrors
 * `flow/switch_case.ts#executeSwitch` for the math DSL.
 *
 * Accepts:
 *   - `[['case', 0, cb], ['case', 1, cb], ['default', cb]]`
 *
 * Throws on multiple `default` entries.
 */
export function executeMathSwitchTuple(
  sandstoneCore: SandstoneCore,
  dispatchValue: Float | Integer,
  cases: readonly MathSwitchCaseTuple[],
): MathSwitchStatement {
  const stmt = new MathSwitchStatement(sandstoneCore, dispatchValue)
  for (const entry of cases) {
    if (entry[0] === 'default') {
      stmt.default(entry[1])
      continue
    }
    const [, conditionOrValue, callback] = entry
    stmt.case(
      conditionOrValue as Float | Integer | number | ((v: Float | Integer) => MathConditionNode),
      callback as () => void,
    )
  }
  return stmt
}