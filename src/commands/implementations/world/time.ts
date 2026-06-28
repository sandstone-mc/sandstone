import type { Registry, TimeArgument } from 'sandstone/arguments'
import type { Macroable, WorldClockClass } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { CommandArguments } from '../../helpers'
import type { LiteralUnion, NamespacedLiteralUnion } from 'sandstone'

type WORLD_CLOCKS = (
  | 'overworld'
  | 'the_end'
  | 'minecraft:overworld'
  | 'minecraft:the_end'
)

export class TimeCommandNode extends CommandNode {
  command = 'time' as const
}

export class TimeArguments<MACRO extends boolean> extends CommandArguments {
  protected NodeType = TimeCommandNode

  /**
   * Adds `time` to the in-game daytime.
   *
   * @param time the time to add. It can be suffixed with a unit. Units include:
   * - `d`: an in-game day, 24000 gameticks;
   * - `s`: a second, 20 gameticks;
   * - `t` (default and omitable): a single gametick; the default unit.
   */
  add = (time: Macroable<TimeArgument, MACRO>) => this.finalCommand(['add', time])

  /**
   * Queries current time.
   *
   * @param type Specifies the time to query. Can be one of the following:
   * - `gametime`: the age of the world in game ticks. (the game time modulo 2147483647)
   * - `time`: an alias for the `minecraft:overworld` timeline
   * - Any data-driven timeline (eg. `minecraft:villager_schedule`)
   */
  query = (type: Macroable<'gametime' | 'time' | Registry['minecraft:timeline'], MACRO>) => this.finalCommand(['query', type])

  /**
   * Sets the in-game daytime.
   *
   * @param time the new daytime. It can be suffixed with a unit. Units include:
   * - `d`: an in-game day, 24000 gameticks;
   * - `s`: a second, 20 gameticks;
   * - `t` (default and omitable): a single gametick; the default unit.
   */
  set = (time: Macroable<TimeArgument | NamespacedLiteralUnion<'day' | 'night' | 'noon' | 'midnight'>, MACRO>) =>
    this.finalCommand(['set', time])
}

export class TimeCommand<MACRO extends boolean> extends TimeArguments<MACRO> {
  protected NodeType = TimeCommandNode

  /**
   * Operates with the time of a specific world clock
   */
  of = (worldClock: Macroable<NamespacedLiteralUnion<WORLD_CLOCKS> | WorldClockClass, MACRO>) =>
    this.subCommand(['of', worldClock], TimeArguments, false)
}
