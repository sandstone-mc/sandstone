import type { SalmonType } from 'sandstone/arguments/generated/world/component/entity.ts'
import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type Fish = (MobBase & {
  /**
   * If it was released from a bucket.
   */
  FromBucket?: boolean
})

export type Pufferfish = (Fish & {
  /**
   * How puffed it is.
   *
   * Value:
   *
   *  - Deflated(`0`)
   *  - HalfPuffed(`1`)
   *  - Puffed(`2`)
   */
  PuffState?: PuffState
})

export type PuffState = (0 | 1 | 2)

export type Salmon = (Fish & {
  /**
   * The size variant of the salmon.
   *
   * Value:
   *
   *  - Small(`small`)
   *  - Medium(`medium`)
   *  - Large(`large`)
   */
  type?: SalmonType
})

export type TropicalFish = (Fish & {
  Variant?: NBTInt
})
