import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONZOMBIE_NAUTILUS_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONZOMBIE_NAUTILUS_VARIANTS_SET>>
  | `minecraft:${SetType<typeof JSONZOMBIE_NAUTILUS_VARIANTS_SET>}`)

export const JSONZOMBIE_NAUTILUS_VARIANTS_SET = new Set([
  'temperate',
  'warm',
] as const)
