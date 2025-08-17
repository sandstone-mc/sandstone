import type { ColumnCoordinates } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser } from 'sandstone/variables/parsers'
import { CommandArguments } from '../../helpers.js'

export class WorldBorderNode extends CommandNode {
  command = 'worldborder' as const
}

export class WorldBorderCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = WorldBorderNode

  /**
   * Expand or shrink world border.
   *
   * @param distance Blocks to add to world border diameter.
   *                Positive values expand, negative values shrink.
   *
   * @param time Optional transition time in seconds. Defaults to instant.
   *
   * @example
   * ```ts
   * worldborder.add(100)         // Expand by 100 blocks instantly
   * worldborder.add(-50, 30)     // Shrink by 50 blocks over 30 seconds
   * ```
   */
  add = (distance: Macroable<number, MACRO>, time?: Macroable<number, MACRO>) =>
    this.finalCommand(['add', distance, time])

  /**
   * Set world border center position.
   *
   * @param pos Center coordinates (x, z only).
   *           Examples: [0, 0], [100, -200], rel(50, 25)
   *
   * @example
   * ```ts
   * worldborder.center([0, 0])        // Center at world origin
   * worldborder.center([100, -200])   // Move center to coordinates
   * ```
   */
  center = (pos: Macroable<ColumnCoordinates<MACRO>, MACRO>) => this.finalCommand(['center', coordinatesParser(pos)])

  damage = {
    /**
     * Sets the world border damage amount to the specified value.
     * Any player outside the world border buffer takes this amount of damage per second per block past the world border buffer distance.
     *
     * @param damagePerBlock Specifies the damage a player takes per second per block past the world border buffer.
     * For example, if `damagePerBlock` is 0.1, a player 5 blocks outside the world border buffer takes 0.5 damage per second
     * (damage less than half a heart might not change the visual health display, but still accumulates). Initially set to 0.2.
     */
    amount: (damagePerBlock: Macroable<number, MACRO>) => this.finalCommand(['damage', 'amount', damagePerBlock]),

    /**
     * Sets the world border buffer distance to the specified value.
     * Players won't take damage until they move past this distance from the world border.
     *
     * @param distance Specifies the distance outside the world buffer a player must be before they start taking damage.
     * Initially set to 5.0.
     */
    buffer: (distance: Macroable<number, MACRO>) => this.finalCommand(['damage', 'buffer', distance]),
  }

  /**
   * Get current world border diameter.
   *
   * @example
   * ```ts
   * worldborder.get()    // Query current border size
   * ```
   */
  get = () => this.finalCommand(['get'])

  /**
   * Set world border diameter.
   *
   * @param distance New border diameter in blocks.
   * @param time Optional transition time in seconds.
   *
   * @example
   * ```ts
   * worldborder.set(1000)        // Set border to 1000 blocks instantly
   * worldborder.set(500, 60)     // Shrink to 500 blocks over 1 minute
   * ```
   */
  set = (distance: Macroable<number, MACRO>, time?: Macroable<number, MACRO>) =>
    this.finalCommand(['set', distance, time])

  warning = {
    /**
     * Sets the world border warning distance to the specified value.
     * Players will start to see a warning message when they are this distance from the world border.
     *
     * @param distance Specifies the distance from the world border at which players begins to see a visual warning of the world border's proximity.
     * Initially set to 5.
     */
    distance: (distance: Macroable<number, MACRO>) => this.finalCommand(['warning', 'distance', distance]),

    /**
     * Sets the world border warning time to the specified value.
     *
     * @param time Specifies the number of seconds that a player begins to see a visual warning before a moving world border passes their position.
     * Initially set to 15.
     */
    time: (time: Macroable<number, MACRO>) => this.finalCommand(['warning', 'time', time]),
  }
}
