import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_MATERIAL_CONDITIONS = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_MATERIAL_CONDITIONS_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_MATERIAL_CONDITIONS_SET>}`)

export const WORLDGEN_MATERIAL_CONDITIONS_SET = new Set([
  'deep_under_floor',
  'not_under_deep_water',
  'not_underwater',
  'on_ceiling',
  'on_floor',
  'under_ceiling',
  'under_floor',
  'very_deep_under_floor',
] as const)
