import {
  JsonTextComponent, MultipleEntitiesArgument, MultiplePlayersArgument, SelectorArgument,
} from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { JsonTextComponentClass, SelectorClass } from '@variables'

export class TitleArguments extends Command {
  @command('clear')
  clear = () => {}

  @command('reset')
  reset = () => {}

  @command('title', {
    parsers: {
      '0': (title) => new JsonTextComponentClass(title),
    },
  })
  title = (title: JsonTextComponent) => {}

  @command('subtitle', {
    parsers: {
      '0': (subtitle) => new JsonTextComponentClass(subtitle),
    },
  })
  subtitle = (subtitle: JsonTextComponent) => {}

  @command('actionbar', {
    parsers: {
      '0': (actionbar) => new JsonTextComponentClass(actionbar),
    },
  })
  actionbar = (actionbarText: JsonTextComponent) => {}

  @command('times')
  times = (fadeIn: number, stay: number, fadeOut: number) => {}
}

export class Title extends Command {
  /**
   * Controls text displayed on the screen.
   *
   * @param targets Specifies the player(s) to display a screen title to.
   */
  @command('title', { isRoot: true, hasSubcommands: true })
  title = (targets: MultiplePlayersArgument) => new TitleArguments(this.commandsRoot)
}
