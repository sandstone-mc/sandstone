import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONPIG_SOUND_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONPIG_SOUND_VARIANTS_SET>>
  | `minecraft:${SetType<typeof JSONPIG_SOUND_VARIANTS_SET>}`)

export const JSONPIG_SOUND_VARIANTS_SET = new Set([
  'big',
  'classic',
  'mini',
] as const)
