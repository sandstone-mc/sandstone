import { CommandNode } from '#core/nodes'

import { CommandArguments } from '../../helpers'

import type { GAMEMODES } from '#arguments'

export class DefaultGameModeCommandNode extends CommandNode {
  command = 'defaultgamemode' as const
}

export class DefaultGameModeCommand extends CommandArguments {
  protected NodeType = DefaultGameModeCommandNode

  /**
   * Sets the default game mode (creative, survival, etc.) for new players entering a multiplayer server.
   *
   * @param mode Specifies the default game mode for new players. Must be one of the following:
   * - `survival` for survival mode
   * - `creative` for creative mode
   * - `adventure` for adventure mode
   * - `spectator` for spectator mode
   */
  defaultgamemode = (mode: GAMEMODES) => this.finalCommand([mode])
}
