import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTAG_INSTRUMENTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONTAG_INSTRUMENTS_SET>>
  | `minecraft:${SetType<typeof JSONTAG_INSTRUMENTS_SET>}`)

export const JSONTAG_INSTRUMENTS_SET = new Set([
  'goat_horns',
  'regular_goat_horns',
  'screaming_goat_horns',
] as const)
