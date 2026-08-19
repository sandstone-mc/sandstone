import type { JsonSlottedItem } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonBlockEntity, JsonLockable, JsonNameable } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonNBTList, NBTByte, NBTFloat, NBTInt } from 'sandstone'

export type JsonBrewingStand = (JsonBlockEntity & JsonNameable & JsonLockable & {
  /**
   * * 0: left brewing slot
   * * 1: middle brewing slot
   * * 2: right brewing slot
   * * 3: ingredient slot
   * * 4: fuel slot
   *
   * Value:
   * List length range: 0..5
   */
  Items?: JsonNBTList<JsonSlottedItem<(NBTByte<{
    min: 0,
    max: 4,
  }> | number)>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 5,
  }>,
  /**
   * Number of ticks until the brewing is complete.
   */
  BrewTime?: (NBTInt | number),
  /**
   * Amount of fuel the brewing stand has left.
   */
  Fuel?: (NBTInt | number),
  /**
   * The total amount of time the current brewing process will take. Defaults to `400`.
   */
  total_brew_time?: (NBTInt | number),
  /**
   * The amount of fuel that was added in the last refuel. Defaults to `20`.
   */
  total_fuel?: (NBTInt | number),
  /**
   * Used to speed up or slow down the next brewing process. Defaults to `1`.
   */
  speed_multiplier?: (NBTFloat | number),
})
