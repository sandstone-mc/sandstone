import type { SandstoneCore } from 'sandstone/core'
import { SingleConditionNode } from '../condition'

/**
 * Condition node representing a slot source being tested against `@s`.
 *
 * Expands to `execute if slots entity @s <slotSource>`, which counts the number of slots from
 * the slot source that are present on the executing entity.
 */
export class SlotSourceConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    public slotSource: string,
  ) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    return ['slots', 'entity', '@s', this.slotSource]
  }
}
