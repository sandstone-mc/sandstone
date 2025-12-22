import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_STRUCTURE_PLACEMENTS = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_STRUCTURE_PLACEMENTS_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_STRUCTURE_PLACEMENTS_SET>}`)

export const WORLDGEN_STRUCTURE_PLACEMENTS_SET = new Set([
  'concentric_rings',
  'random_spread',
] as const)
