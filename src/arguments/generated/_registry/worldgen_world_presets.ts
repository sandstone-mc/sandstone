import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_WORLD_PRESETS = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_WORLD_PRESETS_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_WORLD_PRESETS_SET>}`)

export const WORLDGEN_WORLD_PRESETS_SET = new Set([
  'amplified',
  'debug_all_block_states',
  'flat',
  'large_biomes',
  'normal',
  'single_biome_surface',
] as const)
