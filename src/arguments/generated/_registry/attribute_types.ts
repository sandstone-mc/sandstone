import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type ATTRIBUTE_TYPES = (
    | NamespacedLiteralUnion<SetType<typeof ATTRIBUTE_TYPES_SET>>
    | `minecraft:${SetType<typeof ATTRIBUTE_TYPES_SET>}`)

export const ATTRIBUTE_TYPES_SET = new Set([
    'activity',
    'ambient_particles',
    'ambient_sounds',
    'angle_degrees',
    'argb_color',
    'background_music',
    'bed_rule',
    'boolean',
    'float',
    'moon_phase',
    'particle',
    'rgb_color',
    'tri_state',
] as const)
