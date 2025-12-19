import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type DIMENSIONS = (
    | NamespacedLiteralUnion<SetType<typeof DIMENSIONS_SET>>
    | `minecraft:${SetType<typeof DIMENSIONS_SET>}`)

export const DIMENSIONS_SET = new Set([
    'overworld',
    'the_end',
    'the_nether',
] as const)
