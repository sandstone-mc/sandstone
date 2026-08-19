import type { JsonMobBase } from 'sandstone/arguments/generated/_json/world/entity/mob.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { JsonNBTList, NBTInt } from 'sandstone'

export type JsonPiglin = (JsonPiglinBase & {
  /**
   * Whether it is a baby.
   */
  IsBaby?: boolean,
  /**
   * Whether it does not hunt hoglins.
   */
  CannotHunt?: boolean,
  /**
   * Value:
   * List length range: 0..8
   */
  Inventory?: JsonNBTList<JsonItemStack, {
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 8,
  }>,
})

export type JsonPiglinBase = (JsonMobBase & {
  /**
   * Whether it will not transform to a zombified piglin when it is in the Overworld.
   */
  IsImmuneToZombification?: boolean,
  /**
   * Ticks it has been in the overworld.
   */
  TimeInOverworld?: (NBTInt | number),
})
