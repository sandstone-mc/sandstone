import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonSlottedItem } from 'sandstone/arguments/generated/_json/util/slot.ts'
import type { JsonBlockEntity, JsonLockable, JsonNameable } from 'sandstone/arguments/generated/_json/world/block.ts'
import type { JsonNBTList, NBTByte, NBTFloat, NBTInt } from 'sandstone'

export type JsonFurnace = (JsonBlockEntity & JsonNameable & JsonLockable & {
  /**
   * The items in this furnace, with slots:
   * * 0: Item being smelted
   * * 1: Fuel
   * * 2: Output
   *
   * Value:
   * List length range: 0..3
   */
  Items?: JsonNBTList<JsonSlottedItem<(NBTByte<{
    min: 0,
    max: 2,
  }> | number)>, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 3,
  }>,
  /**
   * Recipes that have been used since the last time a result item was removed from the GUI. Used to calculate the experience to give to the player.
   */
  RecipesUsed?: ({
    [Key in Extract<JsonRegistry['minecraft:recipe'], string>]?: (NBTInt | number)
  }),
} & {
  /**
   * The total amount of time the current cooking process will take. Defaults to `0`.
   */
  cooking_total_time?: (NBTInt | number),
  /**
   * The amount of time that the current cooking process has taken so far. Defaults to `0`.
   */
  cooking_time_spent?: (NBTInt | number),
  /**
   * The amount of burn time remaining. Defaults to `0`.
   */
  lit_time_remaining?: (NBTInt | number),
  /**
   * The total amount of burn time that was added in the last refuel. Defaults to `0`.
   */
  lit_total_time?: (NBTInt | number),
  /**
   * Used to speed up or slow down the next cooking process. Defaults to `1`.
   */
  speed_multiplier?: (NBTFloat | number),
})

export type JsonRecipesUsed = ({
  [Key in Extract<JsonRegistry['minecraft:recipe'], string>]?: (NBTInt | number)
})
