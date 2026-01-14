import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TEST_ENVIRONMENT_DEFINITION_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof TEST_ENVIRONMENT_DEFINITION_TYPES_SET>>
  | `minecraft:${SetType<typeof TEST_ENVIRONMENT_DEFINITION_TYPES_SET>}`)

export const TEST_ENVIRONMENT_DEFINITION_TYPES_SET = new Set([
  'all_of',
  'clock_time',
  'function',
  'game_rules',
  'weather',
] as const)
