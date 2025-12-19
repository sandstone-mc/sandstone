import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.js'

export type Goat = (Breedable & {
    /**
     * Whether it has its left horn.
     */
    HasLeftHorn?: boolean
    /**
     * Whether it has its right horn.
     */
    HasRightHorn?: boolean
    /**
     * Whether it is a screaming goat.
     */
    IsScreamingGoat?: boolean
})
