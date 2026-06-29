import type { AgeableMob, MobBase } from 'sandstone/arguments/generated/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type CubeMob = {
  /**
   * Value:
   * Range: 0..126
   */
  Size?: NBTInt<{
    min: 0,
  }>,
  /**
   * Whether it is on the ground.
   */
  wasOnGround?: boolean,
}

export type Slime = (MobBase & CubeMob)

export type SulfurCube = (MobBase & AgeableMob & CubeMob & {
  /**
   * Value:
   * Range: 0..
   */
  pickup_timer?: NBTInt<{
    min: 0,
  }>,
  from_bucket?: boolean,
  /**
   * `-1` represents "not ignited".
   *
   * Value:
   * Range: -1..
   */
  fuse?: NBTInt<{}>,
})
