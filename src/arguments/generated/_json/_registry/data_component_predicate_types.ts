import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONDATA_COMPONENT_PREDICATE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONDATA_COMPONENT_PREDICATE_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONDATA_COMPONENT_PREDICATE_TYPES_SET>}`)

export const JSONDATA_COMPONENT_PREDICATE_TYPES_SET = new Set([
  'attribute_modifiers',
  'bundle_contents',
  'container',
  'custom_data',
  'damage',
  'enchantments',
  'firework_explosion',
  'fireworks',
  'jukebox_playable',
  'potion_contents',
  'stored_enchantments',
  'trim',
  'villager/variant',
  'writable_book_content',
  'written_book_content',
] as const)
