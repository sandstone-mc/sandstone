import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTAG_POINT_OF_INTEREST_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONTAG_POINT_OF_INTEREST_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONTAG_POINT_OF_INTEREST_TYPES_SET>}`)

export const JSONTAG_POINT_OF_INTEREST_TYPES_SET = new Set([
  'acquirable_job_site',
  'bee_home',
  'village',
] as const)
