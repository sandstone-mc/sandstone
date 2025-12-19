import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TAG_TIMELINES = (
    | NamespacedLiteralUnion<SetType<typeof TAG_TIMELINES_SET>>
    | `minecraft:${SetType<typeof TAG_TIMELINES_SET>}`)

export const TAG_TIMELINES_SET = new Set([
    'in_end',
    'in_nether',
    'in_overworld',
    'universal',
] as const)
