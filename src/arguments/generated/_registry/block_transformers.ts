import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type BLOCK_TRANSFORMERS = (
  | NamespacedLiteralUnion<SetType<typeof BLOCK_TRANSFORMERS_SET>>
  | `minecraft:${SetType<typeof BLOCK_TRANSFORMERS_SET>}`)

export const BLOCK_TRANSFORMERS_SET = new Set([
  'axe',
  'hoe',
  'shovel',
] as const)
