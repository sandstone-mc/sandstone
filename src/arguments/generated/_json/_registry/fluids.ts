import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONFLUIDS = (
  | NamespacedLiteralUnion<SetType<typeof JSONFLUIDS_SET>>
  | `minecraft:${SetType<typeof JSONFLUIDS_SET>}`)

export const JSONFLUIDS_SET = new Set([
  'empty',
  'flowing_lava',
  'flowing_water',
  'lava',
  'water',
] as const)
