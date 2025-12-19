import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JUKEBOX_SONGS = (
  | NamespacedLiteralUnion<SetType<typeof JUKEBOX_SONGS_SET>>
  | `minecraft:${SetType<typeof JUKEBOX_SONGS_SET>}`)

export const JUKEBOX_SONGS_SET = new Set([
    '11',
    '13',
    '5',
    'blocks',
    'cat',
    'chirp',
    'creator',
    'creator_music_box',
    'far',
    'lava_chicken',
    'mall',
    'mellohi',
    'otherside',
    'pigstep',
    'precipice',
    'relic',
    'stal',
    'strad',
    'tears',
    'wait',
    'ward',
] as const)
