import type { MultiplePlayersArgument, RootNBT } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core'
import { nbtStringifier, targetParser } from 'sandstone/variables'
import type { FinalCommandOutput } from '../../helpers'
import { CommandArguments } from '../../helpers'
import type { Registry } from 'sandstone/arguments/generated/registry'

// Give command

export class GiveCommandNode extends CommandNode {
  command = 'give' as const
}

export class GiveCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = GiveCommandNode

  /**
   * Give items to players.
   * 
   * Adds the specified items directly to player inventories. If inventory is full,
   * excess items are dropped at the player's location. Supports both basic items
   * and complex items with custom NBT data.
   * 
   * **Item Distribution:**
   * - Items go to the first available inventory slots
   * - Follows normal stacking rules (64 for most items, 16 for tools, etc.)
   * - Excess items drop on the ground if inventory is full
   * - Preserves all NBT data including enchantments and custom names
   * 
   * **NBT Support:**
   * - Enchantments: Add any enchantment at any level
   * - Display: Custom names and lore text
   * - Attributes: Modify item stats and properties
   * - Custom: Any additional NBT data for special behaviors
   *
   * @param targets Players to give items to.
   *               Examples: '@p', '@a', 'PlayerName', '@a[team=winners]'
   *
   * @param item The item type to give.
   *            Examples: 'minecraft:diamond', 'minecraft:diamond_sword', 'minecraft:stone'
   *
   * @param count Optional quantity to give (defaults to 1).
   *             Can exceed normal stack limits - will create multiple stacks.
   * 
   * @param nbt Optional NBT data for custom item properties.
   *           Used in the 4-parameter variant for complex items.
   * 
   * @example
   * ```ts
   * // Basic item giving
   * give('@p', 'minecraft:apple', 5)                    // 5 apples to nearest player
   * give('@a', 'minecraft:diamond', 10)                 // 10 diamonds to all players
   * give('PlayerName', 'minecraft:iron_sword')          // 1 iron sword to specific player
   * 
   * // Team and group rewards
   * give('@a[team=red]', 'minecraft:emerald', 20)       // Team rewards
   * give('@a[scores={quest=5..}]', 'minecraft:gold_ingot', 50) // Quest completion
   * 
   * // Custom items with NBT
   * give('@p', 'minecraft:diamond_sword', {
   *   Enchantments: [
   *     {id: 'minecraft:sharpness', lvl: 10},
   *     {id: 'minecraft:unbreaking', lvl: 3}
   *   ],
   *   display: {
   *     Name: '{"text":"Excalibur","color":"gold","bold":true}',
   *     Lore: ['{"text":"A legendary blade","color":"gray","italic":true}']
   *   },
   *   Unbreakable: 1
   * }, 1)
   * 
   * // Custom armor with attributes
   * give('@p', 'minecraft:diamond_chestplate', {
   *   Enchantments: [{id: 'minecraft:protection', lvl: 4}],
   *   AttributeModifiers: [{
   *     AttributeName: 'generic.max_health',
   *     Name: 'health_boost',
   *     Amount: 10.0,
   *     Operation: 0,
   *     UUID: [I; 1, 2, 3, 4]
   *   }]
   * })
   * 
   * // Special items
   * give('@a', 'minecraft:written_book', {
   *   title: 'Server Rules',
   *   author: 'Admin',
   *   pages: ['{"text":"Welcome to the server!"}']
   * })
   * ```
   */
  give(
    targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    item: Macroable<Registry['minecraft:item'], MACRO>,
    count?: Macroable<number, MACRO>,
  ): FinalCommandOutput

  /**
   * Gives an item to one or more players with nbt.
   *
   * @param targets Specifies the target(s) to give item(s) to.
   *
   * @param item Specifies the item to give.
   *
   * @param nbt Specifies the nbt of the item to give.
   *
   * @param count Specifies the number of items to give. If not specified, defaults to `1`.
   */
  give(
    targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    item: Macroable<Registry['minecraft:item'], MACRO>,
    nbt: Macroable<RootNBT, MACRO>,
    count?: Macroable<number, MACRO>,
  ): FinalCommandOutput

  give(
    targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>,
    item: Macroable<Registry['minecraft:item'], MACRO>,
    countOrNBT?: Macroable<number | RootNBT, MACRO>,
    count?: Macroable<number, MACRO>,
  ) {
    if (typeof countOrNBT === 'object') {
      return this.finalCommand([targetParser(targets), `${item}${nbtStringifier(countOrNBT)}`, count])
    }
    return this.finalCommand([targetParser(targets), item, countOrNBT])
  }
}
