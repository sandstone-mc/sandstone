import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_FLAT_LEVEL_GENERATOR_PRESETS = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_FLAT_LEVEL_GENERATOR_PRESETS_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_FLAT_LEVEL_GENERATOR_PRESETS_SET>}`)

export const WORLDGEN_FLAT_LEVEL_GENERATOR_PRESETS_SET = new Set([
    'bottomless_pit',
    'classic_flat',
    'desert',
    'overworld',
    'redstone_ready',
    'snowy_kingdom',
    'the_void',
    'tunnelers_dream',
    'water_world',
] as const)
