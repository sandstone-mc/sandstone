import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type ENCHANTMENT_LEVEL_BASED_VALUE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof ENCHANTMENT_LEVEL_BASED_VALUE_TYPES_SET>>
  | `minecraft:${SetType<typeof ENCHANTMENT_LEVEL_BASED_VALUE_TYPES_SET>}`)

export const ENCHANTMENT_LEVEL_BASED_VALUE_TYPES_SET = new Set([
  'clamped',
  'exponent',
  'fraction',
  'levels_squared',
  'linear',
  'lookup',
] as const)
