import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TEST_ENVIRONMENT_DEFINITION_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof TEST_ENVIRONMENT_DEFINITION_TYPES_SET>>
    | `minecraft:${SetType<typeof TEST_ENVIRONMENT_DEFINITION_TYPES_SET>}`)

export const TEST_ENVIRONMENT_DEFINITION_TYPES_SET = new Set([
    'all_of',
    'function',
    'game_rules',
    'time_of_day',
    'weather',
] as const)
