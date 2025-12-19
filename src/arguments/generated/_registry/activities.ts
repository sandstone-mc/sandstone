import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type ACTIVITIES = (
    | NamespacedLiteralUnion<SetType<typeof ACTIVITIES_SET>>
    | `minecraft:${SetType<typeof ACTIVITIES_SET>}`)

export const ACTIVITIES_SET = new Set([
    'admire_item',
    'avoid',
    'celebrate',
    'core',
    'dig',
    'emerge',
    'fight',
    'hide',
    'idle',
    'investigate',
    'lay_spawn',
    'long_jump',
    'meet',
    'panic',
    'play',
    'play_dead',
    'pre_raid',
    'raid',
    'ram',
    'rest',
    'ride',
    'roar',
    'sniff',
    'swim',
    'tongue',
    'work',
] as const)
