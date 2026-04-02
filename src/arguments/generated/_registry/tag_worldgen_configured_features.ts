import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TAG_WORLDGEN_CONFIGURED_FEATURES = (
  | NamespacedLiteralUnion<SetType<typeof TAG_WORLDGEN_CONFIGURED_FEATURES_SET>>
  | `minecraft:${SetType<typeof TAG_WORLDGEN_CONFIGURED_FEATURES_SET>}`)

export const TAG_WORLDGEN_CONFIGURED_FEATURES_SET = new Set([
  'can_spawn_from_bone_meal',
] as const)
