import { targetParser } from 'sandstone/variables/parsers.js'
import { CommandNode } from 'sandstone/core/nodes.js'

import { CommandArguments } from '../../helpers.js'

import type { GAMEMODES, MultiplePlayersArgument } from 'sandstone/arguments/index.js'

// Gamemode command

export class GameModeCommandNode extends CommandNode {
  command = 'gamemode' as const
}

export class GameModeCommand extends CommandArguments {
  protected NodeType = GameModeCommandNode

  /**
   * Sets a player's game mode.
   *
   * @param gamemode Specifies the new game mode. Must be one of the following:
   * - `survival` for survival mode
   * - `creative` for creative mode
   * - `adventure` for adventure mode
   * - `spectator` for spectator mode‌
   *
   * @param targets Specifies the target(s). If not specified, defaults to the player who executes the command.
   */
  gamemode = (gamemode: GAMEMODES, targets?: MultiplePlayersArgument) => this.finalCommand([targetParser(gamemode), targets])
}
