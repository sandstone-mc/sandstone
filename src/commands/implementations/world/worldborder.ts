import { CommandNode } from 'sandstone/core/nodes'
import { coordinatesParser } from 'sandstone/variables/parsers'

import { CommandArguments } from '../../helpers.js'

import type { ColumnCoordinates } from 'sandstone/arguments'
import type { Macroable } from 'sandstone/core'

export class WorldBorderNode extends CommandNode {
  command = 'worldborder' as const
}

/** These commands control the world border. */
export class WorldBorderCommand<MACRO extends boolean> extends CommandArguments {
  protected NodeType = WorldBorderNode

  /**
   * Increases or decreases the world border diameter.
   *
   * @param distance Specifies the number of blocks to add to the world border diameter.
   *
   * @param time Specifies the number of seconds it should take for the world border to move from its current diameter to the new diameter.
   * If not specified, defaults to 0.
   */
  add = (distance: Macroable<number, MACRO>, time?: Macroable<number, MACRO>) => this.finalCommand(['add', distance, time])

  /**
   * Recenters the world boundary.
   *
   * @param pos Specifies the horizontal coordinates of the world border's center.
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
   * Returns the current world border diameter.
   */
  get = () => this.finalCommand(['get'])

  /**
   * Sets the world border diameter.
   *
   * @param distance Specifies the new diameter for the world border.
   *
   * @param time Specifies the number of seconds it should take for the world border to move from its current diameter to the new diameter.
   * If not specified, defaults to 0.
   */
  set = (distance: Macroable<number, MACRO>, time?: Macroable<number, MACRO>) => this.finalCommand(['set', distance, time])

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
