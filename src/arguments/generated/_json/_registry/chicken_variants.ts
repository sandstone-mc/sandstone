import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONCHICKEN_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONCHICKEN_VARIANTS_SET>>
  | `minecraft:${SetType<typeof JSONCHICKEN_VARIANTS_SET>}`)

export const JSONCHICKEN_VARIANTS_SET = new Set([
  'cold',
  'temperate',
  'warm',
] as const)
