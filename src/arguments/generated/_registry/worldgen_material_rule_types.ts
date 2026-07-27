import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_MATERIAL_RULE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_MATERIAL_RULE_TYPES_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_MATERIAL_RULE_TYPES_SET>}`)

export const WORLDGEN_MATERIAL_RULE_TYPES_SET = new Set([
  'bandlands',
  'block',
  'condition',
  'sequence',
] as const)
