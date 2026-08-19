import type { JsonBlockPredicate } from 'sandstone/arguments/generated/_json/data/worldgen/feature/block_predicate.ts'
import type { JsonConfiguredFeatureRef } from 'sandstone/arguments/generated/_json/data/worldgen/feature.ts'
import type {
  JsonCarveStep,
  JsonHeightmapType,
  JsonHeightProvider,
  JsonIntProvider,
} from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonVerticalDirection } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NBTFloat, NBTInt, TagClass } from 'sandstone'

export type JsonBlockPredicateFilter = {
  predicate: JsonBlockPredicate,
}

export type JsonCarvingMaskModifier = {
  /**
   * Value:
   *
   *  - Air(`air`)
   *  - Liquid(`liquid`)
   */
  step: JsonCarveStep,
}

export type JsonCountModifier = {
  count: JsonIntProvider<(NBTInt<{
    min: 0,
  }> | number)>,
}

export type JsonCountOnEveryLayerModifier = {
  count: JsonIntProvider<(NBTInt<{
    min: 0,
  }> | number)>,
}

export type JsonCuboidModifier = {
  xz_size: JsonIntProvider<(NBTInt<{
    min: 1,
    max: 16,
  }> | number)>,
  y_size: JsonIntProvider<(NBTInt<{
    min: 1,
    max: 16,
  }> | number)>,
  /**
   * Defaults to `true`.
   */
  include_interior?: boolean,
  /**
   * Defaults to `true`.
   */
  include_edges?: boolean,
}

export type JsonEnvironmentScanModifier = {
  /**
   * Value:
   *
   *  - Down(`down`)
   *  - Up(`up`)
   */
  direction_of_search: JsonVerticalDirection,
  /**
   * Value:
   * Range: 1..32
   */
  max_steps: (NBTInt<{
    min: 1,
    max: 32,
  }> | number),
  target_condition: JsonBlockPredicate,
  allowed_search_condition?: JsonBlockPredicate,
}

export type JsonFixedPlacementModifier = {
  /**
   * Fixed list of block positions to place the feature at.
   */
  positions: Array<JsonNBTList<(NBTInt | number), {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>>,
}

export type JsonHeightmapModifier = {
  /**
   * Value:
   *
   *  - MotionBlocking(`MOTION_BLOCKING`)
   *  - MotionBlockingNoLeaves(`MOTION_BLOCKING_NO_LEAVES`)
   *  - OceanFloor(`OCEAN_FLOOR`)
   *  - OceanFloorWorldgen(`OCEAN_FLOOR_WG`)
   *  - WorldSurface(`WORLD_SURFACE`)
   *  - WorldSurfaceWorldgen(`WORLD_SURFACE_WG`)
   */
  heightmap: JsonHeightmapType,
}

export type JsonHeightRangeModifier = {
  height: JsonHeightProvider,
}

export type JsonNoiseBasedCountModifier = {
  noise_to_count_ratio: (NBTInt | number),
  noise_factor: (NBTFloat | number),
  noise_offset?: (NBTFloat | number),
}

export type JsonNoiseThresholdCountModifier = {
  noise_level: (NBTFloat | number),
  below_noise: (NBTInt | number),
  above_noise: (NBTInt | number),
}

export type JsonOffsetModifier = {
  x: JsonIntProvider<(NBTInt<{
    min: -16,
    max: 16,
  }> | number)>,
  y: JsonIntProvider<(NBTInt<{
    min: -16,
    max: 16,
  }> | number)>,
  z: JsonIntProvider<(NBTInt<{
    min: -16,
    max: 16,
  }> | number)>,
}

export type JsonPlacedFeature = {
  feature: JsonConfiguredFeatureRef,
  placement: Array<JsonPlacementModifier>,
}

/**
 * *either*
 *
 * *item 0*
 *
 * *or*
 *
 * *item 1*
 *
 * *or*
 *
 * List length range: 1..
 */
export type JsonPlacedFeatureListRef = (JsonPlacedFeature | (
  | JsonRegistry['minecraft:worldgen/placed_feature']
  | `#${string}:${string}`
  | TagClass<'worldgen/placed_feature'>) | JsonNBTList<(
    | JsonRegistry['minecraft:worldgen/placed_feature']
    | JsonPlacedFeature), {
    leftExclusive: false,
    min: 1,
  }>)

export type JsonPlacedFeatureRef = (JsonPlacedFeature | JsonRegistry['minecraft:worldgen/placed_feature'])

export type JsonPlacementModifier = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/placement_modifier_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolPlacementModifier ? JsonSymbolPlacementModifier[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/placement_modifier_type'], string>])>

export type JsonRandomChanceModifier = {
  /**
   * Value:
   * Range: 0..1
   */
  chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonRandomlySelectedModifier = {
  /**
   * Value:
   * List length range: 1..
   */
  placements: JsonNBTList<JsonPlacementModifier, {
    leftExclusive: false,
    min: 1,
  }>,
}

export type JsonRandomOffsetModifier = {
  xz_spread: JsonIntProvider<(NBTInt<{
    min: -16,
    max: 16,
  }> | number)>,
  y_spread: JsonIntProvider<(NBTInt<{
    min: -16,
    max: 16,
  }> | number)>,
}

export type JsonRarityFilter = {
  /**
   * Value:
   * Range: 0..
   */
  chance: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonSurfaceRelativeThresholdFilter = {
  /**
   * Value:
   *
   *  - MotionBlocking(`MOTION_BLOCKING`)
   *  - MotionBlockingNoLeaves(`MOTION_BLOCKING_NO_LEAVES`)
   *  - OceanFloor(`OCEAN_FLOOR`)
   *  - OceanFloorWorldgen(`OCEAN_FLOOR_WG`)
   *  - WorldSurface(`WORLD_SURFACE`)
   *  - WorldSurfaceWorldgen(`WORLD_SURFACE_WG`)
   */
  heightmap: JsonHeightmapType,
  min_inclusive?: (NBTInt | number),
  max_inclusive?: (NBTInt | number),
}

export type JsonSurfaceWaterDepthFilter = {
  max_water_depth: (NBTInt | number),
}
type JsonPlacementModifierDispatcherMap = {
  'block_predicate_filter': JsonPlacementModifierBlockPredicateFilter,
  'minecraft:block_predicate_filter': JsonPlacementModifierBlockPredicateFilter,
  'count': JsonPlacementModifierCount,
  'minecraft:count': JsonPlacementModifierCount,
  'count_on_every_layer': JsonPlacementModifierCountOnEveryLayer,
  'minecraft:count_on_every_layer': JsonPlacementModifierCountOnEveryLayer,
  'cuboid': JsonPlacementModifierCuboid,
  'minecraft:cuboid': JsonPlacementModifierCuboid,
  'environment_scan': JsonPlacementModifierEnvironmentScan,
  'minecraft:environment_scan': JsonPlacementModifierEnvironmentScan,
  'fixed_placement': JsonPlacementModifierFixedPlacement,
  'minecraft:fixed_placement': JsonPlacementModifierFixedPlacement,
  'height_range': JsonPlacementModifierHeightRange,
  'minecraft:height_range': JsonPlacementModifierHeightRange,
  'heightmap': JsonPlacementModifierHeightmap,
  'minecraft:heightmap': JsonPlacementModifierHeightmap,
  'noise_based_count': JsonPlacementModifierNoiseBasedCount,
  'minecraft:noise_based_count': JsonPlacementModifierNoiseBasedCount,
  'noise_threshold_count': JsonPlacementModifierNoiseThresholdCount,
  'minecraft:noise_threshold_count': JsonPlacementModifierNoiseThresholdCount,
  'offset': JsonPlacementModifierOffset,
  'minecraft:offset': JsonPlacementModifierOffset,
  'random_chance': JsonPlacementModifierRandomChance,
  'minecraft:random_chance': JsonPlacementModifierRandomChance,
  'randomly_selected': JsonPlacementModifierRandomlySelected,
  'minecraft:randomly_selected': JsonPlacementModifierRandomlySelected,
  'rarity_filter': JsonPlacementModifierRarityFilter,
  'minecraft:rarity_filter': JsonPlacementModifierRarityFilter,
  'surface_relative_threshold_filter': JsonPlacementModifierSurfaceRelativeThresholdFilter,
  'minecraft:surface_relative_threshold_filter': JsonPlacementModifierSurfaceRelativeThresholdFilter,
  'surface_water_depth_filter': JsonPlacementModifierSurfaceWaterDepthFilter,
  'minecraft:surface_water_depth_filter': JsonPlacementModifierSurfaceWaterDepthFilter,
}
type JsonPlacementModifierKeys = keyof JsonPlacementModifierDispatcherMap
type JsonPlacementModifierFallback = (
  | JsonPlacementModifierBlockPredicateFilter
  | JsonPlacementModifierCount
  | JsonPlacementModifierCountOnEveryLayer
  | JsonPlacementModifierCuboid
  | JsonPlacementModifierEnvironmentScan
  | JsonPlacementModifierFixedPlacement
  | JsonPlacementModifierHeightRange
  | JsonPlacementModifierHeightmap
  | JsonPlacementModifierNoiseBasedCount
  | JsonPlacementModifierNoiseThresholdCount
  | JsonPlacementModifierOffset
  | JsonPlacementModifierRandomChance
  | JsonPlacementModifierRandomlySelected
  | JsonPlacementModifierRarityFilter
  | JsonPlacementModifierSurfaceRelativeThresholdFilter
  | JsonPlacementModifierSurfaceWaterDepthFilter)
type JsonPlacementModifierBlockPredicateFilter = JsonBlockPredicateFilter
type JsonPlacementModifierCount = JsonCountModifier
type JsonPlacementModifierCountOnEveryLayer = JsonCountOnEveryLayerModifier
type JsonPlacementModifierCuboid = JsonCuboidModifier
type JsonPlacementModifierEnvironmentScan = JsonEnvironmentScanModifier
type JsonPlacementModifierFixedPlacement = JsonFixedPlacementModifier
type JsonPlacementModifierHeightRange = JsonHeightRangeModifier
type JsonPlacementModifierHeightmap = JsonHeightmapModifier
type JsonPlacementModifierNoiseBasedCount = JsonNoiseBasedCountModifier
type JsonPlacementModifierNoiseThresholdCount = JsonNoiseThresholdCountModifier
type JsonPlacementModifierOffset = JsonOffsetModifier
type JsonPlacementModifierRandomChance = JsonRandomChanceModifier
type JsonPlacementModifierRandomlySelected = JsonRandomlySelectedModifier
type JsonPlacementModifierRarityFilter = JsonRarityFilter
type JsonPlacementModifierSurfaceRelativeThresholdFilter = JsonSurfaceRelativeThresholdFilter
type JsonPlacementModifierSurfaceWaterDepthFilter = JsonSurfaceWaterDepthFilter
export type JsonSymbolPlacementModifier<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonPlacementModifierDispatcherMap
  : CASE extends 'keys' ? JsonPlacementModifierKeys : CASE extends '%fallback' ? JsonPlacementModifierFallback : never
