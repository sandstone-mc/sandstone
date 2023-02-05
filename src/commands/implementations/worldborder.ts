import { CommandNode } from '@core'
import { coordinatesParser } from '@variables'

import { CommandArguments } from '../helpers'

import type { ColumnCoordinates } from '@arguments'

export class WorldBorderNode extends CommandNode {
  command = 'worldborder' as const
}

/** These commands control the world border. */
export class WorldBorderCommand extends CommandArguments {
  public NodeType = WorldBorderNode

  /**
   * Increases or decreases the world border diameter.
   *
   * @param distance Specifies the number of blocks to add to the world border diameter.
   *
   * @param time Specifies the number of seconds it should take for the world border to move from its current diameter to the new diameter.
   * If not specified, defaults to 0.
   */
  add = (distance: number, time?: number) => this.finalCommand(['add', distance, time])

  /**
   * Recenters the world boundary.
   *
   * @param pos Specifies the horizontal coordinates of the world border's center.
   */
  center = (pos: ColumnCoordinates) => this.finalCommand(['center', coordinatesParser(pos)])

  damage = {
    /**
     * Sets the world border damage amount to the specified value.
     * Any player outside the world border buffer takes this amount of damage per second per block past the world border buffer distance.
     *
     * @param damagePerBlock Specifies the damage a player takes per second per block past the world border buffer.
     * For example, if `damagePerBlock` is 0.1, a player 5 blocks outside the world border buffer takes 0.5 damage per second
     * (damage less than half a heart might not change the visual health display, but still accumulates). Initially set to 0.2.
     */
    amount: (damagePerBlock: number) => this.finalCommand(['damage', 'amount', damagePerBlock]),

    /**
     * Sets the world border buffer distance to the specified value.
     * Players won't take damage until they move past this distance from the world border.
     *
     * @param distance Specifies the distance outside the world buffer a player must be before they start taking damage.
     * Initially set to 5.0.
     */
    buffer: (distance: number) => this.finalCommand(['damage', 'buffer', distance]),
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
  set = (distance: number, time?: number) => this.finalCommand(['set', distance, time])

  warning = {
    /**
     * Sets the world border warning distance to the specified value.
     * Players will start to see a warning message when they are this distance from the world border.
     *
     * @param distance Specifies the distance from the world border at which players begins to see a visual warning of the world border's proximity.
     * Initially set to 5.
     */
    distance: (distance: number) => this.finalCommand(['warning', 'distance', distance]),

    /**
     * Sets the world border warning time to the specified value.
     *
     * @param time Specifies the number of seconds that a player begins to see a visual warning before a moving world border passes their position.
     * Initially set to 15.
     */
    time: (time: number) => this.finalCommand(['warning', 'time', time]),
  }
}
