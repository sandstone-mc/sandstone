import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type SULFUR_CUBE_ARCHETYPES = (
  | NamespacedLiteralUnion<SetType<typeof SULFUR_CUBE_ARCHETYPES_SET>>
  | `minecraft:${SetType<typeof SULFUR_CUBE_ARCHETYPES_SET>}`)

export const SULFUR_CUBE_ARCHETYPES_SET = new Set([
  'bouncy',
  'explosive',
  'fast_flat',
  'fast_sliding',
  'high_resistance',
  'hot',
  'light',
  'regular',
  'slow_bouncy',
  'slow_flat',
  'slow_sliding',
  'sticky',
] as const)
