import { targetParser } from 'sandstone/variables/parsers'
import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers.js'

import type { Macroable } from 'sandstone/variables'

import type { SingleEntityArgument, SinglePlayerArgument } from 'sandstone/arguments'

export class SpectateCommandNode extends CommandNode {
  command = 'spectate' as const
}

export class SpectateCommand<MACRO extends boolean> extends CommandArguments {
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
