import type { LootFunction } from 'sandstone/arguments/generated/data/loot/function.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { ItemModifierClass, TagClass } from 'sandstone'

export type ItemModifier = (
  | LootFunction
  | Array<ItemModifier> | (
  `${string}:${string}` | `#${string}:${string}` | TagClass<'item_modifier'> | ItemModifierClass))
