import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type STAT_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof STAT_TYPES_SET>>
  | `minecraft:${SetType<typeof STAT_TYPES_SET>}`)

export const STAT_TYPES_SET = new Set([
  'broken',
  'crafted',
  'custom',
  'dropped',
  'killed',
  'killed_by',
  'mined',
  'picked_up',
  'used',
] as const)
