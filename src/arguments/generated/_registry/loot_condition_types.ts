import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type LOOT_CONDITION_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof LOOT_CONDITION_TYPES_SET>>
    | `minecraft:${SetType<typeof LOOT_CONDITION_TYPES_SET>}`)

export const LOOT_CONDITION_TYPES_SET = new Set([
    'all_of',
    'any_of',
    'block_state_property',
    'damage_source_properties',
    'enchantment_active_check',
    'entity_properties',
    'entity_scores',
    'inverted',
    'killed_by_player',
    'location_check',
    'match_tool',
    'random_chance',
    'random_chance_with_enchanted_bonus',
    'reference',
    'survives_explosion',
    'table_bonus',
    'time_check',
    'value_check',
    'weather_check',
] as const)
