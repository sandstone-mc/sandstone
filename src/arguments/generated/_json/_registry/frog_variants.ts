import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONFROG_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONFROG_VARIANTS_SET>>
  | `minecraft:${SetType<typeof JSONFROG_VARIANTS_SET>}`)

export const JSONFROG_VARIANTS_SET = new Set([
  'cold',
  'temperate',
  'warm',
] as const)
