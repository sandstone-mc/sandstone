import type { MessageOrSelector, MultiplePlayersArgument } from 'sandstone/arguments'
import { CommandNode } from 'sandstone/core/nodes'
import type { AtLeastOne } from 'sandstone/utils'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers'

export class TellCommandNode extends CommandNode<[MultiplePlayersArgument<false>, AtLeastOne<MessageOrSelector>]> {
  command = 'w' as const
}

export class TellCommand<_MACRO extends boolean> extends CommandArguments {
  protected NodeType = TellCommandNode

  /**
   * Send private message to players.
   *
   * @param targets Player selector to send message to.
   *               Examples: '@p', '@a', 'PlayerName'
   *
   * @param messages Message content to send. Multiple arguments joined with spaces.
   *                Can include entity selectors that get resolved to names.
   *
   * @example
   * ```ts
   * tell('@p', 'Hello there!')                    // Private message
   * tell('@a', 'Welcome', '@p', 'to the server')  // Message with selectors
   * tell('PlayerName', 'You have', '5', 'items')  // Multiple message parts
   * ```
   */
  tell = (targets: MultiplePlayersArgument<false>, ...messages: AtLeastOne<MessageOrSelector>) =>
    this.finalCommand([targetParser(targets), messages])
}
