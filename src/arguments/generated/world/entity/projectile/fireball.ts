import type { ProjectileBase } from 'sandstone/arguments/generated/world/entity/projectile'
import type { ItemStack } from 'sandstone/arguments/generated/world/item'
import type { NBTDouble, NBTInt } from 'sandstone'

export type AcceleratingProjectileBase = (ProjectileBase & {
  acceleration_power?: (NBTDouble | number)
})

export type DespawnableProjectileBase = AcceleratingProjectileBase

export type FireballBase = (DespawnableProjectileBase & {
  /**
     * Item it should render as.
     */
  Item?: ItemStack
})

export type LargeFireball = (FireballBase & {
  /**
     * Explosion radius.
     */
  ExplosionPower?: NBTInt
})

export type WitherSkull = (DespawnableProjectileBase & {
  dangerous?: boolean
})
