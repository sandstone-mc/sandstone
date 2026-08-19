import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONRECIPE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONRECIPE_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONRECIPE_TYPES_SET>}`)

export const JSONRECIPE_TYPES_SET = new Set([
  'blasting',
  'brewing',
  'campfire_cooking',
  'crafting',
  'smelting',
  'smithing',
  'smoking',
  'stonecutting',
] as const)
