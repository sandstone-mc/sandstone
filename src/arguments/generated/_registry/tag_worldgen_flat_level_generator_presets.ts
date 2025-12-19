import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TAG_WORLDGEN_FLAT_LEVEL_GENERATOR_PRESETS = (
  | NamespacedLiteralUnion<SetType<typeof TAG_WORLDGEN_FLAT_LEVEL_GENERATOR_PRESETS_SET>>
  | `minecraft:${SetType<typeof TAG_WORLDGEN_FLAT_LEVEL_GENERATOR_PRESETS_SET>}`)

export const TAG_WORLDGEN_FLAT_LEVEL_GENERATOR_PRESETS_SET = new Set([
    'visible',
] as const)
