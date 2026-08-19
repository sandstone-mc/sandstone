import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_MULTI_NOISE_BIOME_SOURCE_PARAMETER_LISTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_MULTI_NOISE_BIOME_SOURCE_PARAMETER_LISTS_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_MULTI_NOISE_BIOME_SOURCE_PARAMETER_LISTS_SET>}`)

export const JSONWORLDGEN_MULTI_NOISE_BIOME_SOURCE_PARAMETER_LISTS_SET = new Set([
  'nether',
  'overworld',
] as const)
