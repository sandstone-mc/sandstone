import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTICKET_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONTICKET_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONTICKET_TYPES_SET>}`)

export const JSONTICKET_TYPES_SET = new Set([
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
