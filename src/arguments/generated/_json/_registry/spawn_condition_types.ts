import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONSPAWN_CONDITION_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONSPAWN_CONDITION_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONSPAWN_CONDITION_TYPES_SET>}`)

export const JSONSPAWN_CONDITION_TYPES_SET = new Set([
  'biome',
  'moon_brightness',
  'structure',
] as const)
