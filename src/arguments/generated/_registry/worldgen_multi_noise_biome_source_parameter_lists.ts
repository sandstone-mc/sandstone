import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_MULTI_NOISE_BIOME_SOURCE_PARAMETER_LISTS = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_MULTI_NOISE_BIOME_SOURCE_PARAMETER_LISTS_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_MULTI_NOISE_BIOME_SOURCE_PARAMETER_LISTS_SET>}`)

export const WORLDGEN_MULTI_NOISE_BIOME_SOURCE_PARAMETER_LISTS_SET = new Set([
    'nether',
    'overworld',
] as const)
