import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_CONFIGURED_CARVERS = (
    | NamespacedLiteralUnion<SetType<typeof WORLDGEN_CONFIGURED_CARVERS_SET>>
    | `minecraft:${SetType<typeof WORLDGEN_CONFIGURED_CARVERS_SET>}`)

export const WORLDGEN_CONFIGURED_CARVERS_SET = new Set([
    'canyon',
    'cave',
    'cave_extra_underground',
    'nether_cave',
] as const)
