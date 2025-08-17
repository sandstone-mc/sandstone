import type { GAMEMODES } from 'sandstone/arguments'
import { CommandNode } from 'sandstone/core/nodes'
import { CommandArguments } from '../../helpers.js'

export class DefaultGameModeCommandNode extends CommandNode {
  command = 'defaultgamemode' as const
}

export class DefaultGameModeCommand extends CommandArguments {
  protected NodeType = DefaultGameModeCommandNode

  /**
   * Set default gamemode for new players.
   *
   * @param mode Gamemode for new players joining the server.
   *            Options: 'survival', 'creative', 'adventure', 'spectator'
   *
   * @example
   * ```ts
   * defaultgamemode('survival')     // New players start in survival
   * defaultgamemode('creative')     // New players start in creative
   * ```
   */
  defaultgamemode = (mode: GAMEMODES) => this.finalCommand([mode])
}
