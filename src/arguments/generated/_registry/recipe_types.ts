import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type RECIPE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof RECIPE_TYPES_SET>>
  | `minecraft:${SetType<typeof RECIPE_TYPES_SET>}`)

export const RECIPE_TYPES_SET = new Set([
  'blasting',
  'campfire_cooking',
  'crafting',
  'smelting',
  'smithing',
  'smoking',
  'stonecutting',
] as const)
