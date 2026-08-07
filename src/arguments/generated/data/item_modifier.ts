import type { LootFunction } from 'sandstone/arguments/generated/data/loot/function.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { ItemModifierClass, NamespacedString, TagClass } from 'sandstone'

export type ItemModifier = (
  | LootFunction
  | Array<ItemModifier> | (
  NamespacedString | `#${string}:${string}` | TagClass<'item_modifier'> | ItemModifierClass))
