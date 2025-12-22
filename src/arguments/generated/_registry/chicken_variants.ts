import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type CHICKEN_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof CHICKEN_VARIANTS_SET>>
  | `minecraft:${SetType<typeof CHICKEN_VARIANTS_SET>}`)

export const CHICKEN_VARIANTS_SET = new Set([
  'cold',
  'temperate',
  'warm',
] as const)
