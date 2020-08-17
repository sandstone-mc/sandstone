import { LiteralUnion } from '@/generalTypes'
import { BLOCKS, Coordinates } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class FillArguments extends Command {
  @command('destroy')
  destroy = () => {}

  @command('hollow')
  hollow = () => {}

  @command('keep')
  keep = () => {}

  @command('outline')
  outline = () => {}

  @command('replace')
  replace = (filter?: LiteralUnion<BLOCKS>) => {}
}

export class Fill extends Command {
  @command('fill', { isRoot: true, executable: true, hasSubcommands: true })
  fill = (from: Coordinates, to: Coordinates, block: LiteralUnion<BLOCKS>) => FillArguments
}
