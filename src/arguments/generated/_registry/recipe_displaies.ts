import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type RECIPE_DISPLAIES = (
  | NamespacedLiteralUnion<SetType<typeof RECIPE_DISPLAIES_SET>>
  | `minecraft:${SetType<typeof RECIPE_DISPLAIES_SET>}`)

export const RECIPE_DISPLAIES_SET = new Set([
    'crafting_shaped',
    'crafting_shapeless',
    'furnace',
    'smithing',
    'stonecutter',
] as const)
