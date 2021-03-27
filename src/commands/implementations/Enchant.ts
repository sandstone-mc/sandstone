import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { validateIntegerRange } from '@commands/validators'

import type { ENCHANTMENTS, MultipleEntitiesArgument } from 'src/arguments'
import type { LiteralUnion } from '@/generalTypes'

export class Enchant extends Command {
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
  @command('enchant', { isRoot: true })
  enchant = (targets: MultipleEntitiesArgument, enchantment: LiteralUnion<ENCHANTMENTS>, level?: number) => {
    if (level) validateIntegerRange(level, 'level', 0, 2_147_483_647)
  }
}
