import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_MATERIAL_CONDITION_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_MATERIAL_CONDITION_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_MATERIAL_CONDITION_TYPES_SET>}`)

export const JSONWORLDGEN_MATERIAL_CONDITION_TYPES_SET = new Set([
  'above_preliminary_surface',
  'biome',
  'hole',
  'noise_threshold',
  'not',
  'steep',
  'stone_depth',
  'temperature',
  'vertical_gradient',
  'water',
  'y_above',
] as const)
