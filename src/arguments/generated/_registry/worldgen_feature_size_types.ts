import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_FEATURE_SIZE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_FEATURE_SIZE_TYPES_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_FEATURE_SIZE_TYPES_SET>}`)

export const WORLDGEN_FEATURE_SIZE_TYPES_SET = new Set([
    'three_layers_feature_size',
    'two_layers_feature_size',
] as const)
