import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { NBTInt, NBTIntArray } from 'sandstone'

export type Phantom = (MobBase & {
  /**
     * Approximate circle coordinates.
     *
     * Value:
     * Array length range: 3
     */
  anchor_pos?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>
  /**
     * Value:
     * Range: 0..64
     */
  size?: NBTInt<{
    min: 0
    max: 64
  }>
})
