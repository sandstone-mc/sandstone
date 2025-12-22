import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type WORLDGEN_DENSITY_FUNCTION_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof WORLDGEN_DENSITY_FUNCTION_TYPES_SET>>
  | `minecraft:${SetType<typeof WORLDGEN_DENSITY_FUNCTION_TYPES_SET>}`)

export const WORLDGEN_DENSITY_FUNCTION_TYPES_SET = new Set([
  'abs',
  'add',
  'beardifier',
  'blend_alpha',
  'blend_density',
  'blend_offset',
  'cache_2d',
  'cache_all_in_cell',
  'cache_once',
  'clamp',
  'constant',
  'cube',
  'end_islands',
  'find_top_surface',
  'flat_cache',
  'half_negative',
  'interpolated',
  'invert',
  'max',
  'min',
  'mul',
  'noise',
  'old_blended_noise',
  'quarter_negative',
  'range_choice',
  'shift',
  'shift_a',
  'shift_b',
  'shifted_noise',
  'spline',
  'square',
  'squeeze',
  'weird_scaled_sampler',
  'y_clamped_gradient',
] as const)
