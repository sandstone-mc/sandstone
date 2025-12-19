import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type ENCHANTMENT_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof ENCHANTMENT_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof ENCHANTMENT_PROVIDER_TYPES_SET>}`)

export const ENCHANTMENT_PROVIDER_TYPES_SET = new Set([
    'by_cost',
    'by_cost_with_difficulty',
    'single',
] as const)
