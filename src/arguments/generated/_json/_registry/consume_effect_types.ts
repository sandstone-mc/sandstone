import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONCONSUME_EFFECT_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONCONSUME_EFFECT_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONCONSUME_EFFECT_TYPES_SET>}`)

export const JSONCONSUME_EFFECT_TYPES_SET = new Set([
  'apply_effects',
  'clear_all_effects',
  'play_sound',
  'remove_effects',
  'teleport_randomly',
] as const)
