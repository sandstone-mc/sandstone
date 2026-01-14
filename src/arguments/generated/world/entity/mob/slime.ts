import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type Slime = (MobBase & {
  /**
   * Value:
   * Range: 0..126
   */
  Size?: NBTInt<{
    min: 0
  }>
  /**
   * Whether it is on the ground.
   */
  wasOnGround?: boolean
})
