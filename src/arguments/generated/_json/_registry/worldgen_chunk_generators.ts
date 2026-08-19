import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_CHUNK_GENERATORS = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_CHUNK_GENERATORS_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_CHUNK_GENERATORS_SET>}`)

export const JSONWORLDGEN_CHUNK_GENERATORS_SET = new Set([
  'debug',
  'flat',
  'noise',
] as const)
