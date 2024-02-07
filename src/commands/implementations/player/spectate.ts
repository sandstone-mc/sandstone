import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { SingleEntityArgument, SinglePlayerArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'

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
  spectate = (target: Macroable<SingleEntityArgument<MACRO>, MACRO>, player?: Macroable<SinglePlayerArgument<MACRO>, MACRO>) => this.finalCommand([targetParser(target), player])
}
