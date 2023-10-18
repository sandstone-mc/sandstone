import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers.js'

import type { Macroable } from 'sandstone/variables'

export class HelpCommandNode extends CommandNode {
  command = 'help' as const
}

export class HelpCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = HelpCommandNode

  /**
   * Shows usages for one command, or lists of commands.
   *
   * @param command_ Specifies the command name to provide help for.
   * Entering more specific parameters of that command is allowed.
   *
   * If unspecified, lists all commands.
   *
   * @param parameters More specific parameters of the command.
   */
  help = (command?: string, ...parameters: string[]) => this.finalCommand([command, ...parameters])
}
