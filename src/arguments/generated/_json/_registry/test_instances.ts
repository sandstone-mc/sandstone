import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTEST_INSTANCES = (
  | NamespacedLiteralUnion<SetType<typeof JSONTEST_INSTANCES_SET>>
  | `minecraft:${SetType<typeof JSONTEST_INSTANCES_SET>}`)

export const JSONTEST_INSTANCES_SET = new Set([
  'always_pass',
] as const)
