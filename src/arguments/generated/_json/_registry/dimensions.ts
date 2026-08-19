import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONDIMENSIONS = (
  | NamespacedLiteralUnion<SetType<typeof JSONDIMENSIONS_SET>>
  | `minecraft:${SetType<typeof JSONDIMENSIONS_SET>}`)

export const JSONDIMENSIONS_SET = new Set([
  'overworld',
  'the_end',
  'the_nether',
] as const)
