import type {
  CONTAINER_SLOTS,
  Coordinates,
  ENTITY_SLOTS,
  Registry['minecraft:item'],
  MultipleEntitiesArgument,
  RootNBT,
} from 'sandstone/arguments'
import type { ItemModifierClass, Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { LiteralUnion } from 'sandstone/utils'
import { nbtStringifier } from 'sandstone/variables'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import type { FinalCommandOutput } from '../../helpers.js'
import { CommandArguments } from '../../helpers.js'
import type { Registry } from 'sandstone/arguments/generated/registry'

export class ItemCommandNode extends CommandNode {
  command = 'item' as const
}

export class ItemSourceCommand<MACRO extends boolean> extends CommandArguments {
  /**
   * Replace the slot with a specific item.
   * @param item The item to replace the slot with.
   * @param count The amount of items. If not specified, defaults to 1.
   */
  with(item: Macroable<Registry['minecraft:item'], MACRO>, count?: Macroable<number, MACRO>): FinalCommandOutput

  /**
   * Replace the slot with a specific item.
   * @param item The item to replace the slot with.
   * @param nbt The nbt of the item to replace the slot with.
   * @param count The amount of items.
   */
  with(
    item: Macroable<Registry['minecraft:item'], MACRO>,
    nbt: Macroable<RootNBT, MACRO>,
    count: Macroable<number, MACRO>,
  ): FinalCommandOutput

  with(
    item: Macroable<Registry['minecraft:item'], MACRO>,
    countOrNBT?: Macroable<number | RootNBT, MACRO>,
    count?: Macroable<number, MACRO>,
  ) {
    if (typeof countOrNBT === 'object') {
      return this.finalCommand(['with', `${item}${nbtStringifier(countOrNBT)}`, count])
    }
    return this.finalCommand(['with', item, countOrNBT])
  }

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

export class ItemCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ItemCommandNode

  /**
   * Apply item modifiers to inventory slots.
   *
   * @example
   * ```ts
   * item.modify.block([100, 70, 200], 'container.0', 'mypack:enchant_modifier')
   * item.modify.entity('@p', 'weapon.mainhand', 'minecraft:enchant_with_levels')
   * ```
   */
  modify = {
    /**
     * @param pos Container block coordinates.
     * @param slot Container slot identifier.
     * @param modifier Item modifier to apply.
     */
    block: (
      pos: Macroable<Coordinates<MACRO>, MACRO>,
      slot: Macroable<LiteralUnion<CONTAINER_SLOTS>, MACRO>,
      modifier: Macroable<string | ItemModifierClass, MACRO>,
    ) => this.finalCommand(['modify', 'block', coordinatesParser(pos), slot, modifier]),

    /**
     * @param targets Entity selector for targets.
     * @param slot Entity slot identifier.
     * @param modifier Item modifier to apply.
     */
    entity: (
      targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
      slot: Macroable<LiteralUnion<ENTITY_SLOTS>, MACRO>,
      modifier: Macroable<string | ItemModifierClass, MACRO>,
    ) => this.finalCommand(['modify', 'entity', targetParser(targets), slot, modifier]),
  }

  /**
   * Replace items in inventory slots.
   *
   * @example
   * ```ts
   * item.replace.block([100, 70, 200], 'container.0').with('minecraft:diamond', 5)
   * item.replace.entity('@p', 'weapon.mainhand').from.block([0, 70, 0], 'container.1')
   * ```
   */
  replace = {
    /**
     * @param pos Container block coordinates.
     * @param slot Container slot to replace.
     */
    block: (pos: Macroable<Coordinates<MACRO>, MACRO>, slot: Macroable<LiteralUnion<CONTAINER_SLOTS>, MACRO>) =>
      this.subCommand(['replace', 'block', pos, slot], ItemSourceCommand<MACRO>, false),

    /**
     * @param targets Entity selector for targets.
     * @param slot Entity slot to replace.
     */
    entity: (
      targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
      slot: Macroable<LiteralUnion<ENTITY_SLOTS>, MACRO>,
    ) => this.subCommand(['replace', 'entity', targetParser(targets), slot], ItemSourceCommand<MACRO>, false),
  }
}
