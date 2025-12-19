import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.js'

export type Ocelot = (Breedable & {
    /**
     * Whether it trusts players.
     */
    Trusting?: boolean
})
