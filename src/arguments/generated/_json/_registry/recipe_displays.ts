import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONRECIPE_DISPLAYS = (
  | NamespacedLiteralUnion<SetType<typeof JSONRECIPE_DISPLAYS_SET>>
  | `minecraft:${SetType<typeof JSONRECIPE_DISPLAYS_SET>}`)

export const JSONRECIPE_DISPLAYS_SET = new Set([
  'crafting_shaped',
  'crafting_shapeless',
  'furnace',
  'smithing',
  'stonecutter',
] as const)
