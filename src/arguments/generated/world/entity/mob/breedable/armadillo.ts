import type { Breedable } from 'sandstone/arguments/generated/world/entity/mob/breedable.ts'
import type { NBTInt } from 'sandstone'

export type Armadillo = (Breedable & {
  /**
     * Value:
     *
     *  - Idle(`idle`)
     *  - Rolling(`rolling`)
     *  - Scared(`scared`)
     *  - Unrolling(`unrolling`)
     */
  state?: ArmadilloState
  /**
     * Value:
     * Range: 0..
     */
  scute_time?: NBTInt<{
    min: 0
  }>
})

export type ArmadilloState = ('idle' | 'rolling' | 'scared' | 'unrolling')
