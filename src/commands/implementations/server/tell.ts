import { CommandNode } from '#core/nodes'

import { CommandArguments } from '../../helpers'

import type { MessageOrSelector, MultiplePlayersArgument } from '#arguments'
import type { AtLeastOne } from '#utils'

export class TellCommandNode extends CommandNode<[MultiplePlayersArgument, AtLeastOne<MessageOrSelector>]> {
  command = 'w' as const
}

export class TellCommand extends CommandArguments {
  protected NodeType = TellCommandNode

  /**
   * Sends a private message to one or more players.
   * @param targets Specifies the player(s) to send the message to.
   * @param messages Specified the message to tell. They will be joined with whitespaces.
   * Can include target selectors.
   * The game replaces entity selectors in the message with the list of selected entities' names,
   * which is formatted as "name1 and name2" for two entities, or "name1, name2, ... and namen" for n entities.
   */
  tell = (targets: MultiplePlayersArgument, ...messages: AtLeastOne<MessageOrSelector>) => this.finalCommand([targets, messages])
}
