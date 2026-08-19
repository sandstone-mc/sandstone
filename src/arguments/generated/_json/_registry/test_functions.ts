import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTEST_FUNCTIONS = (
  | NamespacedLiteralUnion<SetType<typeof JSONTEST_FUNCTIONS_SET>>
  | `minecraft:${SetType<typeof JSONTEST_FUNCTIONS_SET>}`)

export const JSONTEST_FUNCTIONS_SET = new Set([
  'always_pass',
] as const)
