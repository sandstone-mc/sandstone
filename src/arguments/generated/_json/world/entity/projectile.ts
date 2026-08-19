import type { JsonAdventureModePredicate } from 'sandstone/arguments/generated/_json/world/component/item.ts'
import type { JsonEntityBase } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { NBTIntArray, NBTLong } from 'sandstone'

export type JsonLlamaSpit = JsonProjectileBase

export type JsonOwnerUuid = {
  /**
   * Upper bits of the owner's UUID.
   */
  OwnerUUIDMost?: (NBTLong | number),
  /**
   * Lower bits of the owner's UUID.
   */
  OwnerUUIDLeast?: (NBTLong | number),
}

export type JsonProjectileBase = (JsonEntityBase & {
  /**
   * Whether it has been shot. This is set to true when it exists for
   * at least one tick, and is used by the game to ensure it only triggers the projectile_shoot
   * game event once.
   */
  HasBeenShot?: boolean,
  /**
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
   * Whether it has left its owner.
   */
  LeftOwner?: boolean,
  can_break?: JsonAdventureModePredicate,
})
