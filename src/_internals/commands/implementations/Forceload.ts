import { Coordinates, coordinatesParser } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class Forceload extends Command {
  @command(['forceload', 'add'], { isRoot: true, parsers: { '0': coordinatesParser, '1': coordinatesParser } })
  add = (from: Coordinates, to?: Coordinates) => { }

  @command(['forceload', 'remove'], { isRoot: true, parsers: { '0': coordinatesParser, '1': coordinatesParser } })
  remove = (from: Coordinates, to?: Coordinates) => { }

  @command(['forceload', 'remove', 'all'], { isRoot: true })
  removeAll = () => { }

  @command(['forceload', 'query'], { isRoot: true, parsers: { '0': coordinatesParser } })
  query = (pos?: Coordinates) => { }
}
