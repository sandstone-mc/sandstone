import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_POOL_ALIAS_BINDINGS = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_POOL_ALIAS_BINDINGS_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_POOL_ALIAS_BINDINGS_SET>}`)

export const JSONWORLDGEN_POOL_ALIAS_BINDINGS_SET = new Set([
  'direct',
  'random',
  'random_group',
] as const)
