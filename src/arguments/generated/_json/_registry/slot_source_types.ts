import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONSLOT_SOURCE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONSLOT_SOURCE_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONSLOT_SOURCE_TYPES_SET>}`)

export const JSONSLOT_SOURCE_TYPES_SET = new Set([
  'contents',
  'empty',
  'filtered',
  'group',
  'limit_slots',
  'slot_range',
] as const)
