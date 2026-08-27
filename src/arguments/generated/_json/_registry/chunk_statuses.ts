import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONCHUNK_STATUSES = (
  | NamespacedLiteralUnion<SetType<typeof JSONCHUNK_STATUSES_SET>>
  | `minecraft:${SetType<typeof JSONCHUNK_STATUSES_SET>}`)

export const JSONCHUNK_STATUSES_SET = new Set([
  'biomes',
  'empty',
  'features',
  'full',
  'initialize_light',
  'light',
  'spawn',
  'structure_references',
  'structure_starts',
  'terrain',
] as const)
