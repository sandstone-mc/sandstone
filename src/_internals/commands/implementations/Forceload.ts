import { Coordinates } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class Forceload extends Command {
  @command(['forceload', 'add'], { isRoot: true })
  add = (from: Coordinates, to?: Coordinates) => {}

  @command(['forceload', 'remove'], { isRoot: true })
  remove = (from: Coordinates, to?: Coordinates) => {}

  @command(['forceload', 'remove', 'all'], { isRoot: true })
  removeAll = () => {}

  @command(['forceload', 'query'], { isRoot: true })
  query = (pos?: Coordinates) => {}
}
