import { CommandNode } from '@core/nodes'

import { CommandArguments } from '../helpers'

import type { ITEMS, MultiplePlayersArgument } from '@arguments'
import type { LiteralUnion } from '@utils'

// Give command

export class GiveCommandNode extends CommandNode {
  command = 'give' as const
}

export class GiveCommand extends CommandArguments {
  public NodeType = GiveCommandNode

  /**
   * Gives an item to one or more players.
   *
   * @param targets Specifies the target(s) to give item(s) to.
   *
   * @param item Specifies the item to give.
   *
   * @param count Specifies the number of items to give. If not specified, defaults to `1`.
   */
  give = (targets: MultiplePlayersArgument, item: LiteralUnion<ITEMS>, count?: number) => this.finalCommand([targets, item, count])
}
