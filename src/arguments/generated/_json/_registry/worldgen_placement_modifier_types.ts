import { Set } from 'sandstone'
import type { NamespacedLiteralUnion, SetType } from 'sandstone'

export type JSONWORLDGEN_PLACEMENT_MODIFIER_TYPES = (
  | NamespacedLiteralUnion<SetType<typeof JSONWORLDGEN_PLACEMENT_MODIFIER_TYPES_SET>>
  | `minecraft:${SetType<typeof JSONWORLDGEN_PLACEMENT_MODIFIER_TYPES_SET>}`)

export const JSONWORLDGEN_PLACEMENT_MODIFIER_TYPES_SET = new Set([
  'biome',
  'block_predicate_filter',
  'count',
  'count_on_every_layer',
  'cuboid',
  'environment_scan',
  'fixed_placement',
  'height_range',
  'heightmap',
  'in_square',
  'noise_based_count',
  'noise_threshold_count',
  'offset',
  'random_chance',
  'rarity_filter',
  'surface_relative_threshold_filter',
  'surface_water_depth_filter',
] as const)
