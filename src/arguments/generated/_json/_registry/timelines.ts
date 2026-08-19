import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONTIMELINES = (
  | NamespacedLiteralUnion<SetType<typeof JSONTIMELINES_SET>>
  | `minecraft:${SetType<typeof JSONTIMELINES_SET>}`)

export const JSONTIMELINES_SET = new Set([
  'day',
  'early_game',
  'moon',
  'villager_schedule',
] as const)
