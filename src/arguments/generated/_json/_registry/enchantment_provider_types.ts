import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONENCHANTMENT_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONENCHANTMENT_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONENCHANTMENT_PROVIDER_TYPES_SET>}`)

export const JSONENCHANTMENT_PROVIDER_TYPES_SET = new Set([
  'by_cost',
  'by_cost_with_difficulty',
  'single',
] as const)
