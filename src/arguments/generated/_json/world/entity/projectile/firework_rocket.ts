import type { JsonProjectileBase } from 'sandstone/arguments/generated/_json/world/entity/projectile.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTInt } from 'sandstone'

export type JsonFireWorkRocket = (JsonProjectileBase & {
  /**
   * Ticks it has existed.
   */
  Life?: (NBTInt | number),
  /**
   * Ticks it will exist.
   */
  LifeTime?: (NBTInt | number),
  /**
   * Whether it should move at an angle.
   */
  ShotAtAngle?: boolean,
  FireworksItem?: JsonItemStack,
})
