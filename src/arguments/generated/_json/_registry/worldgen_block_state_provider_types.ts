import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_BLOCK_STATE_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_BLOCK_STATE_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_BLOCK_STATE_PROVIDER_TYPES_SET>}`)

export const JSONWORLDGEN_BLOCK_STATE_PROVIDER_TYPES_SET = new Set([
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
