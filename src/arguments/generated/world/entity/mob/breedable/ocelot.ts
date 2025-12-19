import type { Breedable } from 'sandstone/generated/world/entity/mob/breedable'

export type Ocelot = (Breedable & {
    /**
     * Whether it trusts players.
     */
    Trusting?: boolean
})
