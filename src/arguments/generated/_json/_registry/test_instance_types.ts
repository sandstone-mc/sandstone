import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTEST_INSTANCE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONTEST_INSTANCE_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONTEST_INSTANCE_TYPES_SET>}`)

export const JSONTEST_INSTANCE_TYPES_SET = new Set([
  'block_based',
  'function',
] as const)
