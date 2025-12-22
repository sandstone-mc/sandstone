import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type SLOT_DISPLAIES = (
  | NamespacedLiteralUnion<SetType<typeof SLOT_DISPLAIES_SET>>
  | `minecraft:${SetType<typeof SLOT_DISPLAIES_SET>}`)

export const SLOT_DISPLAIES_SET = new Set([
  'any_fuel',
  'composite',
  'empty',
  'item',
  'item_stack',
  'smithing_trim',
  'tag',
  'with_remainder',
] as const)
