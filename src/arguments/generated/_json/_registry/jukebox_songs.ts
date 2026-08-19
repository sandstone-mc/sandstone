import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONJUKEBOX_SONGS = (
  | NamespacedLiteralUnion<SetType<typeof JSONJUKEBOX_SONGS_SET>>
  | `minecraft:${SetType<typeof JSONJUKEBOX_SONGS_SET>}`)

export const JSONJUKEBOX_SONGS_SET = new Set([
  '11',
  '13',
  '5',
  'blocks',
  'bounce',
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
