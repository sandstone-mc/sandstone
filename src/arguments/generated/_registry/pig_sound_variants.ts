import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type PIG_SOUND_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof PIG_SOUND_VARIANTS_SET>>
  | `minecraft:${SetType<typeof PIG_SOUND_VARIANTS_SET>}`)

export const PIG_SOUND_VARIANTS_SET = new Set([
  'big',
  'classic',
  'mini',
] as const)
