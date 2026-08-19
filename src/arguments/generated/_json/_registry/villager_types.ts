import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONVILLAGER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONVILLAGER_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONVILLAGER_TYPES_SET>}`)

export const JSONVILLAGER_TYPES_SET = new Set([
  'desert',
  'jungle',
  'plains',
  'savanna',
  'snow',
  'swamp',
  'taiga',
] as const)
