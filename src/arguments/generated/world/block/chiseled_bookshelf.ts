import type { SlottedItem } from 'sandstone/arguments/generated/util/slot.ts'
import type { BlockEntity } from 'sandstone/arguments/generated/world/block.ts'
import type { NBTByte, NBTInt, NBTList } from 'sandstone'

export type ChiseledBookshelf = (BlockEntity & {
  /**
   * Slots from 0 to 5.
   *
   * Value:
   * List length range: 0..6
   */
  Items?: NBTList<SlottedItem<NBTByte<{
    min: 0,
    max: 5,
  }>>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 6,
  }>,
  /**
   * Value:
   * Range: 0..5
   */
  last_interacted_slot?: NBTInt<{
    min: 0,
    max: 5,
  }>,
})
