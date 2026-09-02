import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONCONTEXT_FLOAT_PROVIDERS = (
  | NamespacedLiteralUnion<SetType<typeof JSONCONTEXT_FLOAT_PROVIDERS_SET>>
  | `minecraft:${SetType<typeof JSONCONTEXT_FLOAT_PROVIDERS_SET>}`)

export const JSONCONTEXT_FLOAT_PROVIDERS_SET = new Set([
  'brewing/speed_default',
  'cooking/fast_speed_multiplier',
  'cooking/normal_speed_multiplier',
  'cooking/speed_default',
] as const)
