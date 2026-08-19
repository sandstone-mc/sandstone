import type { JsonAgeableMob, JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type JsonCubeMob = {
  /**
   * Value:
   * Range: 0..126
   */
  Size?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Whether it is on the ground.
   */
  wasOnGround?: boolean,
}

export type JsonSlime = (JsonMobBase & JsonCubeMob)

export type JsonSulfurCube = (JsonMobBase & JsonAgeableMob & JsonCubeMob & {
  /**
   * Value:
   * Range: 0..
   */
  pickup_timer?: (NBTInt<{
    min: 0,
  }> | number),
  from_bucket?: boolean,
  /**
   * `-1` represents "not ignited".
   *
   * Value:
   * Range: -1..
   */
  fuse?: (NBTInt<{}> | number),
})
