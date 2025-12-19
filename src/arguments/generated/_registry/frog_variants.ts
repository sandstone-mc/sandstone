import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type FROG_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof FROG_VARIANTS_SET>>
  | `minecraft:${SetType<typeof FROG_VARIANTS_SET>}`)

export const FROG_VARIANTS_SET = new Set([
    'cold',
    'temperate',
    'warm',
] as const)
