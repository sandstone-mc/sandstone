import type { JsonProjectileBase } from 'sandstone/arguments/generated/_json/world/entity/projectile.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTLong } from 'sandstone'

export type JsonOwner = {
  /**
   * Upper bits of the owner's UUID.
   */
  M?: (NBTLong | number),
  /**
   * Lower bits of the owner's UUID.
   */
  L?: (NBTLong | number),
}

export type JsonPotion = (JsonThrowable & {
  /**
   * Item representation of the potion.
   */
  Item?: JsonItemStack,
})

export type JsonThrowable = JsonProjectileBase

export type JsonThrowableItem = (JsonThrowable & {
  /**
   * Item representation of the projectile.
   */
  Item?: JsonItemStack,
})
