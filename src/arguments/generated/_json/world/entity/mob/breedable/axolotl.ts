import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'

export type JsonAxolotl = (JsonBreedable & {
  /**
   * The variant of the axolotl.
   *
   * Value:
   *
   *  - Lucy(`0`)
   *  - Wild(`1`)
   *  - Gold(`2`)
   *  - Cyan(`3`)
   *  - Blue(`4`)
   */
  Variant?: JsonAxolotlVariantInt,
  /**
   * If this axolotl was released from a bucket.
   */
  FromBucket?: boolean,
})

export type JsonAxolotlVariantInt = (0 | 1 | 2 | 3 | 4)
