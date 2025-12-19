import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type LOOT_SCORE_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof LOOT_SCORE_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof LOOT_SCORE_PROVIDER_TYPES_SET>}`)

export const LOOT_SCORE_PROVIDER_TYPES_SET = new Set([
    'context',
    'fixed',
] as const)
