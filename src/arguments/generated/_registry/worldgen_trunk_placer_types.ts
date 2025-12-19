import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_TRUNK_PLACER_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof WORLDGEN_TRUNK_PLACER_TYPES_SET>>
    | `minecraft:${SetType<typeof WORLDGEN_TRUNK_PLACER_TYPES_SET>}`)

export const WORLDGEN_TRUNK_PLACER_TYPES_SET = new Set([
    'bending_trunk_placer',
    'cherry_trunk_placer',
    'dark_oak_trunk_placer',
    'fancy_trunk_placer',
    'forking_trunk_placer',
    'giant_trunk_placer',
    'mega_jungle_trunk_placer',
    'straight_trunk_placer',
    'upwards_branching_trunk_placer',
] as const)
