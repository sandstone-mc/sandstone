import type { ProjectileBase } from 'sandstone/arguments/generated/world/entity/projectile.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTInt } from 'sandstone'

export type FireWorkRocket = (ProjectileBase & {
  /**
   * Ticks it has existed.
   */
  Life?: NBTInt
  /**
   * Ticks it will exist.
   */
  LifeTime?: NBTInt
  /**
   * Whether it should move at an angle.
   */
  ShotAtAngle?: boolean
  FireworksItem?: ItemStack
})
