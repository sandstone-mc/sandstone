import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_FOLIAGE_PLACER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_FOLIAGE_PLACER_TYPES_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_FOLIAGE_PLACER_TYPES_SET>}`)

export const WORLDGEN_FOLIAGE_PLACER_TYPES_SET = new Set([
    'acacia_foliage_placer',
    'blob_foliage_placer',
    'bush_foliage_placer',
    'cherry_foliage_placer',
    'dark_oak_foliage_placer',
    'fancy_foliage_placer',
    'jungle_foliage_placer',
    'mega_pine_foliage_placer',
    'pine_foliage_placer',
    'random_spread_foliage_placer',
    'spruce_foliage_placer',
] as const)
