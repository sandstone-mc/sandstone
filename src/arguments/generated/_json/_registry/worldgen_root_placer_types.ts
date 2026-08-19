import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_ROOT_PLACER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_ROOT_PLACER_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_ROOT_PLACER_TYPES_SET>}`)

export const JSONWORLDGEN_ROOT_PLACER_TYPES_SET = new Set([
  'mangrove_root_placer',
] as const)
