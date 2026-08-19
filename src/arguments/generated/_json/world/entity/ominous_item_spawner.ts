import type { JsonEntityBase } from 'sandstone/arguments/generated/_json/world/entity.ts'
import type { JsonItemStack } from 'sandstone/arguments/generated/_json/world/item.ts'
import type { NBTLong } from 'sandstone'

export type JsonOminousItemSpawner = (JsonEntityBase & {
  item?: JsonItemStack,
  spawn_item_after_ticks?: (NBTLong | number),
})
