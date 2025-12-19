import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TAG_FLUIDS = (
  | NamespacedLiteralUnion<SetType<typeof TAG_FLUIDS_SET>>
  | `minecraft:${SetType<typeof TAG_FLUIDS_SET>}`)

export const TAG_FLUIDS_SET = new Set([
    'lava',
    'water',
] as const)
