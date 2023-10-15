import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { ITEMS, MultiplePlayersArgument } from 'sandstone/arguments'
import type { LiteralUnion } from 'sandstone/utils'

// Give command

export class GiveCommandNode extends CommandNode {
  command = 'give' as const
}

export class GiveCommand extends CommandArguments {
  protected NodeType = GiveCommandNode

  /**
   * Gives an item to one or more players.
   *
   * @param targets Specifies the target(s) to give item(s) to.
   *
   * @param item Specifies the item to give.
   *
   * @param count Specifies the number of items to give. If not specified, defaults to `1`.
   */
  give = (targets: MultiplePlayersArgument, item: LiteralUnion<ITEMS>, count?: number) => this.finalCommand([targetParser(targets), item, count])
}
