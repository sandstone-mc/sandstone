import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type POS_RULE_TESTS = (
  | NamespacedLiteralUnion<SetType<typeof POS_RULE_TESTS_SET>>
  | `minecraft:${SetType<typeof POS_RULE_TESTS_SET>}`)

export const POS_RULE_TESTS_SET = new Set([
  'always_true',
  'axis_aligned_linear_pos',
  'linear_pos',
] as const)
