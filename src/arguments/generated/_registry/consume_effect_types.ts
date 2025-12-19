import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type CONSUME_EFFECT_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof CONSUME_EFFECT_TYPES_SET>>
    | `minecraft:${SetType<typeof CONSUME_EFFECT_TYPES_SET>}`)

export const CONSUME_EFFECT_TYPES_SET = new Set([
    'apply_effects',
    'clear_all_effects',
    'play_sound',
    'remove_effects',
    'teleport_randomly',
] as const)
