import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONLOOT_CONDITION_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONLOOT_CONDITION_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONLOOT_CONDITION_TYPES_SET>}`)

export const JSONLOOT_CONDITION_TYPES_SET = new Set([
  'all_of',
  'any_of',
  'damage_source_properties',
  'enchantment_active_check',
  'entity_properties',
  'entity_scores',
  'environment_attribute_check',
  'inverted',
  'killed_by_player',
  'location_check',
  'match_block',
  'match_tool',
  'random_chance',
  'random_chance_with_enchanted_bonus',
  'survives_explosion',
  'table_bonus',
  'time_check',
  'value_check',
  'weather_check',
] as const)
