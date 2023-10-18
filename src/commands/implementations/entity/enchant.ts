import { validateIntegerRange } from 'sandstone/commands/validators'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { ENCHANTMENTS, MultipleEntitiesArgument } from 'sandstone/arguments'
import type { LiteralUnion } from 'sandstone/utils'
import type { Macroable } from 'sandstone/variables'

export class EnchantCommandNode extends CommandNode {
  command = 'enchant' as const
}

export class EnchantCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = EnchantCommandNode

  /**
   * Adds an enchantment to a player's selected item, subject to the same restrictions as an anvil.
   *
   * @param targets Specifies the target(s).
   *
   * @param enchantment Specifies the enchantment to be added to the item held by the target.
   *
   * @param level Specifies the enchantment level.
   * Should be not greater than the maximum level for the specified enchantment.
   * If not specified, defaults to `1`.
   *
   * It must be between 0 and 2_147_483_647 (inclusive).
   */
  enchant = (targets: Macroable<MultipleEntitiesArgument<MACRO>, MACRO>, enchantment: Macroable<LiteralUnion<ENCHANTMENTS>, MACRO>, level?: number) => {
    if (level) validateIntegerRange(level, 'level', 0, 2_147_483_647)
    return this.finalCommand([targetParser(targets), enchantment, level])
  }
}
