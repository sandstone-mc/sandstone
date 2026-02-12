import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLD_CLOCKS = (
  | NamespacedLiteralUnion<SetType<typeof WORLD_CLOCKS_SET>>
  | `minecraft:${SetType<typeof WORLD_CLOCKS_SET>}`)

export const WORLD_CLOCKS_SET = new Set([
  'overworld',
  'the_end',
] as const)
