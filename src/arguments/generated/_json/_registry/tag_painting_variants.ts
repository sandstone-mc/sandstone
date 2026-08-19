import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTAG_PAINTING_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONTAG_PAINTING_VARIANTS_SET>>
  | `minecraft:${SetType<typeof JSONTAG_PAINTING_VARIANTS_SET>}`)

export const JSONTAG_PAINTING_VARIANTS_SET = new Set([
  'placeable',
] as const)
