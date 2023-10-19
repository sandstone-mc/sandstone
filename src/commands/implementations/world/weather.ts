import { CommandNode } from 'sandstone/core/nodes'

import { CommandArguments } from '../../helpers.js'

import type { TimeArgument } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/variables'

export class WeatherCommandNode extends CommandNode {
  command = 'weather' as const
}

export class WeatherCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = WeatherCommandNode

  /**
   * Set the weather to clear.
   *
   * @param duration Specifies the time in seconds for the clear weather to last.
   * If not specified, the duration defaults to 5 minutes.
   * If 0, resets to random weather duration.
   */
  clear = (duration: Macroable<TimeArgument, MACRO>) => this.finalCommand(['clear', duration])

  /**
   * Set the weather to rain (or snow in cold biomes).
   *
   * @param duration Specifies the time in seconds for the rainy weather to last.
   * If not specified, the duration defaults to 5 minutes.
   * If 0, resets to random weather duration.
   */
  rain = (duration: Macroable<TimeArgument, MACRO>) => this.finalCommand(['rain', duration])

  /**
   * Set the weather to a thunderstorm (or blizzard cold biomes).
   *
   * @param duration Specifies the time in seconds for the thunderstorm to last.
   * If not specified, the duration defaults to 5 minutes.
   * If 0, resets to random weather duration.
   */
  thunder = (duration: Macroable<TimeArgument, MACRO>) => this.finalCommand(['thunder', duration])
}
