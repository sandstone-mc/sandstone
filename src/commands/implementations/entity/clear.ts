import type { MultiplePlayersArgument } from 'sandstone/arguments'
import type { Macroable, TagClass } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'
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
   * @param targets Optional player selector specifying whose inventory to clear.
   *               Defaults to command executor if not specified.
   *               Examples: '@p', '@a', 'PlayerName', '@a[team=red]'
   *
   * @param item Optional item type or tag to target for removal.
   *            If not specified, ALL items are cleared.
   *            Examples:
   *            - 'minecraft:diamond' - specific item type
   *            - '#minecraft:logs' - item tag (all log types)
   *            - 'minecraft:diamond_sword' - specific tool
   *
   * @param maxCount Optional maximum number of items to remove.
   *                If not specified, removes ALL matching items.
   *                Special value `0` enables detection mode - counts items without removing them.
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
   * clear('@p', 'minecraft:dirt')              // All dirt
   * clear('@a', 'minecraft:diamond_sword')     // All diamond swords
   * clear('@p', '#minecraft:boats')            // All boat types
   *
   * // Quantity-limited clearing
   * clear('@p', 'minecraft:cobblestone', 64)   // Remove up to 64 cobblestone
   * clear('@a', 'minecraft:arrow', 32)         // Remove up to 32 arrows each
   *
   * // Detection mode (count without removing)
   * clear('@p', 'minecraft:gold_ingot', 0)     // Count gold ingots
   * clear('@a', '#minecraft:tools', 0)         // Count all tools
   * ```
   */
  clear = (
    targets?: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    item?: Macroable<Registry['minecraft:item'] | TagClass<'items'>, MACRO>,
    maxCount?: Macroable<number, MACRO>,
  ) => this.finalCommand([targetParser(targets), item, maxCount])
}
