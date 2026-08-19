import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_CARVERS = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_CARVERS_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_CARVERS_SET>}`)

export const JSONWORLDGEN_CARVERS_SET = new Set([
  'canyon',
  'cave',
  'cave_extra_underground',
  'nether_cave',
] as const)
