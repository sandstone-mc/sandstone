import type { LiteralUnion } from '@/generalTypes'
import type { BLOCKS, Coordinates } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { coordinatesParser } from '@variables'

export class FillArguments extends Command {
  @command('destroy')
  destroy = () => { }

  @command('hollow')
  hollow = () => { }

  @command('keep')
  keep = () => { }

  @command('outline')
  outline = () => { }

  @command('replace')
  replace = (filter?: LiteralUnion<BLOCKS>) => { }
}

export class Fill extends Command {
  @command('fill', {
    isRoot: true, executable: true, hasSubcommands: true, parsers: { '0': coordinatesParser, '1': coordinatesParser },
  })
  fill = (from: Coordinates, to: Coordinates, block: LiteralUnion<BLOCKS>) => FillArguments
}
