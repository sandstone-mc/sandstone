import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type FONTS = (NamespacedLiteralUnion<SetType<typeof FONTS_SET>> | `minecraft:${SetType<typeof FONTS_SET>}`)

export const FONTS_SET = new Set([
    'alt',
    'default',
    'illageralt',
    'include/default',
    'include/space',
    'include/unifont',
    'include/unifont_pua',
    'uniform',
] as const)
