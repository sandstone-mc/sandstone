import type { Coordinates, ContainerSlotSelector, EntitySlotSelector, MultipleEntitiesArgument, Registry } from 'sandstone/arguments'
import type { SandstoneCore } from 'sandstone/core/sandstoneCore'
import { coordinatesParser, targetParser } from 'sandstone/variables'
import type { ItemPredicateClass } from 'sandstone/variables/ItemPredicate'
import { SingleConditionNode } from '../condition'

/** Item predicate for matching items in inventory slots. */
export type ItemPredicate = Registry['minecraft:item'] | ItemPredicateClass

/**
 * Condition node for testing items in a block entity's inventory slots.
 *
 * @example
 * ```ts
 * // Check if chest has any diamonds
 * _.if(_.items.block(abs(0, 64, 0), 'container.*', 'minecraft:diamond'), () => { ... })
 * ```
 */
export class ItemsBlockConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private sourcePos: Coordinates,
    private slots: ContainerSlotSelector,
    private itemPredicate: ItemPredicate,
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return ['items', 'block', coordinatesParser(this.sourcePos), this.slots, `${this.itemPredicate}`]
  }
}

/**
 * Condition node for testing items in an entity's inventory slots.
 *
 * @example
 * ```ts
 * // Check if player has any diamonds
 * _.if(_.items.entity('@p', 'inventory.*', 'minecraft:diamond'), () => { ... })
 * ```
 */
export class ItemsEntityConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private source: MultipleEntitiesArgument,
    private slots: EntitySlotSelector,
    private itemPredicate: ItemPredicate,
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return ['items', 'entity', targetParser(this.source), this.slots, `${this.itemPredicate}`]
  }
}
