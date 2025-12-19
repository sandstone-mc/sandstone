import type { EntityBase } from 'sandstone/arguments/generated/world/entity.js'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type BeamTarget = {
    X?: NBTInt
    Y?: NBTInt
    Z?: NBTInt
}

export type EndCrystal = (EntityBase & {
    /**
     * Whether to show the base of the end crystal.
     */
    ShowBottom?: boolean
    /**
     * Coordinates that the beam is pointing to
     *
     * Value:
     * Array length range: 3
     */
    beam_target?: NBTIntArray<{
        leftExclusive: false
        rightExclusive: false
        min: 3
        max: 3
    }>
})
