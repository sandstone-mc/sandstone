import type { EntityBase } from 'sandstone/arguments/generated/world/entity.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTIntArray, NBTLong, NBTShort } from 'sandstone'

export type Item = (EntityBase & {
  /**
     * Ticks it has existed.
     */
  Age?: NBTShort
  Health?: NBTShort
  /**
     * Ticks until an entity can pick up this item.
     */
  PickupDelay?: NBTShort
  /**
     * Only this entity can pick up the item.
     *
     * Value:
     * Array length range: 4
     */
  Owner?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
  /**
     * Player who threw the item. Can be set and/or changed to any entity.
     *
     * Value:
     * Array length range: 4
     */
  Thrower?: NBTIntArray<{
    leftExclusive: false
    rightExclusive: false
    min: 4
    max: 4
  }>
  Item?: ItemStack
})

export type Uuid = {
  /**
     * Lower bits of the target player's UUID
     */
  L?: NBTLong
  /**
     * Upper bits of the target player's UUID
     */
  M?: NBTLong
}
