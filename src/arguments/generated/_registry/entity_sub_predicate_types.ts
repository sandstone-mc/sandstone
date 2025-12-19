import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type ENTITY_SUB_PREDICATE_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof ENTITY_SUB_PREDICATE_TYPES_SET>>
    | `minecraft:${SetType<typeof ENTITY_SUB_PREDICATE_TYPES_SET>}`)

export const ENTITY_SUB_PREDICATE_TYPES_SET = new Set([
    'fishing_hook',
    'lightning',
    'player',
    'raider',
    'sheep',
    'slime',
] as const)
