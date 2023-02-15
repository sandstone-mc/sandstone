import { validateIntegerRange } from '#commands/validators'
import { CommandNode } from '#core/nodes'

import { CommandArguments } from '../../helpers'

import type { ENCHANTMENTS, MultipleEntitiesArgument } from '#arguments'
import type { LiteralUnion } from '#utils'

export class EnchantCommandNode extends CommandNode {
  command = 'enchant' as const
}

export class EnchantCommand extends CommandArguments {
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
  enchant = (targets: MultipleEntitiesArgument, enchantment: LiteralUnion<ENCHANTMENTS>, level?: number) => {
    if (level) validateIntegerRange(level, 'level', 0, 2_147_483_647)
    return this.finalCommand([targets, enchantment, level])
  }
}
