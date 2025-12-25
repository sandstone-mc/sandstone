import type { SlottedItem } from 'sandstone/arguments/generated/util/slot'
import type { BlockEntity } from 'sandstone/arguments/generated/world/block'
import type { NBTByte, NBTIntArray, NBTList } from 'sandstone'

export type Campfire = (BlockEntity & {
  /**
     * Value:
     * List length range: 0..4
     */
  Items?: NBTList<SlottedItem<NBTByte<{
    min: 0
    max: 3
  }>>, {
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 4
  }>
  /**
     * Ticks each item has been cooking.
     * Index is according to item slot.
     *
     * Value:
     * Array length range: 4
     */
  CookingTimes?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
  /**
     * Ticks each item still has to cook.
     * Index is according to item slot.
     *
     * Value:
     * Array length range: 4
     */
  CookingTotalTimes?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
})
