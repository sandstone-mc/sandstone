import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWOLF_SOUND_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONWOLF_SOUND_VARIANTS_SET>>
  | `minecraft:${SetType<typeof JSONWOLF_SOUND_VARIANTS_SET>}`)

export const JSONWOLF_SOUND_VARIANTS_SET = new Set([
  'angry',
  'big',
  'classic',
  'cute',
  'grumpy',
  'puglin',
  'sad',
] as const)
