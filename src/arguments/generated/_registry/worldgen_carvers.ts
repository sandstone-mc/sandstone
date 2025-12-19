import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_CARVERS = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_CARVERS_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_CARVERS_SET>}`)

export const WORLDGEN_CARVERS_SET = new Set([
    'canyon',
    'cave',
    'nether_cave',
] as const)
