import { targetParser } from 'sandstone/variables/parsers.js'
import { CommandNode } from 'sandstone/core/nodes.js'

import { CommandArguments } from '../../helpers.js'

import type { SingleEntityArgument, SinglePlayerArgument } from 'sandstone/arguments/index.js'

export class SpectateCommandNode extends CommandNode {
  command = 'spectate' as const
}

export class SpectateCommand extends CommandArguments {
  protected NodeType = SpectateCommandNode

  /**
   * Causes a player in Spectator mode to spectate another entity.
   *
   * @param targets Specifies the target to be spectated.
   *
   * @param player Specifies the spectating player. If unspecified, defaults to the executor.
   */
  spectate = (target: SinglePlayerArgument, player?: SingleEntityArgument) => this.finalCommand([targetParser(target), player])
}
