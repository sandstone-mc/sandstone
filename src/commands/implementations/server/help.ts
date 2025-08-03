import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers.js'

export class HelpCommandNode extends CommandNode {
  command = 'help' as const
}

export class HelpCommand extends CommandArguments {
  protected NodeType = HelpCommandNode

  /**
   * Display command help information.
   *
   * @param command Optional command name to get help for.
   *               If not specified, lists all available commands.
   *
   * @param parameters Additional command parameters for more specific help.
   *
   * @example
   * ```ts
   * help()                    // List all commands
   * help('give')              // Get help for give command
   * help('execute', 'if')     // Get help for execute if subcommand
   * ```
   */
  help = (command?: string, ...parameters: string[]) => this.finalCommand([command, ...parameters])
}
