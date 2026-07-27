import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type COW_SOUND_VARIANTS = (
  | NamespacedLiteralUnion<SetType<typeof COW_SOUND_VARIANTS_SET>>
  | `minecraft:${SetType<typeof COW_SOUND_VARIANTS_SET>}`)

export const COW_SOUND_VARIANTS_SET = new Set([
  'classic',
  'moody',
] as const)
