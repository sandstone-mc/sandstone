import type { SlottedItem } from 'sandstone/arguments/generated/util/slot.ts'
import type { BlockEntity, Lockable, Nameable } from 'sandstone/arguments/generated/world/block.ts'
import type { NBTByte, NBTList, NBTShort } from 'sandstone'

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
  BrewTime?: NBTShort,
  /**
   * Amount of fuel the brewing stand has left.
   */
  Fuel?: NBTByte,
})
