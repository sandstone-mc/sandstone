import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONPREDICATES = (
  | NamespacedLiteralUnion<SetType<typeof JSONPREDICATES_SET>>
  | `minecraft:${SetType<typeof JSONPREDICATES_SET>}`)

export const JSONPREDICATES_SET = new Set([
  'block/fast_cooking',
  'tool/can_shear',
  'tool/can_silk_touch',
] as const)
