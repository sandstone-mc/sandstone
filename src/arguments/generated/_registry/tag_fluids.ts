import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TAG_FLUIDS = (
  | NamespacedLiteralUnion<SetType<typeof TAG_FLUIDS_SET>>
  | `minecraft:${SetType<typeof TAG_FLUIDS_SET>}`)

export const TAG_FLUIDS_SET = new Set([
  'axolotl_tries_to_find',
  'bubble_column_can_occupy',
  'dolphin_tries_to_find',
  'entity_floatable',
  'frog_tries_to_find_land_near',
  'lava',
  'supports_frogspawn',
  'supports_lily_pad',
  'supports_sugar_cane_adjacently',
  'water',
] as const)
