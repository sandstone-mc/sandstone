import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type SPAWN_CONDITION_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof SPAWN_CONDITION_TYPES_SET>>
  | `minecraft:${SetType<typeof SPAWN_CONDITION_TYPES_SET>}`)

export const SPAWN_CONDITION_TYPES_SET = new Set([
  'biome',
  'moon_brightness',
  'structure',
] as const)
