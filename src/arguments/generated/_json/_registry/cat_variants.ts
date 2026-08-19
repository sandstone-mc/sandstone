import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONCAT_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONCAT_VARIANTS_SET>>
  | `minecraft:${SetType<typeof JSONCAT_VARIANTS_SET>}`)

export const JSONCAT_VARIANTS_SET = new Set([
  'all_black',
  'black',
  'british_shorthair',
  'calico',
  'jellie',
  'persian',
  'ragdoll',
  'red',
  'siamese',
  'tabby',
  'white',
] as const)
