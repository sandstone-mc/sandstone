import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type INSTRUMENTS = (
    | NamespacedLiteralUnion<SetType<typeof INSTRUMENTS_SET>>
    | `minecraft:${SetType<typeof INSTRUMENTS_SET>}`)

export const INSTRUMENTS_SET = new Set([
    'admire_goat_horn',
    'call_goat_horn',
    'dream_goat_horn',
    'feel_goat_horn',
    'ponder_goat_horn',
    'seek_goat_horn',
    'sing_goat_horn',
    'yearn_goat_horn',
] as const)
