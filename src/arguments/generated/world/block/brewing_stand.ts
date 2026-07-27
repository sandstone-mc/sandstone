import type { SlottedItem } from 'sandstone/arguments/generated/util/slot.ts'
import type { BlockEntity, Lockable, Nameable } from 'sandstone/arguments/generated/world/block.ts'
import type { NBTByte, NBTFloat, NBTInt, NBTList, NBTShort } from 'sandstone'

export type BrewingStand = (BlockEntity & Nameable & Lockable & {
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
  Items?: NBTList<SlottedItem<NBTByte<{
    min: 0,
    max: 4,
  }>>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 5,
  }>,
  /**
   * Number of ticks until the brewing is complete.
   */
  BrewTime?: (NBTShort | NBTInt),
  /**
   * Amount of fuel the brewing stand has left.
   */
  Fuel?: (NBTByte | NBTInt),
  /**
   * The total amount of time the current brewing process will take. Defaults to `400`.
   */
  total_brew_time?: NBTInt,
  /**
   * The amount of fuel that was added in the last refuel. Defaults to `20`.
   */
  total_fuel?: NBTInt,
  /**
   * Used to speed up or slow down the next brewing process. Defaults to `1`.
   */
  speed_multiplier?: NBTFloat,
})
