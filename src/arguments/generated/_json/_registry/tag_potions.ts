import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTAG_POTIONS = (
  | NamespacedLiteralUnion<SetType<typeof JSONTAG_POTIONS_SET>>
  | `minecraft:${SetType<typeof JSONTAG_POTIONS_SET>}`)

export const JSONTAG_POTIONS_SET = new Set([
  'tradeable',
] as const)
