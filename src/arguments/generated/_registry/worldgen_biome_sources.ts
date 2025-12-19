import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_BIOME_SOURCES = (
    | NamespacedLiteralUnion<SetType<typeof WORLDGEN_BIOME_SOURCES_SET>>
    | `minecraft:${SetType<typeof WORLDGEN_BIOME_SOURCES_SET>}`)

export const WORLDGEN_BIOME_SOURCES_SET = new Set([
    'checkerboard',
    'fixed',
    'multi_noise',
    'the_end',
] as const)
