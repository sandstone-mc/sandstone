import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_CARVER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_CARVER_TYPES_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_CARVER_TYPES_SET>}`)

export const WORLDGEN_CARVER_TYPES_SET = new Set([
  'canyon',
  'cave',
] as const)
