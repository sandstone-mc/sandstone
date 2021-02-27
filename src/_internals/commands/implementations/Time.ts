import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

import type { LiteralUnion } from '@/generalTypes'
import type { TimeArgument } from '@arguments'

/**
 * Changes or queries the world's game time.
 */
export class Time extends Command {
  /**
   * Adds `time` to the in-game daytime.
   *
   * @param time the time to add. It can be suffixed with a unit. Units include:
   * - `d`: an in-game day, 24000 gameticks;
   * - `s`: a second, 20 gameticks;
   * - `t` (default and omitable): a single gametick; the default unit.
   */
  @command(['time', 'add'], { isRoot: true })
  add = (time: TimeArgument) => {}

  /**
   * Queries current time.
   *
   * @param type Specifies the time to query. Can be one of the following:
   * - `daytime`: the number of game ticks since dawn. (the in-game daytime modulo 24000)
   * - `gametime`: the age of the world in game ticks. (the game time modulo 2147483647)
   * - `day`: the number of in-game days passed. (the in-game daytime divided by 24000, then modulo 2147483647)
   */
  @command(['time', 'query'], { isRoot: true })
  query = (type: 'daytime' | 'gametime' | 'day') => {}

  /**
   * Sets the in-game daytime.
   *
   * @param time the new daytime. It can be suffixed with a unit. Units include:
   * - `d`: an in-game day, 24000 gameticks;
   * - `s`: a second, 20 gameticks;
   * - `t` (default and omitable): a single gametick; the default unit.
   */
  @command(['time', 'set'], { isRoot: true })
  set = (time: TimeArgument | LiteralUnion<'day' | 'night' | 'noon' | 'midnight'>) => {}
}
