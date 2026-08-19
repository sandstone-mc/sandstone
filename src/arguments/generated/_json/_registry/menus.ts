import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONMENUS = (
  | NamespacedLiteralUnion<SetType<typeof JSONMENUS_SET>>
  | `minecraft:${SetType<typeof JSONMENUS_SET>}`)

export const JSONMENUS_SET = new Set([
  'anvil',
  'beacon',
  'blast_furnace',
  'brewing_stand',
  'cartography_table',
  'crafter_3x3',
  'crafting',
  'enchantment',
  'furnace',
  'generic_3x3',
  'generic_9x1',
  'generic_9x2',
  'generic_9x3',
  'generic_9x4',
  'generic_9x5',
  'generic_9x6',
  'grindstone',
  'hopper',
  'lectern',
  'loom',
  'merchant',
  'shulker_box',
  'smithing',
  'smoker',
  'stonecutter',
] as const)
