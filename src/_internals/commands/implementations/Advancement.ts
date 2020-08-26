import { MultipleEntitiesArgument } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

class AdvancementArguments extends Command {
  @command('everything', { isRoot: false, executable: true })
  everything = () => {}

  @command('only', { isRoot: false, executable: true })
  only = (advancement: string, criterion: string) => {}

  @command('from', { isRoot: false, executable: true })
  from = (advancement: string) => {}

  @command('through', { isRoot: false, executable: true })
  through = (advancement: string) => {}

  @command('until', { isRoot: false, executable: true })
  until = (advancement: string) => {}
}

export class Advancement extends Command {
  @command(['avancement', 'grant'], { isRoot: true, hasSubcommands: true, executable: false })
  grant = (targets: MultipleEntitiesArgument) => new AdvancementArguments(this.commandsRoot)

  @command(['avancement', 'revoke'], { isRoot: true, hasSubcommands: true, executable: false })
  revoke = (targets: MultipleEntitiesArgument) => new AdvancementArguments(this.commandsRoot)
}
