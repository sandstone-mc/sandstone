import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type NUMBER_FORMAT_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof NUMBER_FORMAT_TYPES_SET>>
    | `minecraft:${SetType<typeof NUMBER_FORMAT_TYPES_SET>}`)

export const NUMBER_FORMAT_TYPES_SET = new Set([
    'blank',
    'fixed',
    'styled',
] as const)
