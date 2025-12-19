import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_ROOT_PLACER_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof WORLDGEN_ROOT_PLACER_TYPES_SET>>
    | `minecraft:${SetType<typeof WORLDGEN_ROOT_PLACER_TYPES_SET>}`)

export const WORLDGEN_ROOT_PLACER_TYPES_SET = new Set([
    'mangrove_root_placer',
] as const)
