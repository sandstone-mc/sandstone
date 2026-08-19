import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONDIMENSION_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONDIMENSION_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONDIMENSION_TYPES_SET>}`)

export const JSONDIMENSION_TYPES_SET = new Set([
  'overworld',
  'overworld_caves',
  'the_end',
  'the_nether',
] as const)
