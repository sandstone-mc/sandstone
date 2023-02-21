import { CommandNode } from '#core/nodes'
import { coordinatesParser, targetParser } from '#variables'

import { CommandArguments } from '../../helpers'

import type {
  CONTAINER_SLOTS, Coordinates, ENTITY_SLOTS,
  ITEMS, MultipleEntitiesArgument,
} from '#arguments'
import type { ItemModifierClass } from '#core'

export class ItemCommandNode extends CommandNode {
  command = 'item' as const
}

export class ItemSourceCommand extends CommandArguments {
  /**
   * Replace the slot with a specific item.
   * @param item The item to replace the slot with.
   * @param count The amount of items.
   */
  with = (item: ITEMS, count: number) => this.finalCommand(['with', item, count])

  from = {
    /**
     * @param pos The coordinates of the container to copy items from.
     * @param slot The slot to copy the items from.
     * @param [modifier] An optional modifier to apply.
     */
    block: (pos: Coordinates, slot: CONTAINER_SLOTS, modifier?: string | ItemModifierClass) => this.finalCommand(['from', 'block', pos, slot, modifier]),

    /**
     * @param targets The entity to copy items from.
     * @param slot The slot to copy the items from.
     * @param [modifier] An optional modifier to apply.
     */
    entity: (targets: MultipleEntitiesArgument, slot: ENTITY_SLOTS, modifier?: string | ItemModifierClass) => this.finalCommand(['from', 'entity', targetParser(targets), slot, modifier]),
  }
}

/** Replaces or modifies items in inventories */
export class ItemCommand extends CommandArguments {
  protected NodeType = ItemCommandNode

  /** Applies a modifier to a slot in an inventory. */
  modify = {
    /**
     * @param pos The position of the container containing the slot to apply the modifier to.
     * @param slot The slot to apply the modifier to.
     * @param modifier The name of the modifier.
     */
    block: (pos: Coordinates, slot: CONTAINER_SLOTS, modifier: string | ItemModifierClass) => this.finalCommand(['modify', 'block', coordinatesParser(pos), slot, modifier]),

    /**
     * @param targets The entity/entities containing the slot to apply the modifier to.
     * @param slot The slot to apply the modifier to.
     * @param modifier The name of the modifier.
     */
    entity: (targets: MultipleEntitiesArgument, slot: ENTITY_SLOTS, modifier: string | ItemModifierClass) => this.finalCommand(['modify', 'entity', targetParser(targets), slot, modifier]),
  }

  /** Replaces the content of a specific slot of an inventory with another. */
  replace = {
    /**
     * @param pos The position of the container containing the slot to be replaced.
     * @param slot The slot to be replaced.
     */
    block: (pos: Coordinates, slot: CONTAINER_SLOTS) => this.subCommand(['block', pos, slot], ItemSourceCommand, false),

    /**
     * @param targets one or more entities to modify.
     *.
     * @param slot The slot to be replaced.
     */
    entity: (targets: MultipleEntitiesArgument, slot: ENTITY_SLOTS) => this.subCommand(['entity', targetParser(targets), slot], ItemSourceCommand, false),
  }
}
