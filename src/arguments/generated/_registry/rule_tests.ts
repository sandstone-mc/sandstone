import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type RULE_TESTS = (
  | NamespacedLiteralUnion<SetType<typeof RULE_TESTS_SET>>
  | `minecraft:${SetType<typeof RULE_TESTS_SET>}`)

export const RULE_TESTS_SET = new Set([
  'always_true',
  'block_match',
  'blockstate_match',
  'random_block_match',
  'random_blockstate_match',
  'tag_match',
] as const)
