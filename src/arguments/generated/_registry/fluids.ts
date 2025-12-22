import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type FLUIDS = (NamespacedLiteralUnion<SetType<typeof FLUIDS_SET>> | `minecraft:${SetType<typeof FLUIDS_SET>}`)

export const FLUIDS_SET = new Set([
  'empty',
  'flowing_lava',
  'flowing_water',
  'lava',
  'water',
] as const)
