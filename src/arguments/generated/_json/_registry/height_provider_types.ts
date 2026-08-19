import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONHEIGHT_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONHEIGHT_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONHEIGHT_PROVIDER_TYPES_SET>}`)

export const JSONHEIGHT_PROVIDER_TYPES_SET = new Set([
  'biased_to_bottom',
  'constant',
  'trapezoid',
  'uniform',
  'very_biased_to_bottom',
  'weighted_list',
] as const)
