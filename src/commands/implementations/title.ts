import { CommandNode } from '@core'
import { JSONTextComponentClass } from '@variables'

import { CommandArguments } from '../helpers'

import type { JSONTextComponent, MultiplePlayersArgument, TimeArgument } from '@arguments'

export class TitleCommandNode extends CommandNode {
  command = 'title' as const
}

export class TitleArgumentsCommand extends CommandArguments {
  clear = () => this.finalCommand(['clear'])

  reset = () => this.finalCommand(['reset'])

  title = (title: JSONTextComponent) => this.finalCommand(['title', new JSONTextComponentClass(title)])

  subtitle = (subtitle: JSONTextComponent) => this.finalCommand(['subtitle', new JSONTextComponentClass(subtitle)])

  actionbar = (actionbarText: JSONTextComponent) => this.finalCommand(['actionbar', new JSONTextComponentClass(actionbarText)])

  times = (fadeIn: TimeArgument, stay: TimeArgument, fadeOut: TimeArgument) => this.finalCommand(['times', fadeIn, stay, fadeOut])
}

export class TitleCommand extends CommandArguments {
  public NodeType = TitleCommandNode

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
  title = (targets: MultiplePlayersArgument) => this.subCommand([targets], TitleArgumentsCommand, false)
}
