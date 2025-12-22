import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type HEIGHT_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof HEIGHT_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof HEIGHT_PROVIDER_TYPES_SET>}`)

export const HEIGHT_PROVIDER_TYPES_SET = new Set([
  'biased_to_bottom',
  'constant',
  'trapezoid',
  'uniform',
  'very_biased_to_bottom',
  'weighted_list',
] as const)
