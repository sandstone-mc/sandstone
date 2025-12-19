import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type CREATIVE_MODE_TABS = (
    | NamespacedLiteralUnion<SetType<typeof CREATIVE_MODE_TABS_SET>>
    | `minecraft:${SetType<typeof CREATIVE_MODE_TABS_SET>}`)

export const CREATIVE_MODE_TABS_SET = new Set([
    'building_blocks',
    'colored_blocks',
    'combat',
    'food_and_drinks',
    'functional_blocks',
    'hotbar',
    'ingredients',
    'inventory',
    'natural_blocks',
    'op_blocks',
    'redstone_blocks',
    'search',
    'spawn_eggs',
    'tools_and_utilities',
] as const)
