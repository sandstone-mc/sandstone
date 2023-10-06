import { CommandNode } from 'sandstone/core/index.js'

import { CommandArguments } from '../../helpers.js'

import type { TimeArgument } from 'sandstone/arguments/index.js'

export class TimeCommandNode extends CommandNode {
  command = 'time' as const
}

/**
 * Changes or queries the world's game time.
 */
export class TimeCommand extends CommandArguments {
  protected NodeType = TimeCommandNode

  /**
   * Adds `time` to the in-game daytime.
   *
   * @param time the time to add. It can be suffixed with a unit. Units include:
   * - `d`: an in-game day, 24000 gameticks;
   * - `s`: a second, 20 gameticks;
   * - `t` (default and omitable): a single gametick; the default unit.
   */
  add = (time: TimeArgument) => this.finalCommand(['add'])

  /**
   * Queries current time.
   *
   * @param type Specifies the time to query. Can be one of the following:
   * - `daytime`: the number of game ticks since dawn. (the in-game daytime modulo 24000)
   * - `gametime`: the age of the world in game ticks. (the game time modulo 2147483647)
   * - `day`: the number of in-game days passed. (the in-game daytime divided by 24000, then modulo 2147483647)
   */
  query = (type: 'daytime' | 'gametime' | 'day') => this.finalCommand(['query', type])

  /**
   * Sets the in-game daytime.
   *
   * @param time the new daytime. It can be suffixed with a unit. Units include:
   * - `d`: an in-game day, 24000 gameticks;
   * - `s`: a second, 20 gameticks;
   * - `t` (default and omitable): a single gametick; the default unit.
   */
  set = (time: TimeArgument | 'day' | 'night' | 'noon' | 'midnight') => this.finalCommand(['set', time])
}
