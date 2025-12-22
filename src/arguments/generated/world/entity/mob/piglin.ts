import type { MobBase } from 'sandstone/arguments/generated/world/entity/mob.js'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.js'
import type { NBTInt, NBTList } from 'sandstone'

export type Piglin = (PiglinBase & {
  /**
     * Whether it is a baby.
     */
  IsBaby?: boolean
  /**
     * Whether it does not hunt hoglins.
     */
  CannotHunt?: boolean
  /**
     * Value:
     * List length range: 0..8
     */
  Inventory?: NBTList<ItemStack, {
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 8
  }>
})

export type PiglinBase = (MobBase & {
  /**
     * Whether it will not transform to a zombified piglin when it is in the Overworld.
     */
  IsImmuneToZombification?: boolean
  /**
     * Ticks it has been in the overworld.
     */
  TimeInOverworld?: NBTInt
})
