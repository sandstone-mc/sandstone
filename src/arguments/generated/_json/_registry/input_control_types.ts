import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONINPUT_CONTROL_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONINPUT_CONTROL_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONINPUT_CONTROL_TYPES_SET>}`)

export const JSONINPUT_CONTROL_TYPES_SET = new Set([
  'boolean',
  'number_range',
  'single_option',
  'text',
] as const)
