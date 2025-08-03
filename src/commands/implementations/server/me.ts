import type { MultipleEntitiesArgument } from 'sandstone/arguments'
import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'

export class MeCommandNode extends CommandNode<[string[]]> {
  command = 'me' as const
}

export class MeCommand extends CommandArguments {
  protected NodeType = MeCommandNode

  /**
   * Send action message describing what you are doing.
   *
   * @param actions Text segments and entity selectors for the action message.
   *               Multiple arguments joined with spaces.
   *               Entity selectors get resolved to player names.
   *
   * @example
   * ```ts
   * me('waves at everyone')              // "* PlayerName waves at everyone"
   * me('thanks', '@p', 'for the help')   // "* PlayerName thanks NearestPlayer for the help"
   * me('activates the ancient mechanism')
   * ```
   */
  me = (...actions: (string | MultipleEntitiesArgument<false>)[]) => this.finalCommand(actions.map(targetParser))
}
