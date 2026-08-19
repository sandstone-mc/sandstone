import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONFONTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONFONTS_SET>>
  | `minecraft:${SetType<typeof JSONFONTS_SET>}`)

export const JSONFONTS_SET = new Set([
  'alt',
  'default',
  'illageralt',
  'include/default',
  'include/space',
  'include/unifont',
  'include/unifont_pua',
  'uniform',
] as const)
