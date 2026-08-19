import type { JsonSlottedItem } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonNBTList, NBTByte, NBTIntArray } from 'sandstone'

export type JsonCampfire = (JsonBlockEntity & {
  /**
   * Value:
   * List length range: 0..4
   */
  Items?: JsonNBTList<JsonSlottedItem<(NBTByte<{
    min: 0,
    max: 3,
  }> | number)>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 4,
  }>,
  /**
   * Ticks each item has been cooking.
   * Index is according to item slot.
   *
   * Value:
   * Array length range: 4
   */
  CookingTimes?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  /**
   * Ticks each item still has to cook.
   * Index is according to item slot.
   *
   * Value:
   * Array length range: 4
   */
  CookingTotalTimes?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
})
