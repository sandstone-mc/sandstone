import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { NBTInt } from 'sandstone'

export type JsonTadpole = (JsonMobBase & {
  /**
   * Age of it in ticks. When greater than or equal to 24000, it grows into a frog.
   */
  Age?: (NBTInt | number),
  /**
   * If it was released from a bucket.
   */
  FromBucket?: boolean,
})
