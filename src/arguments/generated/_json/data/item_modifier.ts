import type { JsonLootFunction } from 'sandstone/arguments/generated/_json/data/loot/function.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { ItemModifierClass, NamespacedString, TagClass } from 'sandstone'

export type JsonItemModifier = (
  | JsonLootFunction
  | Array<JsonItemModifier> | (
  NamespacedString | `#${string}:${string}` | TagClass<'item_modifier'> | ItemModifierClass))

export type JsonItemModifierRoot = JsonLootFunction
