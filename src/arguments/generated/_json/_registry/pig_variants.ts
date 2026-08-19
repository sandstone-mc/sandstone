import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONPIG_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONPIG_VARIANTS_SET>>
  | `minecraft:${SetType<typeof JSONPIG_VARIANTS_SET>}`)

export const JSONPIG_VARIANTS_SET = new Set([
  'cold',
  'temperate',
  'warm',
] as const)
