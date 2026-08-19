import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONRULE_BLOCK_ENTITY_MODIFIERS = (
  | NamespacedLiteralUnion<SetType<typeof JSONRULE_BLOCK_ENTITY_MODIFIERS_SET>>
  | `minecraft:${SetType<typeof JSONRULE_BLOCK_ENTITY_MODIFIERS_SET>}`)

export const JSONRULE_BLOCK_ENTITY_MODIFIERS_SET = new Set([
  'append_loot',
  'append_static',
  'clear',
  'passthrough',
] as const)
