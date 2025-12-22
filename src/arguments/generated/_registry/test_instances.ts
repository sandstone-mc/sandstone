import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TEST_INSTANCES = (
  | NamespacedLiteralUnion<SetType<typeof TEST_INSTANCES_SET>>
  | `minecraft:${SetType<typeof TEST_INSTANCES_SET>}`)

export const TEST_INSTANCES_SET = new Set([
  'always_pass',
] as const)
