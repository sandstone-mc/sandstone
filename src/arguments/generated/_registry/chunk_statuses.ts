import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type CHUNK_STATUSES = (
  | NamespacedLiteralUnion<SetType<typeof CHUNK_STATUSES_SET>>
  | `minecraft:${SetType<typeof CHUNK_STATUSES_SET>}`)

export const CHUNK_STATUSES_SET = new Set([
    'biomes',
    'carvers',
    'empty',
    'features',
    'full',
    'initialize_light',
    'light',
    'noise',
    'spawn',
    'structure_references',
    'structure_starts',
    'surface',
] as const)
