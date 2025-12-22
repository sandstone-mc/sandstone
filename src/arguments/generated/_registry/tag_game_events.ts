import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TAG_GAME_EVENTS = (
  | NamespacedLiteralUnion<SetType<typeof TAG_GAME_EVENTS_SET>>
  | `minecraft:${SetType<typeof TAG_GAME_EVENTS_SET>}`)

export const TAG_GAME_EVENTS_SET = new Set([
  'allay_can_listen',
  'ignore_vibrations_sneaking',
  'shrieker_can_listen',
  'vibrations',
  'warden_can_listen',
] as const)
