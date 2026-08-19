import type {
  Coordinates,
  Registry,
  MultipleEntitiesArgument,
  ContainerSlotSelector,
  EntitySlotSelector,
  SymbolDataComponent,
} from 'sandstone/arguments'
import type { ItemModifierClass, Macroable, SlotSourceClass } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import type { LiteralUnion, MemberModifiers, NamespacedString, NonEmptyString } from 'sandstone/utils'
import { coordinatesParser, targetParser } from 'sandstone/variables/parsers'
import type { FinalCommandOutput } from '../../helpers'
import { CommandArguments } from '../../helpers'
import { componentPatchStringifier } from '../player/give'

export class ItemCommandNode extends CommandNode {
  command = 'item' as const
}

/**
 * A slot source for the `/item` and `/execute if items/slots` commands.
 *
 * Accepts:
 * - String shorthand slot ranges (e.g. `armor.chest`, `container.*`).
 * - A reference to a registered slot source resource (`namespace:path`).
 * - A `SlotSourceClass` instance.
 * - A `#namespace:path` slot source tag reference.
 *
 * Inline slot source JSON is not supported — use a `SlotSourceClass` instead.
 */
export type ItemSlotSource =
  | ContainerSlotSelector
  | EntitySlotSelector
  | NamespacedString
  | SlotSourceClass
  | `#${string}:${string}`

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
    components: Macroable<MemberModifiers</*Json*/SymbolDataComponent>, MACRO>,
    count: Macroable<number, MACRO>,
  ): FinalCommandOutput

  with(
    item: Macroable<Registry['minecraft:item'], MACRO>,
    countOrNBT?: Macroable<number | MemberModifiers</*Json*/SymbolDataComponent>, MACRO>,
    count?: Macroable<number, MACRO>,
  ) {
    if (typeof countOrNBT === 'object') {
      return this.finalCommand(['with', `${item}${componentPatchStringifier(countOrNBT as any)}`, count])
    }
    return this.finalCommand(['with', item, countOrNBT])
  }

  from = {
    /**
     * @param pos The coordinates of the container to copy items from.
     * @param slotSource The slot source to copy the items from.
     * @param [modifier] An optional modifier to apply.
     */
    block: (
      pos: Macroable<Coordinates<MACRO>, MACRO>,
      slotSource: Macroable<ItemSlotSource, MACRO>,
      modifier?: Macroable<NonEmptyString | ItemModifierClass, MACRO>,
    ) => this.finalCommand(['from', 'block', pos, slotSource, modifier]),

    /**
     * @param targets The entity/entities to copy items from. May target multiple entities; their slots are concatenated.
     * @param slotSource The slot source to copy the items from.
     * @param [modifier] An optional modifier to apply.
     */
    entity: (
      targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
      slotSource: Macroable<ItemSlotSource, MACRO>,
      modifier?: Macroable<NonEmptyString | ItemModifierClass, MACRO>,
    ) => this.finalCommand(['from', 'entity', targetParser(targets), slotSource, modifier]),
  }
}

export class ItemCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ItemCommandNode

  /**
   * Apply item modifiers to inventory slots.
   *
   * @example
   * ```ts
   * item.modify.block(abs(100, 70, 200), 'container.0', 'mypack:enchant_modifier')
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
      slot: Macroable<LiteralUnion<ContainerSlotSelector>, MACRO>,
      modifier: Macroable<NonEmptyString | ItemModifierClass, MACRO>,
    ) => this.finalCommand(['modify', 'block', coordinatesParser(pos), slot, modifier]),

    /**
     * @param targets Entity selector for targets.
     * @param slot Entity slot identifier.
     * @param modifier Item modifier to apply.
     */
    entity: (
      targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
      slot: Macroable<LiteralUnion<EntitySlotSelector>, MACRO>,
      modifier: Macroable<NonEmptyString | ItemModifierClass, MACRO>,
    ) => this.finalCommand(['modify', 'entity', targetParser(targets), slot, modifier]),
  }

  /**
   * Replace items in inventory slots.
   *
   * Slot contents are replaced one-by-one in the order provided by the slot source:
   * when there are more destination slots than source items, remaining slots are ignored;
   * when there are fewer destination slots than source items, remaining items are ignored.
   *
   * @example
   * ```ts
   * item.replace.block(abs(100, 70, 200), 'container.0').with('minecraft:diamond', 5)
   * item.replace.entity('@p', 'weapon.mainhand').from.block(abs(0, 70, 0), 'container.1')
   * ```
   */
  replace = {
    /**
     * @param pos Container block coordinates.
     * @param slotSource Slot source whose slots to replace.
     */
    block: (pos: Macroable<Coordinates<MACRO>, MACRO>, slotSource: Macroable<ItemSlotSource, MACRO>) =>
      this.subCommand(['replace', 'block', pos, slotSource], ItemSourceCommand<MACRO>, false),

    /**
     * @param targets Entity selector for targets.
     * @param slotSource Slot source whose slots to replace.
     */
    entity: (
      targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
      slotSource: Macroable<ItemSlotSource, MACRO>,
    ) => this.subCommand(['replace', 'entity', targetParser(targets), slotSource], ItemSourceCommand<MACRO>, false),
  }

  /**
   * Fill items in inventory slots.
   *
   * Each destination slot is filled with a source item. When there are more destination slots
   * than source items, items repeat cyclically until every slot is filled.
   *
   * @example
   * ```ts
   * item.fill.block(abs(100, 70, 200), 'container.*').with('minecraft:diamond')
   * ```
   */
  fill = {
    /**
     * @param pos Container block coordinates.
     * @param slotSource Slot source whose slots to fill.
     */
    block: (pos: Macroable<Coordinates<MACRO>, MACRO>, slotSource: Macroable<ItemSlotSource, MACRO>) =>
      this.subCommand(['fill', 'block', pos, slotSource], ItemSourceCommand<MACRO>, false),

    /**
     * @param targets Entity selector for targets.
     * @param slotSource Slot source whose slots to fill.
     */
    entity: (
      targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
      slotSource: Macroable<ItemSlotSource, MACRO>,
    ) => this.subCommand(['fill', 'entity', targetParser(targets), slotSource], ItemSourceCommand<MACRO>, false),
  }

  /**
   * Override items in inventory slots.
   *
   * Each destination slot is overridden with the corresponding source item. When there are more
   * destination slots than source items, remaining slots are cleared.
   *
   * @example
   * ```ts
   * item.override.entity('@p', 'inventory.*').with('minecraft:dirt')
   * ```
   */
  override = {
    /**
     * @param pos Container block coordinates.
     * @param slotSource Slot source whose slots to override.
     */
    block: (pos: Macroable<Coordinates<MACRO>, MACRO>, slotSource: Macroable<ItemSlotSource, MACRO>) =>
      this.subCommand(['override', 'block', pos, slotSource], ItemSourceCommand<MACRO>, false),

    /**
     * @param targets Entity selector for targets.
     * @param slotSource Slot source whose slots to override.
     */
    entity: (
      targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
      slotSource: Macroable<ItemSlotSource, MACRO>,
    ) => this.subCommand(['override', 'entity', targetParser(targets), slotSource], ItemSourceCommand<MACRO>, false),
  }
}
