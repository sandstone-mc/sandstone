import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTAG_POTIONS = (
  | NamespacedLiteralUnion<SetType<typeof JSONTAG_POTIONS_SET>>
  | `minecraft:${SetType<typeof JSONTAG_POTIONS_SET>}`)

export const JSONTAG_POTIONS_SET = new Set([
  'douses_fire',
  'extinguishes_entities',
  'hurts_water_sensitive_entities',
  'rehydrates_axolotls',
  'tradeable',
] as const)
