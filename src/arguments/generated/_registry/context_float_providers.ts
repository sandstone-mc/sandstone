import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type CONTEXT_FLOAT_PROVIDERS = (
  | NamespacedLiteralUnion<SetType<typeof CONTEXT_FLOAT_PROVIDERS_SET>>
  | `minecraft:${SetType<typeof CONTEXT_FLOAT_PROVIDERS_SET>}`)

export const CONTEXT_FLOAT_PROVIDERS_SET = new Set([
  'brewing/speed_default',
  'cooking/fast_speed_multiplier',
  'cooking/normal_speed_multiplier',
  'cooking/speed_default',
] as const)
