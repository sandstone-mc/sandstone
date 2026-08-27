import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_MATERIAL_RULE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_MATERIAL_RULE_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_MATERIAL_RULE_TYPES_SET>}`)

export const JSONWORLDGEN_MATERIAL_RULE_TYPES_SET = new Set([
  'bandlands',
  'block',
  'condition',
  'ore_vein',
  'sequence',
] as const)
