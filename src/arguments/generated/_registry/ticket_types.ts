import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TICKET_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof TICKET_TYPES_SET>>
  | `minecraft:${SetType<typeof TICKET_TYPES_SET>}`)

export const TICKET_TYPES_SET = new Set([
  'dragon',
  'ender_pearl',
  'forced',
  'player_loading',
  'player_simulation',
  'player_spawn',
  'portal',
  'spawn_search',
  'unknown',
] as const)
