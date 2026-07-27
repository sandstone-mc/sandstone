import type { Coordinates, MultipleEntitiesArgument, Registry } from 'sandstone/arguments'
import type { SandstoneCore } from 'sandstone/core/sandstoneCore'
import { coordinatesParser, targetParser } from 'sandstone/variables'
import type { ItemPredicateClass } from 'sandstone/variables/ItemPredicate'
import type { ItemSlotSource } from '../../../commands/implementations/world/item'
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
 *
 * // Check using an inline slot source
 * _.if(_.items.block(abs(0, 64, 0), { type: 'minecraft:slot_range', slots: 'container.0' }, 'minecraft:diamond'), () => { ... })
 * ```
 */
export class ItemsBlockConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private sourcePos: Coordinates,
    private slotSource: ItemSlotSource,
    private itemPredicate: ItemPredicate,
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return ['items', 'block', coordinatesParser(this.sourcePos), this.slotSource, `${this.itemPredicate}`]
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
    private slotSource: ItemSlotSource,
    private itemPredicate: ItemPredicate,
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return ['items', 'entity', targetParser(this.source), this.slotSource, `${this.itemPredicate}`]
  }
}

/**
 * Condition node for counting slots from a slot source on a block entity.
 *
 * @example
 * ```ts
 * _.if(_.slots.block(abs(0, 64, 0), 'container.*'), () => { ... })
 * ```
 */
export class SlotsBlockConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private sourcePos: Coordinates,
    private slotSource: ItemSlotSource,
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return ['slots', 'block', coordinatesParser(this.sourcePos), this.slotSource]
  }
}

/**
 * Condition node for counting slots from a slot source on an entity.
 *
 * @example
 * ```ts
 * _.if(_.slots.entity('@p', 'inventory.*'), () => { ... })
 * ```
 */
export class SlotsEntityConditionNode extends SingleConditionNode {
  constructor(
    sandstoneCore: SandstoneCore,
    private source: MultipleEntitiesArgument,
    private slotSource: ItemSlotSource,
  ) {
    super(sandstoneCore)
  }

  getCondition() {
    return ['slots', 'entity', targetParser(this.source), this.slotSource]
  }
}
