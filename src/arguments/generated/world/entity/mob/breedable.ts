import type { AgeableMob, MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type Breedable = (MobBase & AgeableMob & {
  /**
     * Ticks until it stops searching for a mate.
     *
     * Value:
     * Range: 0..
     */
  InLove?: NBTInt<{
    min: 0
  }>
  /**
     * Player that caused this mob to breed.
     *
     * Value:
     * Array length range: 4
     */
  LoveCause?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
})
