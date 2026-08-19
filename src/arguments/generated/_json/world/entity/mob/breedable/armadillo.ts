import type { JsonBreedable } from 'sandstone/arguments/generated/_json/world/entity/mob/breedable.ts'
import type { NBTInt } from 'sandstone'

export type JsonArmadillo = (JsonBreedable & {
  /**
   * Value:
   *
   *  - Idle(`idle`)
   *  - Rolling(`rolling`)
   *  - Scared(`scared`)
   *  - Unrolling(`unrolling`)
   */
  state?: JsonArmadilloState,
  /**
   * Value:
   * Range: 0..
   */
  scute_time?: (NBTInt<{
    min: 0,
  }> | number),
})

export type JsonArmadilloState = ('idle' | 'rolling' | 'scared' | 'unrolling')
