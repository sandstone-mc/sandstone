import type { JsonSalmonType } from 'sandstone/arguments/generated/_json/world/component/entity.ts'
import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type JsonFish = (JsonMobBase & {
  /**
   * If it was released from a bucket.
   */
  FromBucket?: boolean,
})

export type JsonPufferfish = (JsonFish & {
  /**
   * How puffed it is.
   *
   * Value:
   *
   *  - Deflated(`0`)
   *  - HalfPuffed(`1`)
   *  - Puffed(`2`)
   */
  PuffState?: JsonPuffState,
})

export type JsonPuffState = (0 | 1 | 2)

export type JsonSalmon = (JsonFish & {
  /**
   * The size variant of the salmon.
   *
   * Value:
   *
   *  - Small(`small`)
   *  - Medium(`medium`)
   *  - Large(`large`)
   */
  type?: JsonSalmonType,
})

export type JsonTropicalFish = (JsonFish & {
  Variant?: (NBTInt | number),
})
