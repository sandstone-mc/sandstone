import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type RECIPE_DISPLAYS = (
  | NamespacedLiteralUnion<SetType<typeof RECIPE_DISPLAYS_SET>>
  | `minecraft:${SetType<typeof RECIPE_DISPLAYS_SET>}`)

export const RECIPE_DISPLAYS_SET = new Set([
  'crafting_shaped',
  'crafting_shapeless',
  'furnace',
  'smithing',
  'stonecutter',
] as const)
