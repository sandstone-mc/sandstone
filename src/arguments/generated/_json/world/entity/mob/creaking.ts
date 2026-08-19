import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { JsonNBTList, NBTInt } from 'sandstone'

export type JsonCreaking = (JsonMobBase & {
  /**
   * The creaking heart block that this is linked to.
   *
   * Value:
   * List length range: 3
   */
  home_pos?: JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
})
