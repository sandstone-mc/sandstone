import { CommandNode } from 'sandstone/core/nodes'
import { targetParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { GAMEMODES, MultiplePlayersArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/variables'

// Gamemode command

export class GameModeCommandNode extends CommandNode {
  command = 'gamemode' as const
}

export class GameModeCommand<MACRO extends boolean> extends CommandArguments {
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
  gamemode = (gamemode: Macroable<GAMEMODES, MACRO>, targets?: Macroable<MultiplePlayersArgument<MACRO>, MACRO>) => this.finalCommand([targetParser(gamemode), targets])
}
