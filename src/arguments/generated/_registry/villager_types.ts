import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type VILLAGER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof VILLAGER_TYPES_SET>>
  | `minecraft:${SetType<typeof VILLAGER_TYPES_SET>}`)

export const VILLAGER_TYPES_SET = new Set([
  'desert',
  'jungle',
  'plains',
  'savanna',
  'snow',
  'swamp',
  'taiga',
] as const)
