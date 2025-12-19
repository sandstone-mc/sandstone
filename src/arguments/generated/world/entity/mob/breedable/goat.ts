import type { Breedable } from 'sandstone/generated/world/entity/mob/breedable'

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
