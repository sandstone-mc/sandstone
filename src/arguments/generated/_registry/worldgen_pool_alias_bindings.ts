import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_POOL_ALIAS_BINDINGS = (
    | NamespacedLiteralUnion<SetType<typeof WORLDGEN_POOL_ALIAS_BINDINGS_SET>>
    | `minecraft:${SetType<typeof WORLDGEN_POOL_ALIAS_BINDINGS_SET>}`)

export const WORLDGEN_POOL_ALIAS_BINDINGS_SET = new Set([
    'direct',
    'random',
    'random_group',
] as const)
