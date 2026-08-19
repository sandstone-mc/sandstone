import type { JsonDirection } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonBlockEntity } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonNBTList, NBTInt } from 'sandstone'

export type JsonChargeCursor = {
  /**
   * Value:
   * List length range: 3
   */
  pos: JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   * Range: 0..1000
   */
  charge?: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  decay_delay?: (NBTInt<{
    min: 0,
    max: 1,
  }> | number),
  /**
   * Value:
   * Range: 0..
   */
  update_delay?: (NBTInt<{
    min: 0,
  }> | number),
  facings?: Array<JsonDirection>,
}

export type JsonSculkCatalyst = (JsonBlockEntity & {
  cursors?: Array<JsonChargeCursor>,
})
