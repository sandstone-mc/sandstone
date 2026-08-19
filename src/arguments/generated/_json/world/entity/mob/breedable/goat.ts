import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'

export type JsonGoat = (JsonBreedable & {
  /**
   * Whether it has its left horn.
   */
  HasLeftHorn?: boolean,
  /**
   * Whether it has its right horn.
   */
  HasRightHorn?: boolean,
  /**
   * Whether it is a screaming goat.
   */
  IsScreamingGoat?: boolean,
})
