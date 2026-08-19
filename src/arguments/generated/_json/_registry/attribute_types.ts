import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONATTRIBUTE_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONATTRIBUTE_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONATTRIBUTE_TYPES_SET>}`)

export const JSONATTRIBUTE_TYPES_SET = new Set([
  'activity',
  'ambient_particles',
  'ambient_sounds',
  'angle_degrees',
  'argb_color',
  'background_music',
  'bed_rule',
  'boolean',
  'float',
  'integer',
  'mob_spawn_settings',
  'moon_phase',
  'particle',
  'rgb_color',
  'tri_state',
] as const)
