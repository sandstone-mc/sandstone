import { LiteralUnion } from '@/generalTypes'
import { ENCHANTMENTS, SelectorArgument } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class Enchant extends Command {
  @command('enchant', { isRoot: true })
  enchant = (targets: SelectorArgument<false>, enchantment: LiteralUnion<ENCHANTMENTS>, level?: number) => {}
}
