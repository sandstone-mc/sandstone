import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type INPUT_CONTROL_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof INPUT_CONTROL_TYPES_SET>>
  | `minecraft:${SetType<typeof INPUT_CONTROL_TYPES_SET>}`)

export const INPUT_CONTROL_TYPES_SET = new Set([
  'boolean',
  'number_range',
  'single_option',
  'text',
] as const)
