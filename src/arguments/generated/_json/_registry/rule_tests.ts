import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONRULE_TESTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONRULE_TESTS_SET>>
  | `minecraft:${SetType<typeof JSONRULE_TESTS_SET>}`)

export const JSONRULE_TESTS_SET = new Set([
  'all_of',
  'always_true',
  'any_of',
  'block_match',
  'blockstate_match',
  'height_match',
  'not',
  'random_block_match',
  'random_blockstate_match',
  'tag_match',
] as const)
