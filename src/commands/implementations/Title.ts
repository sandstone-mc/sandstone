import { MultipleEntitiesArgument, SelectorArgument } from '@arguments'
import { Command } from '@commands/Command'
import { command } from '@commands/decorators'
import { JSONTextComponentParser, SelectorClass } from '@variables'

import type { JSONTextComponent, MultiplePlayersArgument } from '@arguments'

export class TitleArguments extends Command {
  @command('clear')
  clear = () => {}

  @command('reset')
  reset = () => {}

  @command('title', {
    parsers: {
      '0': (title) => new JSONTextComponentParser(title),
    },
  })
  title = (title: JSONTextComponent) => {}

  @command('subtitle', {
    parsers: {
      '0': (subtitle) => new JSONTextComponentParser(subtitle),
    },
  })
  subtitle = (subtitle: JSONTextComponent) => {}

  @command('actionbar', {
    parsers: {
      '0': (actionbar) => new JSONTextComponentParser(actionbar),
    },
  })
  actionbar = (actionbarText: JSONTextComponent) => {}

  @command('times')
  times = (fadeIn: number, stay: number, fadeOut: number) => {}
}

export class Title extends Command {
  /**
   * Controls text displayed on the screen.
   *
   * @param targets Specifies the player(s) to display a screen title to.
   *
   * @example
   * // Displays a red "Hello World" as title
   * title('@a').title([{text: 'Hello World', color: 'red'}])
   *
   * // Displays a target to kill in the actionbar
   * const target = Selector('@r')
   * title('@a').actionbar(['You target is: ', target])
   */
  @command('title', { isRoot: true, hasSubcommands: true })
  title = (targets: MultiplePlayersArgument) => new TitleArguments(this.commandsRoot)
}
