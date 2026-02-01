import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { CommandArguments, FinalCommandOutput } from '../../helpers'

export class StopwatchCommandNode extends CommandNode {
  command = 'stopwatch' as const
}

/**
 * Manages stopwatches to track realtime while the server is running.
 *
 * Time is displayed in seconds with three decimal places (e.g., `0.961s`).
 * Stopwatches are unaffected by pausing or the `/tick` command.
 *
 * @see https://minecraft.wiki/w/Commands/stopwatch
 */
export class StopwatchCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = StopwatchCommandNode

  /**
   * Creates a new stopwatch instance.
   *
   * @param id The identifier for the stopwatch.
   */
  create = (id: Macroable<`${string}:${string}`, MACRO>): FinalCommandOutput =>
    this.finalCommand(['create', id])

  /**
   * Queries a stopwatch's current value.
   *
   * @param id The identifier of the stopwatch to query.
   * @param scale Multiplier applied to the returned value. Does not affect chat display.
   */
  query = (id: Macroable<`${string}:${string}`, MACRO>, scale: Macroable<number, MACRO>): FinalCommandOutput =>
    this.finalCommand(['query', id, scale])

  /**
   * Restarts a stopwatch, resetting its value to zero.
   *
   * @param id The identifier of the stopwatch to restart.
   */
  restart = (id: Macroable<`${string}:${string}`, MACRO>): FinalCommandOutput =>
    this.finalCommand(['restart', id])

  /**
   * Removes a stopwatch.
   *
   * @param id The identifier of the stopwatch to remove.
   */
  remove = (id: Macroable<`${string}:${string}`, MACRO>): FinalCommandOutput =>
    this.finalCommand(['remove', id])
}
