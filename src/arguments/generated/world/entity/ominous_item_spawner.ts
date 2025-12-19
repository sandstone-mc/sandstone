import type { EntityBase } from 'sandstone/generated/world/entity'
import type { ItemStack } from 'sandstone/generated/world/item'
import type { NBTLong } from 'sandstone'

export type OminousItemSpawner = (EntityBase & {
    item?: ItemStack
    spawn_item_after_ticks?: NBTLong
})
