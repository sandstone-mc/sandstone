import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONCAT_SOUND_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONCAT_SOUND_VARIANTS_SET>>
  | `minecraft:${SetType<typeof JSONCAT_SOUND_VARIANTS_SET>}`)

export const JSONCAT_SOUND_VARIANTS_SET = new Set([
  'classic',
  'royal',
] as const)
