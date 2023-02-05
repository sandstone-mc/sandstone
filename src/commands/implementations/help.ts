import { CommandNode } from '@core/nodes'

import { CommandArguments } from '../helpers'

export class HelpCommandNode extends CommandNode {
  command = 'help' as const
}

export class HelpCommand extends CommandArguments {
  public NodeType = HelpCommandNode

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
