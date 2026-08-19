import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_BIOME_SOURCES = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_BIOME_SOURCES_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_BIOME_SOURCES_SET>}`)

export const JSONWORLDGEN_BIOME_SOURCES_SET = new Set([
  'checkerboard',
  'fixed',
  'multi_noise',
  'the_end',
] as const)
