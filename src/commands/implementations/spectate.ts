import { CommandNode } from '@core/nodes'

import { CommandArguments } from '../helpers'

import type { SingleEntityArgument, SinglePlayerArgument } from '@arguments'

export class SpectateCommandNode extends CommandNode {
  command = 'spectate' as const
}

export class SpectateCommand extends CommandArguments {
  public NodeType = SpectateCommandNode

  /**
   * Causes a player in Spectator mode to spectate another entity.
   *
   * @param targets Specifies the target to be spectated.
   *
   * @param player Specifies the spectating player. If unspecified, defaults to the executor.
   */
  spectate = (target: SinglePlayerArgument, player?: SingleEntityArgument) => this.finalCommand([target, player])
}
