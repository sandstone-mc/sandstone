import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

class DatapackEnable extends Command {
  @command('first')
  first = () => {}

  @command('last')
  last = () => {}

  @command('before')
  before = (name: string) => {}

  @command('after')
  after = (name: string) => {}
}

export class DatapackCommand extends Command {
  @command(['datapack', 'disable'], { isRoot: true })
  disable = (name: string) => {}

  @command(['datapack', 'enable'], { isRoot: true, hasSubcommands: true })
  enable = (name: string) => new DatapackEnable(this.commandsRoot)

  @command(['datapack', 'list'], { isRoot: true })
  list = (type: 'available' | 'enabled') => {}
}
