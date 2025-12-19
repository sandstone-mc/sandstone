import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type PERMISSION_CHECK_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof PERMISSION_CHECK_TYPES_SET>>
    | `minecraft:${SetType<typeof PERMISSION_CHECK_TYPES_SET>}`)

export const PERMISSION_CHECK_TYPES_SET = new Set([
    'always_pass',
    'require',
] as const)
