import { Command } from '@commands/Command'
import { command } from '@commands/decorators'

import type { Coordinates } from 'src/arguments'

/** These commands control the world border. */
export class WorldBorder extends Command {
    /**
     * Increases or decreases the world border diameter.
     *
     * @param distance Specifies the number of blocks to add to the world border diameter.
     *
     * @param time Specifies the number of seconds it should take for the world border to move from its current diameter to the new diameter.
     * If not specified, defaults to 0.
     */
    @command(['worldborder', 'add'], { isRoot: true })
    add = (distance: number, time?: number) => {}

    /**
     * Recenters the world boundary.
     *
     * @param pos Specifies the horizontal coordinates of the world border's center.
     */
    @command(['worldborder', 'center'], { isRoot: true })
    center = (pos: Coordinates) => {}

    /**
     * Sets the world border damage amount to the specified value.
     * Any player outside the world border buffer takes this amount of damage per second per block past the world border buffer distance.
     *
     * @param damagePerBlock Specifies the damage a player takes per second per block past the world border buffer.
     * For example, if `damagePerBlock` is 0.1, a player 5 blocks outside the world border buffer takes 0.5 damage per second
     * (damage less than half a heart might not change the visual health display, but still accumulates). Initially set to 0.2.
     */
    @command(['worldborder', 'damage', 'amount'], { isRoot: true })
    damageAmount = (damagePerBlock: number) => {}

    /**
     * Sets the world border buffer distance to the specified value.
     * Players won't take damage until they move past this distance from the world border.
     *
     * @param distance Specifies the distance outside the world buffer a player must be before they start taking damage.
     * Initially set to 5.0.
     */
    @command(['worldborder', 'damage', 'buffer'], { isRoot: true })
    damageBuffer = (distance: number) => {}

    /**
     * Returns the current world border diameter.
     */
    @command(['worldborder', 'get'], { isRoot: true })
    get = () => {}

    /**
     * Sets the world border diameter.
     *
     * @param distance Specifies the new diameter for the world border.
     *
     * @param time Specifies the number of seconds it should take for the world border to move from its current diameter to the new diameter.
     * If not specified, defaults to 0.
     */
    @command(['worldborder', 'set'], { isRoot: true })
    set = (distance: number, time?: number) => {}

    /**
     * Sets the world border warning distance to the specified value.
     *
     * @param distance Specifies the distance from the world border at which players begins to see a visual warning of the world border's proximity.
     * Initially set to 5.
     */
    @command(['worldborder', 'warning', 'distance'], { isRoot: true })
    setWarningDistance = (distance: number) => {}

    /**
     * Sets the world border warning time to the specified value.
     *
     * @param time Specifies the number of seconds that a player begins to see a visual warning before a moving world border passes their position.
     * Initially set to 15.
     */
    @command(['worldborder', 'warning', 'time'], { isRoot: true })
    setWarningTime = (time: number) => {}
}
