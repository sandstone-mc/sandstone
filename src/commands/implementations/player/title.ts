import { CommandNode } from 'sandstone/core'
import { JSONTextComponentClass, targetParser } from 'sandstone/variables'

import { CommandArguments } from '../../helpers.js'

import type { JSONTextComponent, MultiplePlayersArgument, TimeArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/variables'

export class TitleCommandNode extends CommandNode {
  command = 'title' as const
}

export class TitleArgumentsCommand<MACRO extends boolean> extends CommandArguments {
  clear = () => this.finalCommand(['clear'])

  reset = () => this.finalCommand(['reset'])

  /* @ts-ignore */
  title = (title: Macroable<JSONTextComponent, MACRO>) => this.finalCommand(['title', typeof title === 'object' && title.toMacro ? title : new JSONTextComponentClass(title)])

  /* @ts-ignore */
  subtitle = (subtitle: Macroable<JSONTextComponent, MACRO>) => this.finalCommand(['subtitle', typeof subtitle === 'object' && subtitle.toMacro ? subtitle : new JSONTextComponentClass(subtitle)])

  actionbar = (actionbarText: Macroable<JSONTextComponent, MACRO>) => this.finalCommand(
    /* @ts-ignore */
    ['actionbar', typeof actionbarText === 'object' && actionbarText.toMacro ? actionbarText : new JSONTextComponentClass(actionbarText)],
  )

  times = (fadeIn: Macroable<TimeArgument, MACRO>, stay: Macroable<TimeArgument, MACRO>, fadeOut: Macroable<TimeArgument, MACRO>) => this.finalCommand(['times', fadeIn, stay, fadeOut])
}

export class TitleCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = TitleCommandNode

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
  title = (targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>) => this.subCommand([targetParser(targets)], TitleArgumentsCommand<MACRO>, false)
}
