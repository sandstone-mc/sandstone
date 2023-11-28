import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type {
  CONTAINER_SLOTS, Coordinates, ENTITY_SLOTS,
  ITEMS, MultipleEntitiesArgument,
} from 'sandstone/arguments'
import type { ItemModifierClass, Macroable } from 'sandstone/core'
import type { LiteralUnion } from 'sandstone/utils'

export class ItemCommandNode extends CommandNode {
  command = 'item' as const
}

export class ItemSourceCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Replace the slot with a specific item.
   * @param item The item to replace the slot with.
   * @param count The amount of items.
   */
  with = (item: Macroable<LiteralUnion<ITEMS>, MACRO>, count: Macroable<number, MACRO>) => this.finalCommand(['with', item, count])

  from = {
    /**
     * @param pos The coordinates of the container to copy items from.
     * @param slot The slot to copy the items from.
     * @param [modifier] An optional modifier to apply.
     */
    block: (
      pos: Macroable<Coordinates<MACRO>, MACRO>,
      slot: Macroable<LiteralUnion<CONTAINER_SLOTS>, MACRO>,
      modifier?: Macroable<string | ItemModifierClass, MACRO>,
    ) => this.finalCommand(['from', 'block', pos, slot, modifier]),

    /**
     * @param targets The entity to copy items from.
     * @param slot The slot to copy the items from.
     * @param [modifier] An optional modifier to apply.
     */
    entity: (
      targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
      slot: Macroable<LiteralUnion<ENTITY_SLOTS>, MACRO>,
      modifier?: Macroable<string | ItemModifierClass, MACRO>,
    ) => this.finalCommand(['from', 'entity', targetParser(targets), slot, modifier]),
  }
}

/** Replaces or modifies items in inventories */
export class ItemCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ItemCommandNode

  /** Applies a modifier to a slot in an inventory. */
  modify = {
    /**
     * @param pos The position of the container containing the slot to apply the modifier to.
     * @param slot The slot to apply the modifier to.
     * @param modifier The name of the modifier.
     */
    block: (
      pos: Macroable<Coordinates<MACRO>, MACRO>,
      slot: Macroable<LiteralUnion<CONTAINER_SLOTS>, MACRO>,
      modifier: Macroable<string | ItemModifierClass, MACRO>,
    ) => this.finalCommand(['modify', 'block', coordinatesParser(pos), slot, modifier]),

    /**
     * @param targets The entity/entities containing the slot to apply the modifier to.
     * @param slot The slot to apply the modifier to.
     * @param modifier The name of the modifier.
     */
    entity: (
      targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
      slot: Macroable<LiteralUnion<ENTITY_SLOTS>, MACRO>,
      modifier: Macroable<string | ItemModifierClass, MACRO>,
    ) => this.finalCommand(['modify', 'entity', targetParser(targets), slot, modifier]),
  }

  /** Replaces the content of a specific slot of an inventory with another. */
  replace = {
    /**
     * @param pos The position of the container containing the slot to be replaced.
     * @param slot The slot to be replaced.
     */
    block: (pos: Macroable<Coordinates<MACRO>, MACRO>, slot: Macroable<LiteralUnion<CONTAINER_SLOTS>, MACRO>) => this.subCommand(['block', pos, slot], ItemSourceCommand<MACRO>, false),

    /**
     * @param targets one or more entities to modify.
     *.
     * @param slot The slot to be replaced.
     */
    entity: (
      targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
      slot: Macroable<LiteralUnion<ENTITY_SLOTS>, MACRO>,
    ) => this.subCommand(['entity', targetParser(targets), slot], ItemSourceCommand<MACRO>, false),
  }
}
