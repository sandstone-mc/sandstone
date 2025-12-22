import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TEST_FUNCTIONS = (
  | NamespacedLiteralUnion<SetType<typeof TEST_FUNCTIONS_SET>>
  | `minecraft:${SetType<typeof TEST_FUNCTIONS_SET>}`)

export const TEST_FUNCTIONS_SET = new Set([
  'always_pass',
] as const)
