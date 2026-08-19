import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLD_CLOCKS = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLD_CLOCKS_SET>>
  | `minecraft:${SetType<typeof JSONWORLD_CLOCKS_SET>}`)

export const JSONWORLD_CLOCKS_SET = new Set([
  'overworld',
  'the_end',
] as const)
