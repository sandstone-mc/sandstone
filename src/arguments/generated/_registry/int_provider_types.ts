import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type INT_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof INT_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof INT_PROVIDER_TYPES_SET>}`)

export const INT_PROVIDER_TYPES_SET = new Set([
    'biased_to_bottom',
    'clamped',
    'clamped_normal',
    'constant',
    'uniform',
    'weighted_list',
] as const)
