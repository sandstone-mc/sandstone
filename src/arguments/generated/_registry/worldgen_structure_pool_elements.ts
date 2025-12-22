import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_STRUCTURE_POOL_ELEMENTS = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_STRUCTURE_POOL_ELEMENTS_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_STRUCTURE_POOL_ELEMENTS_SET>}`)

export const WORLDGEN_STRUCTURE_POOL_ELEMENTS_SET = new Set([
  'empty_pool_element',
  'feature_pool_element',
  'legacy_single_pool_element',
  'list_pool_element',
  'single_pool_element',
] as const)
