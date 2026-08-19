import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONCHICKEN_SOUND_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONCHICKEN_SOUND_VARIANTS_SET>>
  | `minecraft:${SetType<typeof JSONCHICKEN_SOUND_VARIANTS_SET>}`)

export const JSONCHICKEN_SOUND_VARIANTS_SET = new Set([
  'classic',
  'picky',
] as const)
