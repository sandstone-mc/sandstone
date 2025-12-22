import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TEST_INSTANCE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof TEST_INSTANCE_TYPES_SET>>
  | `minecraft:${SetType<typeof TEST_INSTANCE_TYPES_SET>}`)

export const TEST_INSTANCE_TYPES_SET = new Set([
  'block_based',
  'function',
] as const)
