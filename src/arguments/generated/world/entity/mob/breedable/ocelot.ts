import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.ts'

export type Ocelot = (Breedable & {
  /**
   * Whether it trusts players.
   */
  Trusting?: boolean
})
