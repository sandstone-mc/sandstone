import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type TRIM_MATERIALS = (
    | NamespacedLiteralUnion<SetType<typeof TRIM_MATERIALS_SET>>
    | `minecraft:${SetType<typeof TRIM_MATERIALS_SET>}`)

export const TRIM_MATERIALS_SET = new Set([
    'amethyst',
    'copper',
    'diamond',
    'emerald',
    'gold',
    'iron',
    'lapis',
    'netherite',
    'quartz',
    'redstone',
    'resin',
] as const)
