import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONPOS_RULE_TESTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONPOS_RULE_TESTS_SET>>
  | `minecraft:${SetType<typeof JSONPOS_RULE_TESTS_SET>}`)

export const JSONPOS_RULE_TESTS_SET = new Set([
  'always_true',
  'axis_aligned_linear_pos',
  'linear_pos',
] as const)
