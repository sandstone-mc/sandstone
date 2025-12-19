import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type PERMISSION_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof PERMISSION_TYPES_SET>>
    | `minecraft:${SetType<typeof PERMISSION_TYPES_SET>}`)

export const PERMISSION_TYPES_SET = new Set([
    'atom',
    'command_level',
] as const)
