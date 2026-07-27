import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type CHICKEN_SOUND_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof CHICKEN_SOUND_VARIANTS_SET>>
  | `minecraft:${SetType<typeof CHICKEN_SOUND_VARIANTS_SET>}`)

export const CHICKEN_SOUND_VARIANTS_SET = new Set([
  'classic',
  'picky',
] as const)
