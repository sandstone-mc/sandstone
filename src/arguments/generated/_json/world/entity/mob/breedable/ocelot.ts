import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'

export type JsonOcelot = (JsonBreedable & {
  /**
   * Whether it trusts players.
   */
  Trusting?: boolean,
})
