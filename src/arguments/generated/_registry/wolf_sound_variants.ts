import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WOLF_SOUND_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof WOLF_SOUND_VARIANTS_SET>>
  | `minecraft:${SetType<typeof WOLF_SOUND_VARIANTS_SET>}`)

export const WOLF_SOUND_VARIANTS_SET = new Set([
  'angry',
  'big',
  'classic',
  'cute',
  'grumpy',
  'puglin',
  'sad',
] as const)
