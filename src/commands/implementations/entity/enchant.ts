import type { MultipleEntitiesArgument } from 'sandstone/arguments'
import { validateIntegerRange } from 'sandstone/commands/validators'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'
import type { Registry } from 'sandstone/arguments/generated/registry'

export class EnchantCommandNode extends CommandNode {
  command = 'enchant' as const
}

export class EnchantCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = EnchantCommandNode

  /**
   * Add an enchantment to players' held items.
   *
   * Applies the specified enchantment to the item currently held by the
   * targeted players, following anvil enchantment rules and restrictions.
   *
   * @param targets Players whose held items will be enchanted.
   *               Examples: '@p', '@a', 'PlayerName', '@a[tag=winners]'
   *
   * @param enchantment The enchantment to apply.
   *                   Examples: 'minecraft:sharpness', 'minecraft:efficiency', 'minecraft:protection'
   *
   * @param level Optional enchantment level (1-2,147,483,647).
   *             Defaults to 1 if not specified.
   *
   * @example
   * ```ts
   * enchant('@p', 'minecraft:sharpness', 5)        // Sharpness V weapon
   * enchant('@a', 'minecraft:efficiency', 3)       // Efficiency III tools
   * enchant('@p', 'minecraft:protection', 4)       // Protection IV armor
   * enchant('@a[tag=miners]', 'minecraft:fortune', 3) // Fortune III for miners
   * ```
   */
  enchant = (
    targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>,
    enchantment: Macroable<Registry['minecraft:enchantment'], MACRO>,
    level?: number,
  ) => {
    if (level) validateIntegerRange(level, 'level', 0, 2_147_483_647)
    return this.finalCommand([targetParser(targets), enchantment, level])
  }
}
