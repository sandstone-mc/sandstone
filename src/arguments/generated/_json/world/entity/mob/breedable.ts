import type { JsonAgeableMob, JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type JsonBreedable = (JsonMobBase & JsonAgeableMob & {
  /**
   * Ticks until it stops searching for a mate.
   *
   * Value:
   * Range: 0..
   */
  InLove?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Player that caused this mob to breed.
   *
   * Value:
   * Array length range: 4
   */
  LoveCause?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
})
