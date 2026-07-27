import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type PREDICATES = (
  | NamespacedLiteralUnion<SetType<typeof PREDICATES_SET>>
  | `minecraft:${SetType<typeof PREDICATES_SET>}`)

export const PREDICATES_SET = new Set([
  'block/fast_cooking',
  'tool/can_shear',
  'tool/can_silk_touch',
] as const)
