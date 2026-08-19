import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONPOSITION_SOURCE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONPOSITION_SOURCE_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONPOSITION_SOURCE_TYPES_SET>}`)

export const JSONPOSITION_SOURCE_TYPES_SET = new Set([
  'block',
  'entity',
] as const)
