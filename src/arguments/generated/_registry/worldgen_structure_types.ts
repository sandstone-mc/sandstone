import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_STRUCTURE_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof WORLDGEN_STRUCTURE_TYPES_SET>>
    | `minecraft:${SetType<typeof WORLDGEN_STRUCTURE_TYPES_SET>}`)

export const WORLDGEN_STRUCTURE_TYPES_SET = new Set([
    'buried_treasure',
    'desert_pyramid',
    'end_city',
    'fortress',
    'igloo',
    'jigsaw',
    'jungle_temple',
    'mineshaft',
    'nether_fossil',
    'ocean_monument',
    'ocean_ruin',
    'ruined_portal',
    'shipwreck',
    'stronghold',
    'swamp_hut',
    'woodland_mansion',
] as const)
