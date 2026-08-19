import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_CARVER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_CARVER_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_CARVER_TYPES_SET>}`)

export const JSONWORLDGEN_CARVER_TYPES_SET = new Set([
  'canyon',
  'cave',
] as const)
