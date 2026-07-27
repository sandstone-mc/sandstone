import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type LOOT_NUMBER_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof LOOT_NUMBER_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof LOOT_NUMBER_PROVIDER_TYPES_SET>}`)

export const LOOT_NUMBER_PROVIDER_TYPES_SET = new Set([
  'binomial',
  'conditional',
  'constant',
  'enchantment_level',
  'environment_attribute',
  'number_dispatcher',
  'score',
  'storage',
  'sum',
  'uniform',
  'weighted_list',
] as const)
