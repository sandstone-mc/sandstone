import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONCOW_SOUND_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONCOW_SOUND_VARIANTS_SET>>
  | `minecraft:${SetType<typeof JSONCOW_SOUND_VARIANTS_SET>}`)

export const JSONCOW_SOUND_VARIANTS_SET = new Set([
  'classic',
  'moody',
] as const)
