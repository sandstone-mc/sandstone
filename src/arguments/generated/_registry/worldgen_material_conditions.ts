import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_MATERIAL_CONDITIONS = (
    | NamespacedLiteralUnion<SetType<typeof WORLDGEN_MATERIAL_CONDITIONS_SET>>
    | `minecraft:${SetType<typeof WORLDGEN_MATERIAL_CONDITIONS_SET>}`)

export const WORLDGEN_MATERIAL_CONDITIONS_SET = new Set([
    'above_preliminary_surface',
    'biome',
    'hole',
    'noise_threshold',
    'not',
    'steep',
    'stone_depth',
    'temperature',
    'vertical_gradient',
    'water',
    'y_above',
] as const)
