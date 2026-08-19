import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTEST_ENVIRONMENTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONTEST_ENVIRONMENTS_SET>>
  | `minecraft:${SetType<typeof JSONTEST_ENVIRONMENTS_SET>}`)

export const JSONTEST_ENVIRONMENTS_SET = new Set([
  'default',
] as const)
