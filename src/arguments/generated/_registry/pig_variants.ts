import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type PIG_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof PIG_VARIANTS_SET>>
  | `minecraft:${SetType<typeof PIG_VARIANTS_SET>}`)

export const PIG_VARIANTS_SET = new Set([
    'cold',
    'temperate',
    'warm',
] as const)
