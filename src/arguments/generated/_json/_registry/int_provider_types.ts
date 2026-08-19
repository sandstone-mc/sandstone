import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONINT_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONINT_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONINT_PROVIDER_TYPES_SET>}`)

export const JSONINT_PROVIDER_TYPES_SET = new Set([
  'biased_to_bottom',
  'clamped',
  'clamped_normal',
  'constant',
  'trapezoid',
  'uniform',
  'very_biased_to_bottom',
  'weighted_list',
] as const)
