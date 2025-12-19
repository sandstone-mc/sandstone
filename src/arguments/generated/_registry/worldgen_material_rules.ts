import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_MATERIAL_RULES = (
    | NamespacedLiteralUnion<SetType<typeof WORLDGEN_MATERIAL_RULES_SET>>
    | `minecraft:${SetType<typeof WORLDGEN_MATERIAL_RULES_SET>}`)

export const WORLDGEN_MATERIAL_RULES_SET = new Set([
    'bandlands',
    'block',
    'condition',
    'sequence',
] as const)
