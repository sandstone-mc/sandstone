import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TIMELINES = (
  | NamespacedLiteralUnion<SetType<typeof TIMELINES_SET>>
  | `minecraft:${SetType<typeof TIMELINES_SET>}`)

export const TIMELINES_SET = new Set([
    'day',
    'early_game',
    'moon',
    'villager_schedule',
] as const)
