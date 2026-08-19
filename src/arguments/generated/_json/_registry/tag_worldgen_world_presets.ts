import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTAG_WORLDGEN_WORLD_PRESETS = (
  | NamespacedLiteralUnion<SetType<typeof JSONTAG_WORLDGEN_WORLD_PRESETS_SET>>
  | `minecraft:${SetType<typeof JSONTAG_WORLDGEN_WORLD_PRESETS_SET>}`)

export const JSONTAG_WORLDGEN_WORLD_PRESETS_SET = new Set([
  'extended',
  'normal',
] as const)
