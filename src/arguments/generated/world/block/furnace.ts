import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { SlottedItem } from 'sandstone/arguments/generated/util/slot.ts'
import type { BlockEntity, Lockable, Nameable } from 'sandstone/arguments/generated/world/block.ts'
import type { NBTByte, NBTFloat, NBTInt, NBTList, NBTShort } from 'sandstone'

export type Furnace = (BlockEntity & Nameable & Lockable & {
  /**
   * The items in this furnace, with slots:
   * * 0: Item being smelted
   * * 1: Fuel
   * * 2: Output
   *
   * Value:
   * List length range: 0..3
   */
  Items?: NBTList<SlottedItem<NBTByte<{
    min: 0,
    max: 2,
  }>>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 3,
  }>,
  /**
   * Recipes that have been used since the last time a result item was removed from the GUI. Used to calculate the experience to give to the player.
   */
  RecipesUsed?: ({
    [Key in Extract<Registry['minecraft:recipe'], string>]?: NBTInt
  }),
} & {
  /**
   * The total amount of time the current cooking process will take. Defaults to `0`.
   */
  cooking_total_time?: (NBTShort | NBTInt),
  /**
   * The amount of time that the current cooking process has taken so far. Defaults to `0`.
   */
  cooking_time_spent?: (NBTShort | NBTInt),
  /**
   * The amount of burn time remaining. Defaults to `0`.
   */
  lit_time_remaining?: (NBTShort | NBTInt),
  /**
   * The total amount of burn time that was added in the last refuel. Defaults to `0`.
   */
  lit_total_time?: (NBTShort | NBTInt),
  /**
   * Used to speed up or slow down the next cooking process. Defaults to `1`.
   */
  speed_multiplier?: NBTFloat,
})

export type RecipesUsed = ({
  [Key in Extract<Registry['minecraft:recipe'], string>]?: NBTInt
})
