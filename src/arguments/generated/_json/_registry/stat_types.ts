import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONSTAT_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONSTAT_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONSTAT_TYPES_SET>}`)

export const JSONSTAT_TYPES_SET = new Set([
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
