import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_CHUNK_GENERATORS = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_CHUNK_GENERATORS_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_CHUNK_GENERATORS_SET>}`)

export const WORLDGEN_CHUNK_GENERATORS_SET = new Set([
  'debug',
  'flat',
  'noise',
] as const)
