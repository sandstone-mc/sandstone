import type { JsonSkullOwner } from 'sandstone/arguments/generated/_json/world/block/head.ts'
import type { JsonItemBase } from 'sandstone/arguments/generated/_json/world/item.ts'

export type JsonPlayerHead = (JsonItemBase & {
  SkullOwner?: (JsonSkullOwner | string),
})
