import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TAG_INSTRUMENTS = (
    | NamespacedLiteralUnion<SetType<typeof TAG_INSTRUMENTS_SET>>
    | `minecraft:${SetType<typeof TAG_INSTRUMENTS_SET>}`)

export const TAG_INSTRUMENTS_SET = new Set([
    'goat_horns',
    'regular_goat_horns',
    'screaming_goat_horns',
] as const)
