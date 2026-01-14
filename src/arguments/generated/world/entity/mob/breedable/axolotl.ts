import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.ts'

export type Axolotl = (Breedable & {
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
  Variant?: AxolotlVariantInt
  /**
   * If this axolotl was released from a bucket.
   */
  FromBucket?: boolean
})

export type AxolotlVariantInt = (0 | 1 | 2 | 3 | 4)
