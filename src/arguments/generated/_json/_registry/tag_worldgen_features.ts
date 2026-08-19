import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTAG_WORLDGEN_FEATURES = (
  | NamespacedLiteralUnion<SetType<typeof JSONTAG_WORLDGEN_FEATURES_SET>>
  | `minecraft:${SetType<typeof JSONTAG_WORLDGEN_FEATURES_SET>}`)

export const JSONTAG_WORLDGEN_FEATURES_SET = new Set([
  'can_spawn_from_bone_meal',
] as const)
