import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type POSITION_SOURCE_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof POSITION_SOURCE_TYPES_SET>>
    | `minecraft:${SetType<typeof POSITION_SOURCE_TYPES_SET>}`)

export const POSITION_SOURCE_TYPES_SET = new Set([
    'block',
    'entity',
] as const)
