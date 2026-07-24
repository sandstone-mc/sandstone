import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { TagClass } from 'sandstone'

export type BlockListRef = ((
  | Registry['minecraft:block'] | `#${Registry['minecraft:tag/block']}` | TagClass<'block'>)
  | Array<Registry['minecraft:block']>)

export type ItemListRef = ((
  | Registry['minecraft:item'] | `#${Registry['minecraft:tag/item']}` | TagClass<'item'>)
  | Array<Registry['minecraft:item']>)
