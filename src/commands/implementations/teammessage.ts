import { CommandNode } from '#core/nodes'

import { CommandArguments } from '../helpers'

import type { MessageOrSelector } from '#arguments'
import type { AtLeastOne } from '#utils'

export class TeamMessageCommandNode extends CommandNode {
  command = 'tm' as const
}

export class TeamMessageCommand extends CommandArguments {
  protected NodeType = TeamMessageCommandNode

  /**
   * Specifies a message to send to team.
   *
   * @param messages Must be plain text messages.
   * Can include spaces as well as target selectors.
   * The game replaces entity selectors in the message with the list of selected entities' names,
   * which is formatted as "name1 and name2" for two entities, or "name1, name2, ... and namen" for n entities.
   *
   * At least one message is necesarry.
   */
  teammessage = (...messages: AtLeastOne<MessageOrSelector>) => { }
}
