import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

import type { GAMEMODES } from 'src/arguments'

export class DefaultGamemode extends Command {
  /**
   * Sets the default game mode (creative, survival, etc.) for new players entering a multiplayer server.
   *
   * @param mode Specifies the default game mode for new players. Must be one of the following:
   * - `survival` for survival mode
   * - `creative` for creative mode
   * - `adventure` for adventure mode
   * - `spectator` for spectator mode
   */
  @command('defaultgamemode', { isRoot: true })
  defaultgamemode = (mode: GAMEMODES) => {}
}
