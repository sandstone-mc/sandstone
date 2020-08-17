import { GAMEMODES } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

export class DefaultGamemode extends Command {
  @command('defaultgamemode', { isRoot: true })
  defaultgamemode = (mode: GAMEMODES) => {}
}
