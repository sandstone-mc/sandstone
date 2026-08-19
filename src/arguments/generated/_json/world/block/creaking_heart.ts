import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonNBTList, NBTInt } from 'sandstone'

export type JsonCreakingHeart = (JsonBlockEntity & {
  /**
   * The creaking mob that is linked to this heart.
   *
   * Value:
   * List length range: 4
   */
  creaking?: JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
})
