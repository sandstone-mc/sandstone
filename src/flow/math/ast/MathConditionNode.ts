import type { SandstoneCore } from '../../../core/sandstoneCore'
import { MathNode } from './MathNode'

/**
 * Base class for every Math DSL condition node.
 *
 * Conditions are boolean-typed — they do NOT carry a `MathKind` like
 * expression nodes do. They are used by control-flow nodes (`MathIfNode`,
 * `MathCaseNode`) to gate value computation.
 *
 * Lowering rules (MC `number_dispatcher.cases[].condition` accepts inline
 * `LootCondition` JSON via `PredicateRef = Predicate | (ref | PredicateClass)`,
 * so predicates never need their own resource files):
 *
 *   - Comparison / And / Or / Not / PredicateRef / Constant → inline
 *     `LootCondition` JSON embedded directly in the surrounding
 *     `number_dispatcher` case. No separate Predicate resource emitted.
 *   - `McfunctionCheckConditionNode` only → forces a separate MCFunction
 *     resource that writes a flag storage path, plus a `storage`-backed
 *     predicate reading that flag. The MCFunction is the ONLY separate
 *     resource the Math DSL emits for control flow.
 *
 * The Math node itself only carries the operands. No `getValue()` here
 * that knows about JSON shapes — that's the lowerer's job.
 */
export abstract class MathConditionNode extends MathNode {
  constructor(sandstoneCore: SandstoneCore) {
    super(sandstoneCore)
  }

  /**
   * Structural dump. The lowering pass replaces this with the real
   * serialization (inline `LootCondition` JSON, or mcfunction-side setup).
   */
  abstract getValue(): unknown

  /**
   * @internal
   *
   * True iff this condition can be expressed as inline `LootCondition`
   * JSON in a `number_dispatcher.cases[].condition` slot. Used by
   * the compiler to pick the Inline strategy (vs Mixed/Full flow-style
   * mcfunction).
   *
   * Pure-comparison conditions (`ComparisonConditionNode`) and
   * combinators over inlineable children always return true.
   * `McfunctionCheckConditionNode` always returns false.
   */
  canInlineAsLootCondition(): boolean {
    void this
    return true
  }

  /**
   * @internal
   *
   * If this condition's truth value is statically determinable, return
   * it (`true` or `false`). Otherwise `undefined`.
   *
   * Used by DeadBranchVisitor to drop `_.if(false).return(...)` and
   * inline `_.if(true).return(...)`. Combinators over known values
   * (`and(true, false)` → `false`) can fold up the tree.
   */
  evaluateConstant(): boolean | undefined {
    void this
    return undefined
  }
}