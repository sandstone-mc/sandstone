import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONENCHANTMENT_VALUE_EFFECT_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONENCHANTMENT_VALUE_EFFECT_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONENCHANTMENT_VALUE_EFFECT_TYPES_SET>}`)

export const JSONENCHANTMENT_VALUE_EFFECT_TYPES_SET = new Set([
  'add',
  'all_of',
  'exponential',
  'multiply',
  'remove_binomial',
  'set',
] as const)
