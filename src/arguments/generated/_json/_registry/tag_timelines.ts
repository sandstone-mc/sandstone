import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTAG_TIMELINES = (
  | NamespacedLiteralUnion<SetType<typeof JSONTAG_TIMELINES_SET>>
  | `minecraft:${SetType<typeof JSONTAG_TIMELINES_SET>}`)

export const JSONTAG_TIMELINES_SET = new Set([
  'in_end',
  'in_nether',
  'in_overworld',
  'universal',
] as const)
