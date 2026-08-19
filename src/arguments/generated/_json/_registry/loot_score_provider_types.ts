import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONLOOT_SCORE_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONLOOT_SCORE_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONLOOT_SCORE_PROVIDER_TYPES_SET>}`)

export const JSONLOOT_SCORE_PROVIDER_TYPES_SET = new Set([
  'context',
  'fixed',
] as const)
