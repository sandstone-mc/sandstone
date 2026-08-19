import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONPERMISSION_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONPERMISSION_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONPERMISSION_TYPES_SET>}`)

export const JSONPERMISSION_TYPES_SET = new Set([
  'atom',
  'command_level',
] as const)
