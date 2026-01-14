import type { EntityBase } from 'sandstone/arguments/generated/world/entity.ts'
import type { ItemStack } from 'sandstone/arguments/generated/world/item.ts'
import type { NBTLong } from 'sandstone'

export type OminousItemSpawner = (EntityBase & {
  item?: ItemStack
  spawn_item_after_ticks?: NBTLong
})
