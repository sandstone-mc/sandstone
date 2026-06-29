import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type CAT_SOUND_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof CAT_SOUND_VARIANTS_SET>>
  | `minecraft:${SetType<typeof CAT_SOUND_VARIANTS_SET>}`)

export const CAT_SOUND_VARIANTS_SET = new Set([
  'classic',
  'royal',
] as const)
