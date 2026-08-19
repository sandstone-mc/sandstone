import type { JsonProjectileBase } from 'sandstone/arguments/generated/_json/world/entity/projectile.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTDouble, NBTInt } from 'sandstone'

export type JsonAcceleratingProjectileBase = (JsonProjectileBase & {
  acceleration_power?: (NBTDouble | number),
})

export type JsonDespawnableProjectileBase = JsonAcceleratingProjectileBase

export type JsonFireballBase = (JsonDespawnableProjectileBase & {
  /**
   * Item it should render as.
   */
  Item?: JsonItemStack,
})

export type JsonLargeFireball = (JsonFireballBase & {
  /**
   * Explosion radius.
   */
  ExplosionPower?: (NBTInt | number),
})

export type JsonWitherSkull = (JsonDespawnableProjectileBase & {
  dangerous?: boolean,
})
