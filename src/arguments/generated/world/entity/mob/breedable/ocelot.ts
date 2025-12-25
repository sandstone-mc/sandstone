import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable'

export type Ocelot = (Breedable & {
  /**
     * Whether it trusts players.
     */
  Trusting?: boolean
})
