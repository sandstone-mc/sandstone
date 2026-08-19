import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONSLOT_DISPLAYS = (
  | NamespacedLiteralUnion<SetType<typeof JSONSLOT_DISPLAYS_SET>>
  | `minecraft:${SetType<typeof JSONSLOT_DISPLAYS_SET>}`)

export const JSONSLOT_DISPLAYS_SET = new Set([
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
