import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type RECIPE_BOOK_CATEGORIES = (
  | NamespacedLiteralUnion<SetType<typeof RECIPE_BOOK_CATEGORIES_SET>>
  | `minecraft:${SetType<typeof RECIPE_BOOK_CATEGORIES_SET>}`)

export const RECIPE_BOOK_CATEGORIES_SET = new Set([
  'blast_furnace_blocks',
  'blast_furnace_misc',
  'campfire',
  'crafting_building_blocks',
  'crafting_equipment',
  'crafting_misc',
  'crafting_redstone',
  'furnace_blocks',
  'furnace_food',
  'furnace_misc',
  'smithing',
  'smoker_food',
  'stonecutter',
] as const)
