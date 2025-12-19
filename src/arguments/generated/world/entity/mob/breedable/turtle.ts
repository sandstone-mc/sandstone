import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.js'
import type { NBTIntArray } from 'sandstone'

export type Turtle = (Breedable & {
    /**
     * Whether it has an egg.
     */
    has_egg?: boolean
    /**
     * Value:
     * Array length range: 3
     */
    home_pos?: NBTIntArray<{
        leftExclusive: false
        rightExclusive: false
        min: 3
        max: 3
    }>
})
