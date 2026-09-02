import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_BLOCK_STATE_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_BLOCK_STATE_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_BLOCK_STATE_PROVIDER_TYPES_SET>}`)

export const WORLDGEN_BLOCK_STATE_PROVIDER_TYPES_SET = new Set([
  'copy_properties',
  'dual_noise',
  'noise',
  'noise_threshold',
  'random_block',
  'randomized_int',
  'rotated',
  'rule_based',
  'simple',
  'weighted',
] as const)
