import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONPOST_EFFECTS = (
  | NamespacedLiteralUnion<SetType<typeof JSONPOST_EFFECTS_SET>>
  | `minecraft:${SetType<typeof JSONPOST_EFFECTS_SET>}`)

export const JSONPOST_EFFECTS_SET = new Set([
  'blur',
  'creeper',
  'entity_outline',
  'invert',
  'spider',
] as const)
