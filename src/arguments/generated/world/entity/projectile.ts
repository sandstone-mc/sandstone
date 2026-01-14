import type { EntityBase } from 'sandstone/arguments/generated/world/entity.ts'
import type { NBTIntArray, NBTLong } from 'sandstone'

export type LlamaSpit = ProjectileBase

export type OwnerUuid = {
  /**
     * Upper bits of the owner's UUID.
     */
  OwnerUUIDMost?: NBTLong
  /**
     * Lower bits of the owner's UUID.
     */
  OwnerUUIDLeast?: NBTLong
}

export type ProjectileBase = (EntityBase & {
  /**
     * Whether it has been shot. This is set to true when it exists for
     * at least one tick, and is used by the game to ensure it only triggers the projectile_shoot
     * game event once.
     */
  HasBeenShot?: boolean
  /**
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
     * Whether it has left its owner.
     */
  LeftOwner?: boolean
})
