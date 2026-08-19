import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type BLOCK_PREDICATE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof BLOCK_PREDICATE_TYPES_SET>>
  | `minecraft:${SetType<typeof BLOCK_PREDICATE_TYPES_SET>}`)

export const BLOCK_PREDICATE_TYPES_SET = new Set([
  'all_of',
  'any_of',
  'has_sturdy_face',
  'height_range',
  'inside_world_bounds',
  'matching_biomes',
  'matching_block_tag',
  'matching_blocks',
  'matching_fluids',
  'not',
  'replaceable',
  'solid',
  'true',
  'unobstructed',
  'volume_match',
  'would_survive',
] as const)
