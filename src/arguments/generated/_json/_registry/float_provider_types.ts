import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONFLOAT_PROVIDER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONFLOAT_PROVIDER_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONFLOAT_PROVIDER_TYPES_SET>}`)

export const JSONFLOAT_PROVIDER_TYPES_SET = new Set([
  'clamped_normal',
  'constant',
  'trapezoid',
  'uniform',
] as const)
