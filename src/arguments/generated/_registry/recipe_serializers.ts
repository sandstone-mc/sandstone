import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type RECIPE_SERIALIZERS = (
  | NamespacedLiteralUnion<SetType<typeof RECIPE_SERIALIZERS_SET>>
  | `minecraft:${SetType<typeof RECIPE_SERIALIZERS_SET>}`)

export const RECIPE_SERIALIZERS_SET = new Set([
  'blasting',
  'campfire_cooking',
  'crafting_decorated_pot',
  'crafting_dye',
  'crafting_imbue',
  'crafting_shaped',
  'crafting_shapeless',
  'crafting_special_bannerduplicate',
  'crafting_special_bookcloning',
  'crafting_special_firework_rocket',
  'crafting_special_firework_star',
  'crafting_special_firework_star_fade',
  'crafting_special_mapextending',
  'crafting_special_repairitem',
  'crafting_special_shielddecoration',
  'crafting_transmute',
  'smelting',
  'smithing_transform',
  'smithing_trim',
  'smoking',
  'stonecutting',
] as const)
