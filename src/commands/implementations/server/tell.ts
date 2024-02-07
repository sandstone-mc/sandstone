import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { MessageOrSelector, MultiplePlayersArgument } from 'sandstone/arguments'
import type { AtLeastOne } from 'sandstone/utils'

export class TellCommandNode extends CommandNode<[MultiplePlayersArgument<false>, AtLeastOne<MessageOrSelector>]> {
  command = 'w' as const
}

export class TellCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = TellCommandNode

  /**
   * Sends a private message to one or more players.
   * @param targets Specifies the player(s) to send the message to.
   * @param messages Specified the message to tell. They will be joined with whitespaces.
   * Can include target selectors.
   * The game replaces entity selectors in the message with the list of selected entities' names,
   * which is formatted as "name1 and name2" for two entities, or "name1, name2, ... and namen" for n entities.
   */
  tell = (targets: MultiplePlayersArgument<false>, ...messages: AtLeastOne<MessageOrSelector>) => this.finalCommand([targetParser(targets), messages])
}
