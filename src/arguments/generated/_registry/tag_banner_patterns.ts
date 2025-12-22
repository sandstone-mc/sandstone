import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TAG_BANNER_PATTERNS = (
  | NamespacedLiteralUnion<SetType<typeof TAG_BANNER_PATTERNS_SET>>
  | `minecraft:${SetType<typeof TAG_BANNER_PATTERNS_SET>}`)

export const TAG_BANNER_PATTERNS_SET = new Set([
  'no_item_required',
  'pattern_item/bordure_indented',
  'pattern_item/creeper',
  'pattern_item/field_masoned',
  'pattern_item/flow',
  'pattern_item/flower',
  'pattern_item/globe',
  'pattern_item/guster',
  'pattern_item/mojang',
  'pattern_item/piglin',
  'pattern_item/skull',
] as const)
