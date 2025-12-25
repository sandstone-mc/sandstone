import type { BlockEntity } from 'sandstone/arguments/generated/world/block'
import type { NBTInt, NBTList } from 'sandstone'

export type CreakingHeart = (BlockEntity & {
  /**
     * The creaking mob that is linked to this heart.
     *
     * Value:
     * List length range: 4
     */
  creaking?: NBTList<NBTInt, {
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
})
