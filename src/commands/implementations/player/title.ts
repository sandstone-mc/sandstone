import type { JSONTextComponent, MultiplePlayersArgument, TimeArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { parseJSONText } from 'sandstone/variables/JSONTextComponentClass'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'

export class TitleCommandNode extends CommandNode {
  command = 'title' as const
}

export class TitleArgumentsCommand<MACRO extends boolean> extends CommandArguments {
  clear = () => this.finalCommand(['clear'])

  reset = () => this.finalCommand(['reset'])

  title = (title: Macroable<JSONTextComponent, MACRO>) =>
    this.finalCommand(['title', parseJSONText(this.sandstoneCore, title)])

  subtitle = (subtitle: Macroable<JSONTextComponent, MACRO>) =>
    this.finalCommand(['subtitle', parseJSONText(this.sandstoneCore, subtitle)])

  actionbar = (actionbarText: Macroable<JSONTextComponent, MACRO>) =>
    this.finalCommand(['actionbar', parseJSONText(this.sandstoneCore, actionbarText)])

  times = (
    fadeIn: Macroable<TimeArgument, MACRO>,
    stay: Macroable<TimeArgument, MACRO>,
    fadeOut: Macroable<TimeArgument, MACRO>,
  ) => this.finalCommand(['times', fadeIn, stay, fadeOut])
}

export class TitleCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = TitleCommandNode

  /**
   * Display title text on player screens.
   *
   * @param targets Player selector to show title to.
   *               Examples: '@p', '@a', 'PlayerName', '@a[team=red]'
   *
   * @example
   * ```ts
   * title('@a').title('Hello World')                    // Main title
   * title('@p').subtitle('Welcome back!')               // Subtitle
   * title('@a').actionbar('Health: 20/20')             // Action bar text
   * title('@p').times(10, 70, 20)                      // Fade in/stay/fade out ticks
   * title('@a').clear()                                 // Clear current title
   * ```
   */
  title = (targets: Macroable<MultiplePlayersArgument<MACRO>, MACRO>) =>
    this.subCommand([targetParser(targets)], TitleArgumentsCommand<MACRO>, false)
}
