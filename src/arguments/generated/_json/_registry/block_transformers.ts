import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONBLOCK_TRANSFORMERS = (
  | NamespacedLiteralUnion<SetType<typeof JSONBLOCK_TRANSFORMERS_SET>>
  | `minecraft:${SetType<typeof JSONBLOCK_TRANSFORMERS_SET>}`)

export const JSONBLOCK_TRANSFORMERS_SET = new Set([
  'axe',
  'hoe',
  'shovel',
] as const)
