import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type ENTITY_SUB_PREDICATE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof ENTITY_SUB_PREDICATE_TYPES_SET>>
  | `minecraft:${SetType<typeof ENTITY_SUB_PREDICATE_TYPES_SET>}`)

export const ENTITY_SUB_PREDICATE_TYPES_SET = new Set([
  'components',
  'distance',
  'effects',
  'entity_tags',
  'entity_type',
  'equipment',
  'flags',
  'location',
  'movement',
  'movement_affected_by',
  'nbt',
  'passenger',
  'periodic_tick',
  'predicates',
  'slots',
  'stepping_on',
  'targeted_entity',
  'team',
  'type_specific/cube_mob',
  'type_specific/fishing_hook',
  'type_specific/lightning',
  'type_specific/player',
  'type_specific/raider',
  'type_specific/sheep',
  'vehicle',
] as const)
