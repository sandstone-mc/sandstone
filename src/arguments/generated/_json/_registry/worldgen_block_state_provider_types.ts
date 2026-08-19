import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_BLOCK_STATE_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_BLOCK_STATE_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_BLOCK_STATE_PROVIDER_TYPES_SET>}`)

export const JSONWORLDGEN_BLOCK_STATE_PROVIDER_TYPES_SET = new Set([
  'copy_properties_provider',
  'dual_noise_provider',
  'noise_provider',
  'noise_threshold_provider',
  'random_block_provider',
  'randomized_int_state_provider',
  'rotated_block_provider',
  'rule_based_state_provider',
  'simple_state_provider',
  'weighted_state_provider',
] as const)
