import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type POST_EFFECTS = (
  | NamespacedLiteralUnion<SetType<typeof POST_EFFECTS_SET>>
  | `minecraft:${SetType<typeof POST_EFFECTS_SET>}`)

export const POST_EFFECTS_SET = new Set([
    'blur',
    'creeper',
    'entity_outline',
    'invert',
    'spider',
    'transparency',
] as const)
