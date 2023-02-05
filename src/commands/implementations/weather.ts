import { CommandNode } from '@core/nodes'

import { CommandArguments } from '../helpers'

import type { TimeArgument } from '@arguments'

export class WeatherCommandNode extends CommandNode {
  command = 'weather' as const
}

export class WeatherCommand extends CommandArguments {
  public NodeType = WeatherCommandNode

  /**
   * Set the weather to clear.
   *
   * @param duration Specifies the time in seconds for the clear weather to last.
   * If not specified, the duration defaults to 5 minutes.
   * If 0, resets to random weather duration.
   */
  clear = (duration: TimeArgument) => this.finalCommand(['clear', duration])

  /**
   * Set the weather to rain (or snow in cold biomes).
   *
   * @param duration Specifies the time in seconds for the rainy weather to last.
   * If not specified, the duration defaults to 5 minutes.
   * If 0, resets to random weather duration.
   */
  rain = (duration: TimeArgument) => this.finalCommand(['rain', duration])

  /**
   * Set the weather to a thunderstorm (or blizzard cold biomes).
   *
   * @param duration Specifies the time in seconds for the thunderstorm to last.
   * If not specified, the duration defaults to 5 minutes.
   * If 0, resets to random weather duration.
   */
  thunder = (duration: TimeArgument) => this.finalCommand(['thunder', duration])
}
