import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONNUMBER_FORMAT_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONNUMBER_FORMAT_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONNUMBER_FORMAT_TYPES_SET>}`)

export const JSONNUMBER_FORMAT_TYPES_SET = new Set([
  'blank',
  'fixed',
  'styled',
] as const)
