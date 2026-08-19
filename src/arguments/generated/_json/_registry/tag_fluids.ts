import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTAG_FLUIDS = (
  | NamespacedLiteralUnion<SetType<typeof JSONTAG_FLUIDS_SET>>
  | `minecraft:${SetType<typeof JSONTAG_FLUIDS_SET>}`)

export const JSONTAG_FLUIDS_SET = new Set([
  'bubble_column_can_occupy',
  'lava',
  'supports_frogspawn',
  'supports_lily_pad',
  'supports_sugar_cane_adjacently',
  'water',
] as const)
