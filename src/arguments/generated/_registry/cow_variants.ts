import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type COW_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof COW_VARIANTS_SET>>
  | `minecraft:${SetType<typeof COW_VARIANTS_SET>}`)

export const COW_VARIANTS_SET = new Set([
  'cold',
  'temperate',
  'warm',
] as const)
