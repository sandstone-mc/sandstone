import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONDEBUG_SUBSCRIPTIONS = (
  | NamespacedLiteralUnion<SetType<typeof JSONDEBUG_SUBSCRIPTIONS_SET>>
  | `minecraft:${SetType<typeof JSONDEBUG_SUBSCRIPTIONS_SET>}`)

export const JSONDEBUG_SUBSCRIPTIONS_SET = new Set([
  'bee_hives',
  'bees',
  'brains',
  'breezes',
  'dedicated_server_tick_time',
  'entity_block_intersections',
  'entity_paths',
  'game_event_listeners',
  'game_events',
  'goal_selectors',
  'neighbor_updates',
  'pois',
  'raids',
  'redstone_wire_orientations',
  'structures',
  'village_sections',
] as const)
