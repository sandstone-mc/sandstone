import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_BLOCK_STATE_PROVIDER_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof WORLDGEN_BLOCK_STATE_PROVIDER_TYPES_SET>>
    | `minecraft:${SetType<typeof WORLDGEN_BLOCK_STATE_PROVIDER_TYPES_SET>}`)

export const WORLDGEN_BLOCK_STATE_PROVIDER_TYPES_SET = new Set([
    'dual_noise_provider',
    'noise_provider',
    'noise_threshold_provider',
    'randomized_int_state_provider',
    'rotated_block_provider',
    'simple_state_provider',
    'weighted_state_provider',
] as const)
