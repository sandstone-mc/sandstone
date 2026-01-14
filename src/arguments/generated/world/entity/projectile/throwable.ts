import type { ProjectileBase } from 'sandstone/arguments/generated/world/entity/projectile.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTLong } from 'sandstone'

export type Owner = {
  /**
   * Upper bits of the owner's UUID.
   */
  M?: NBTLong
  /**
   * Lower bits of the owner's UUID.
   */
  L?: NBTLong
}

export type Potion = (Throwable & {
  /**
   * Item representation of the potion.
   */
  Item?: ItemStack
})

export type Throwable = ProjectileBase

export type ThrowableItem = (Throwable & {
  /**
   * Item representation of the projectile.
   */
  Item?: ItemStack
})
