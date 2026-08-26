import type {
  CarveStep,
  HeightmapType,
  HeightProvider,
  IntProvider,
} from 'sandstone/arguments/generated/data/worldgen.ts'
import type { BlockPredicate } from 'sandstone/arguments/generated/data/worldgen/feature/block_predicate.ts'
import type { ConfiguredFeatureRef } from 'sandstone/arguments/generated/data/worldgen/feature.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { VerticalDirection } from 'sandstone/arguments/generated/util/direction.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat, NBTInt, NBTList, TagClass } from 'sandstone'

export type BlockPredicateFilter = {
  predicate: BlockPredicate,
}

export type CarvingMaskModifier = {
  /**
   * Value:
   *
   *  - Air(`air`)
   *  - Liquid(`liquid`)
   */
  step: CarveStep,
}

export type CountModifier = {
  count: IntProvider<NBTInt<{
    min: 0,
  }>>,
}

export type CountOnEveryLayerModifier = {
  count: IntProvider<NBTInt<{
    min: 0,
  }>>,
}

export type CuboidModifier = {
  xz_size: IntProvider<NBTInt<{
    min: 1,
    max: 16,
  }>>,
  y_size: IntProvider<NBTInt<{
    min: 1,
    max: 16,
  }>>,
  /**
   * Defaults to `true`.
   */
  include_interior?: boolean,
  /**
   * Defaults to `true`.
   */
  include_edges?: boolean,
}

export type EnvironmentScanModifier = {
  /**
   * Value:
   *
   *  - Down(`down`)
   *  - Up(`up`)
   */
  direction_of_search: VerticalDirection,
  /**
   * Value:
   * Range: 1..32
   */
  max_steps: NBTInt<{
    min: 1,
    max: 32,
  }>,
  target_condition: BlockPredicate,
  allowed_search_condition?: BlockPredicate,
}

export type FixedPlacementModifier = {
  /**
   * Fixed list of block positions to place the feature at.
   */
  positions: Array<NBTList<NBTInt, {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>>,
}

export type HeightmapModifier = {
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
  heightmap: HeightmapType,
}

export type HeightRangeModifier = {
  height: HeightProvider,
}

export type NoiseBasedCountModifier = {
  noise_to_count_ratio: NBTInt,
  noise_factor: NBTFloat,
  noise_offset?: NBTFloat,
}

export type NoiseThresholdCountModifier = {
  noise_level: NBTFloat,
  below_noise: NBTInt,
  above_noise: NBTInt,
}

export type OffsetModifier = {
  x: IntProvider<NBTInt<{
    min: -16,
    max: 16,
  }>>,
  y: IntProvider<NBTInt<{
    min: -16,
    max: 16,
  }>>,
  z: IntProvider<NBTInt<{
    min: -16,
    max: 16,
  }>>,
}

export type PlacedFeature = {
  feature: ConfiguredFeatureRef,
  placement: Array<PlacementModifier>,
}

/**
 * *either*
 *
 * *item 0*
 *
 * *or*
 *
 * List length range: 1..
 *
 * *or*
 *
 * *item 2*
 *
 * *or*
 *
 * List length range: 1..
 */
export type PlacedFeatureListRef = (PlacedFeature | NBTList<PlacedFeature, {
  leftExclusive: false,
  min: 1,
}> | (
  | Registry['minecraft:worldgen/placed_feature']
  | `#${string}:${string}`
  | TagClass<'worldgen/placed_feature'>) | NBTList<Registry['minecraft:worldgen/placed_feature'], {
    leftExclusive: false,
    min: 1,
  }>)

export type PlacedFeatureRef = (PlacedFeature | Registry['minecraft:worldgen/placed_feature'])

export type PlacementModifier = NonNullable<({
  [S in Extract<Extract<Registry['minecraft:worldgen/placement_modifier_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolPlacementModifier ? SymbolPlacementModifier[S] : RootNBT))
}[Extract<Registry['minecraft:worldgen/placement_modifier_type'], string>])>

export type RandomChanceModifier = {
  /**
   * Value:
   * Range: 0..1
   */
  chance: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
}

export type RandomlySelectedModifier = {
  /**
   * Value:
   * List length range: 1..
   */
  placements: NBTList<PlacementModifier, {
    leftExclusive: false,
    min: 1,
  }>,
}

export type RandomOffsetModifier = {
  xz_spread: IntProvider<NBTInt<{
    min: -16,
    max: 16,
  }>>,
  y_spread: IntProvider<NBTInt<{
    min: -16,
    max: 16,
  }>>,
}

export type RarityFilter = {
  /**
   * Value:
   * Range: 0..
   */
  chance: NBTInt<{
    min: 0,
  }>,
}

export type SurfaceRelativeThresholdFilter = {
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
  heightmap: HeightmapType,
  min_inclusive?: NBTInt,
  max_inclusive?: NBTInt,
}

export type SurfaceWaterDepthFilter = {
  max_water_depth: NBTInt,
}
type PlacementModifierDispatcherMap = {
  'block_predicate_filter': PlacementModifierBlockPredicateFilter,
  'minecraft:block_predicate_filter': PlacementModifierBlockPredicateFilter,
  'count': PlacementModifierCount,
  'minecraft:count': PlacementModifierCount,
  'count_on_every_layer': PlacementModifierCountOnEveryLayer,
  'minecraft:count_on_every_layer': PlacementModifierCountOnEveryLayer,
  'environment_scan': PlacementModifierEnvironmentScan,
  'minecraft:environment_scan': PlacementModifierEnvironmentScan,
  'fixed_placement': PlacementModifierFixedPlacement,
  'minecraft:fixed_placement': PlacementModifierFixedPlacement,
  'height_range': PlacementModifierHeightRange,
  'minecraft:height_range': PlacementModifierHeightRange,
  'heightmap': PlacementModifierHeightmap,
  'minecraft:heightmap': PlacementModifierHeightmap,
  'noise_based_count': PlacementModifierNoiseBasedCount,
  'minecraft:noise_based_count': PlacementModifierNoiseBasedCount,
  'noise_threshold_count': PlacementModifierNoiseThresholdCount,
  'minecraft:noise_threshold_count': PlacementModifierNoiseThresholdCount,
  'random_offset': PlacementModifierRandomOffset,
  'minecraft:random_offset': PlacementModifierRandomOffset,
  'rarity_filter': PlacementModifierRarityFilter,
  'minecraft:rarity_filter': PlacementModifierRarityFilter,
  'surface_relative_threshold_filter': PlacementModifierSurfaceRelativeThresholdFilter,
  'minecraft:surface_relative_threshold_filter': PlacementModifierSurfaceRelativeThresholdFilter,
  'surface_water_depth_filter': PlacementModifierSurfaceWaterDepthFilter,
  'minecraft:surface_water_depth_filter': PlacementModifierSurfaceWaterDepthFilter,
}
type PlacementModifierKeys = keyof PlacementModifierDispatcherMap
type PlacementModifierFallback = (
  | PlacementModifierBlockPredicateFilter
  | PlacementModifierCount
  | PlacementModifierCountOnEveryLayer
  | PlacementModifierEnvironmentScan
  | PlacementModifierFixedPlacement
  | PlacementModifierHeightRange
  | PlacementModifierHeightmap
  | PlacementModifierNoiseBasedCount
  | PlacementModifierNoiseThresholdCount
  | PlacementModifierRandomOffset
  | PlacementModifierRarityFilter
  | PlacementModifierSurfaceRelativeThresholdFilter
  | PlacementModifierSurfaceWaterDepthFilter)
type PlacementModifierBlockPredicateFilter = BlockPredicateFilter
type PlacementModifierCount = CountModifier
type PlacementModifierCountOnEveryLayer = CountOnEveryLayerModifier
type PlacementModifierEnvironmentScan = EnvironmentScanModifier
type PlacementModifierFixedPlacement = FixedPlacementModifier
type PlacementModifierHeightRange = HeightRangeModifier
type PlacementModifierHeightmap = HeightmapModifier
type PlacementModifierNoiseBasedCount = NoiseBasedCountModifier
type PlacementModifierNoiseThresholdCount = NoiseThresholdCountModifier
type PlacementModifierRandomOffset = RandomOffsetModifier
type PlacementModifierRarityFilter = RarityFilter
type PlacementModifierSurfaceRelativeThresholdFilter = SurfaceRelativeThresholdFilter
type PlacementModifierSurfaceWaterDepthFilter = SurfaceWaterDepthFilter
export type SymbolPlacementModifier<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? PlacementModifierDispatcherMap
  : CASE extends 'keys' ? PlacementModifierKeys : CASE extends '%fallback' ? PlacementModifierFallback : never
