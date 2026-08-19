import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'
import type { NBTIntArray } from 'sandstone'

export type JsonTurtle = (JsonBreedable & {
  /**
   * Whether it has an egg.
   */
  has_egg?: boolean,
  /**
   * Value:
   * Array length range: 3
   */
  home_pos?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
})
