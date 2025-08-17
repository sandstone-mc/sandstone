import type { MessageOrSelector } from 'sandstone/arguments'
import { CommandNode } from 'sandstone/core/nodes'
import type { AtLeastOne } from 'sandstone/utils'
import { CommandArguments } from '../../helpers.js'

export class TeamMessageCommandNode extends CommandNode {
  command = 'tm' as const
}

export class TeamMessageCommand extends CommandArguments {
  protected NodeType = TeamMessageCommandNode

  /**
   * Send message to your team.
   *
   * @param messages Message content to send to team members.
   *                Multiple arguments are joined with spaces.
   *                Can include entity selectors.
   *
   * @example
   * ```ts
   * teammessage('Enemy spotted at base!')         // Team chat message
   * teammessage('Found', '@e[type=zombie]', 'zombies')  // Message with selectors
   * teammessage('Need backup at coordinates 100 64 200')
   * ```
   */
  teammessage = (...messages: AtLeastOne<MessageOrSelector>) => this.finalCommand(messages)
}
