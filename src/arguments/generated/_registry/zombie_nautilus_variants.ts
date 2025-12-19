import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type ZOMBIE_NAUTILUS_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof ZOMBIE_NAUTILUS_VARIANTS_SET>>
  | `minecraft:${SetType<typeof ZOMBIE_NAUTILUS_VARIANTS_SET>}`)

export const ZOMBIE_NAUTILUS_VARIANTS_SET = new Set([
    'temperate',
    'warm',
] as const)
