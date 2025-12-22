import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TAG_PAINTING_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof TAG_PAINTING_VARIANTS_SET>>
  | `minecraft:${SetType<typeof TAG_PAINTING_VARIANTS_SET>}`)

export const TAG_PAINTING_VARIANTS_SET = new Set([
  'placeable',
] as const)
