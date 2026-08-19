import type { JsonEntityBase } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTIntArray, NBTLong, NBTShort } from 'sandstone'

export type JsonItem = (JsonEntityBase & {
  /**
   * Ticks it has existed.
   */
  Age?: (NBTShort | number),
  Health?: (NBTShort | number),
  /**
   * Ticks until an entity can pick up this item.
   */
  PickupDelay?: (NBTShort | number),
  /**
   * Only this entity can pick up the item.
   *
   * Value:
   * Array length range: 4
   */
  Owner?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  /**
   * Player who threw the item. Can be set and/or changed to any entity.
   *
   * Value:
   * Array length range: 4
   */
  Thrower?: NBTIntArray<{
    leftExclusive: false,
    rightExclusive: false,
    min: 4,
    max: 4,
  }>,
  Item?: JsonItemStack,
})

export type JsonUuid = {
  /**
   * Lower bits of the target player's UUID
   */
  L?: (NBTLong | number),
  /**
   * Upper bits of the target player's UUID
   */
  M?: (NBTLong | number),
}
