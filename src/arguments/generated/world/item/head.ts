import type { SkullOwner } from 'sandstone/arguments/generated/world/block/head.ts'
import type { ItemBase } from 'sandstone/arguments/generated/world/item.ts'

export type PlayerHead = (ItemBase & {
  SkullOwner?: (SkullOwner | string),
})
