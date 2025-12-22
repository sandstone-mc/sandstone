import type {
  CarveStep,
  HeightmapType,
  HeightProvider,
  IntProvider,
} from 'sandstone/arguments/generated/data/worldgen.js'
import type { BlockPredicate } from 'sandstone/arguments/generated/data/worldgen/feature/block_predicate.js'
import type { ConfiguredFeatureRef } from 'sandstone/arguments/generated/data/worldgen/feature.js'
import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher.js'
import type { Registry } from 'sandstone/arguments/generated/registry.js'
import type { NBTFloat, NBTInt, NBTList } from 'sandstone'

export type BlockPredicateFilter = {
  predicate: BlockPredicate
}

export type CarvingMaskModifier = {
  /**
     * Value:
     *
     *  - Air(`air`)
     *  - Liquid(`liquid`)
     */
  step: CarveStep
}

export type CountModifier = {
  count: IntProvider<NBTInt<{
    min: 0
  }>>
}

export type EnvironmentScanModifier = {
  /**
     * Value:
     *
     *  - Up(`up`)
     *  - Down(`down`)
     */
  direction_of_search: SearchDirection
  /**
     * Value:
     * Range: 1..32
     */
  max_steps: NBTInt<{
    min: 1
    max: 32
  }>
  target_condition: BlockPredicate
  allowed_search_condition?: BlockPredicate
}

export type FixedPlacementModifier = {
  /**
     * Fixed list of block positions to place the feature at.
     */
  positions: Array<NBTList<NBTInt, {
    leftExclusive: false
    rightExclusive: false
    min: 3
    max: 3
  }>>
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
  heightmap: HeightmapType
}

export type HeightRangeModifier = {
  height: HeightProvider
}

export type NoiseBasedCountModifier = {
  noise_to_count_ratio: NBTInt
  noise_factor: NBTFloat
  noise_offset?: NBTFloat
}

export type NoiseThresholdCountModifier = {
  noise_level: NBTFloat
  below_noise: NBTInt
  above_noise: NBTInt
}

export type PlacedFeature = {
  feature: ConfiguredFeatureRef
  placement: Array<PlacementModifier>
}

export type PlacedFeatureRef = (Registry['minecraft:worldgen/placed_feature'] | PlacedFeature)

export type PlacementModifier = ({
  [S in Extract<Registry['minecraft:worldgen/placement_modifier_type'], string>]?: ({
    type: S
  } & (S extends keyof Dispatcher<'minecraft:placement_modifier'>
    ? Dispatcher<'minecraft:placement_modifier'>[S]
    : Record<string, unknown>));
}[Registry['minecraft:worldgen/placement_modifier_type']])

export type RandomOffsetModifier = {
  xz_spread: IntProvider<NBTInt<{
    min: -16
    max: 16
  }>>
  y_spread: IntProvider<NBTInt<{
    min: -16
    max: 16
  }>>
}

export type RarityFilter = {
  /**
     * Value:
     * Range: 0..
     */
  chance: NBTInt<{
    min: 0
  }>
}

export type SearchDirection = ('up' | 'down')

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
  heightmap: HeightmapType
  min_inclusive?: NBTInt
  max_inclusive?: NBTInt
}

export type SurfaceWaterDepthFilter = {
  max_water_depth: NBTInt
}
type PlacementModifierDispatcherMap = {
  'block_predicate_filter': PlacementModifierBlockPredicateFilter
  'minecraft:block_predicate_filter': PlacementModifierBlockPredicateFilter
  'carving_mask': PlacementModifierCarvingMask
  'minecraft:carving_mask': PlacementModifierCarvingMask
  'count': PlacementModifierCount
  'minecraft:count': PlacementModifierCount
  'count_on_every_layer': PlacementModifierCountOnEveryLayer
  'minecraft:count_on_every_layer': PlacementModifierCountOnEveryLayer
  'environment_scan': PlacementModifierEnvironmentScan
  'minecraft:environment_scan': PlacementModifierEnvironmentScan
  'fixed_placement': PlacementModifierFixedPlacement
  'minecraft:fixed_placement': PlacementModifierFixedPlacement
  'height_range': PlacementModifierHeightRange
  'minecraft:height_range': PlacementModifierHeightRange
  'heightmap': PlacementModifierHeightmap
  'minecraft:heightmap': PlacementModifierHeightmap
  'noise_based_count': PlacementModifierNoiseBasedCount
  'minecraft:noise_based_count': PlacementModifierNoiseBasedCount
  'noise_threshold_count': PlacementModifierNoiseThresholdCount
  'minecraft:noise_threshold_count': PlacementModifierNoiseThresholdCount
  'random_offset': PlacementModifierRandomOffset
  'minecraft:random_offset': PlacementModifierRandomOffset
  'rarity_filter': PlacementModifierRarityFilter
  'minecraft:rarity_filter': PlacementModifierRarityFilter
  'surface_relative_threshold_filter': PlacementModifierSurfaceRelativeThresholdFilter
  'minecraft:surface_relative_threshold_filter': PlacementModifierSurfaceRelativeThresholdFilter
  'surface_water_depth_filter': PlacementModifierSurfaceWaterDepthFilter
  'minecraft:surface_water_depth_filter': PlacementModifierSurfaceWaterDepthFilter
}
type PlacementModifierKeys = keyof PlacementModifierDispatcherMap
type PlacementModifierFallback = (
  | PlacementModifierBlockPredicateFilter
  | PlacementModifierCarvingMask
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
type PlacementModifierCarvingMask = CarvingMaskModifier
type PlacementModifierCount = CountModifier
type PlacementModifierCountOnEveryLayer = CountModifier
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
  | '%none' = 'map'> = CASE extends 'map'
  ? PlacementModifierDispatcherMap
  : CASE extends 'keys' ? PlacementModifierKeys : CASE extends '%fallback' ? PlacementModifierFallback : never
