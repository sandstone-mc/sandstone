import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONLOOT_NUMBER_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONLOOT_NUMBER_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONLOOT_NUMBER_PROVIDER_TYPES_SET>}`)

export const JSONLOOT_NUMBER_PROVIDER_TYPES_SET = new Set([
  'average',
  'binomial',
  'conditional',
  'constant',
  'enchantment_level',
  'environment_attribute',
  'maximum',
  'minimum',
  'number_dispatcher',
  'product',
  'score',
  'storage',
  'sum',
  'uniform',
  'weighted_list',
] as const)
