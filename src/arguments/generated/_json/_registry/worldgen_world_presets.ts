import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_WORLD_PRESETS = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_WORLD_PRESETS_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_WORLD_PRESETS_SET>}`)

export const JSONWORLDGEN_WORLD_PRESETS_SET = new Set([
  'amplified',
  'debug_all_block_states',
  'flat',
  'flat_all_dimensions',
  'large_biomes',
  'normal',
  'single_biome_surface',
] as const)
