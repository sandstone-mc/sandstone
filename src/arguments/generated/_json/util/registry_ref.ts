import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { TagClass } from 'sandstone'

export type JsonBlockListRef = ((
  | JsonRegistry['minecraft:block'] | `#${JsonRegistry['minecraft:tag/block']}` | TagClass<'block'>)
  | Array<JsonRegistry['minecraft:block']>)

export type JsonItemListRef = ((
  | JsonRegistry['minecraft:item'] | `#${JsonRegistry['minecraft:tag/item']}` | TagClass<'item'>)
  | Array<JsonRegistry['minecraft:item']>)
