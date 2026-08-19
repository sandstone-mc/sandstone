import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONLOOT_POOL_ENTRY_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONLOOT_POOL_ENTRY_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONLOOT_POOL_ENTRY_TYPES_SET>}`)

export const JSONLOOT_POOL_ENTRY_TYPES_SET = new Set([
  'alternatives',
  'dynamic',
  'empty',
  'group',
  'item',
  'loot_table',
  'sequence',
  'slots',
  'tag',
] as const)
