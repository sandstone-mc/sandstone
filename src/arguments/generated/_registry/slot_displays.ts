import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type SLOT_DISPLAYS = (
  | NamespacedLiteralUnion<SetType<typeof SLOT_DISPLAYS_SET>>
  | `minecraft:${SetType<typeof SLOT_DISPLAYS_SET>}`)

export const SLOT_DISPLAYS_SET = new Set([
  'any_fuel',
  'composite',
  'dyed',
  'empty',
  'item',
  'item_stack',
  'only_with_component',
  'smithing_trim',
  'tag',
  'with_any_potion',
  'with_remainder',
] as const)
