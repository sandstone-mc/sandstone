import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type DIMENSION_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof DIMENSION_TYPES_SET>>
  | `minecraft:${SetType<typeof DIMENSION_TYPES_SET>}`)

export const DIMENSION_TYPES_SET = new Set([
  'overworld',
  'overworld_caves',
  'the_end',
  'the_nether',
] as const)
