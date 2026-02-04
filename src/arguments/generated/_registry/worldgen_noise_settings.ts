import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_NOISE_SETTINGS = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_NOISE_SETTINGS_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_NOISE_SETTINGS_SET>}`)

export const WORLDGEN_NOISE_SETTINGS_SET = new Set([
  'amplified',
  'caves',
  'end',
  'floating_islands',
  'large_biomes',
  'nether',
  'overworld',
] as const)
