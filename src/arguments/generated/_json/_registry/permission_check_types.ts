import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONPERMISSION_CHECK_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONPERMISSION_CHECK_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONPERMISSION_CHECK_TYPES_SET>}`)

export const JSONPERMISSION_CHECK_TYPES_SET = new Set([
  'always_pass',
  'require',
] as const)
