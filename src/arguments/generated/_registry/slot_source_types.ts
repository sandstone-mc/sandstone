import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type SLOT_SOURCE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof SLOT_SOURCE_TYPES_SET>>
  | `minecraft:${SetType<typeof SLOT_SOURCE_TYPES_SET>}`)

export const SLOT_SOURCE_TYPES_SET = new Set([
    'contents',
    'empty',
    'filtered',
    'group',
    'limit_slots',
    'slot_range',
] as const)
