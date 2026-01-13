import type { MultiplePlayersArgument } from 'sandstone/arguments'
import type { Macroable, TagClass } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { ItemPredicateClass } from 'sandstone/variables/ItemPredicate'
import { targetParser } from 'sandstone/variables/parsers'
import type { FinalCommandOutput } from '../../helpers'
import { CommandArguments } from '../../helpers'
import type { Registry } from 'sandstone/arguments/generated/registry'

export class ClearCommandNode extends CommandNode {
  command = 'clear' as const
}

export class ClearCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = ClearCommandNode

  /**
   * Clear items from player inventories.
   *
   * Removes items from all inventory slots including main inventory, hotbar,
   * armor slots, offhand, and crafting grid. Can target specific items,
   * limit quantities, or clear everything.
   *
   * Note: To count items without removing them, use
   * `execute.store.result(...).if.items.entity(...)` instead.
   *
   * @param targets Optional player selector specifying whose inventory to clear.
   *               Defaults to command executor if not specified.
   *
   * @param item Optional item type or tag to target for removal.
   *            If not specified, ALL items are cleared.
   *
   * @param maxCount Optional maximum number of items to remove.
   *                If not specified, removes ALL matching items.
   *
   * @example
   * ```ts
   * // Clear everything from your inventory
   * clear()
   *
   * // Clear all items from specific player
   * clear('PlayerName')
   *
   * // Remove specific item types
   * clear('@p', 'minecraft:dirt')
   * clear('@a', 'minecraft:diamond_sword')
   * clear('@p', '#minecraft:boats')
   *
   * // Quantity-limited clearing
   * clear('@p', 'minecraft:cobblestone', 64)
   * ```
   */
  clear(
    targets?: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    item?: Macroable<Registry['minecraft:item'] | TagClass<'item'>, MACRO>,
    maxCount?: Macroable<number, MACRO>,
  ): FinalCommandOutput

  /**
   * Clear items matching an item predicate from player inventories.
   *
   * Uses the item predicate builder for type-safe component matching.
   *
   * Note: To count items without removing them, use
   * `execute.store.result(...).if.items.entity(...)` instead.
   *
   * @param targets Optional player selector specifying whose inventory to clear.
   *               Defaults to command executor if not specified.
   *
   * @param predicate An item predicate built using `ItemPredicate()`.
   *
   * @param maxCount Optional maximum number of items to remove.
   *                If not specified, removes ALL matching items.
   *
   * @example
   * ```ts
   * // Clear enchanted diamond swords
   * clear('@p', ItemPredicate('minecraft:diamond_sword')
   *   .match('minecraft:enchantments', [{ enchantment: 'minecraft:sharpness', levels: { min: 3 } }])
   * )
   *
   * // Clear any item with low durability
   * clear('@a', ItemPredicate('*').match('minecraft:damage', { durability: { max: 10 } }))
   *
   * // Clear items without enchantments
   * clear('@p', ItemPredicate('#minecraft:swords').without('minecraft:enchantments'))
   * ```
   */
  clear(
    targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO> | undefined,
    predicate: ItemPredicateClass,
    maxCount?: Macroable<number, MACRO>,
  ): FinalCommandOutput

  clear(
    targets?: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    itemOrPredicate?: Macroable<Registry['minecraft:item'] | TagClass<'item'>, MACRO> | ItemPredicateClass,
    maxCount?: Macroable<number, MACRO>,
  ) {
    return this.finalCommand([targetParser(targets), `${itemOrPredicate}`, maxCount])
  }
}
