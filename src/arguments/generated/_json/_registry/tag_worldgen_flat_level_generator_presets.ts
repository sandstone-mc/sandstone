import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTAG_WORLDGEN_FLAT_LEVEL_GENERATOR_PRESETS = (
  | NamespacedLiteralUnion<SetType<typeof JSONTAG_WORLDGEN_FLAT_LEVEL_GENERATOR_PRESETS_SET>>
  | `minecraft:${SetType<typeof JSONTAG_WORLDGEN_FLAT_LEVEL_GENERATOR_PRESETS_SET>}`)

export const JSONTAG_WORLDGEN_FLAT_LEVEL_GENERATOR_PRESETS_SET = new Set([
  'visible',
] as const)
