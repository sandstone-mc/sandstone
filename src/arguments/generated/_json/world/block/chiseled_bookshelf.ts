import type { JsonSlottedItem } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonNBTList, NBTByte, NBTInt } from 'sandstone'

export type JsonChiseledBookshelf = (JsonBlockEntity & {
  /**
   * Slots from 0 to 5.
   *
   * Value:
   * List length range: 0..6
   */
  Items?: JsonNBTList<JsonSlottedItem<(NBTByte<{
    min: 0,
    max: 5,
  }> | number)>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 6,
  }>,
  /**
   * Value:
   * Range: 0..5
   */
  last_interacted_slot?: (NBTInt<{
    min: 0,
    max: 5,
  }> | number),
})
