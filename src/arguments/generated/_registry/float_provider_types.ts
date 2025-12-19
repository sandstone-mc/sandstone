import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type FLOAT_PROVIDER_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof FLOAT_PROVIDER_TYPES_SET>>
    | `minecraft:${SetType<typeof FLOAT_PROVIDER_TYPES_SET>}`)

export const FLOAT_PROVIDER_TYPES_SET = new Set([
    'clamped_normal',
    'constant',
    'trapezoid',
    'uniform',
] as const)
