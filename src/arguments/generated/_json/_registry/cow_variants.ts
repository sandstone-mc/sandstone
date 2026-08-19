import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONCOW_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONCOW_VARIANTS_SET>>
  | `minecraft:${SetType<typeof JSONCOW_VARIANTS_SET>}`)

export const JSONCOW_VARIANTS_SET = new Set([
  'cold',
  'temperate',
  'warm',
] as const)
