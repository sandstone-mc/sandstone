import type {
  CarveStep,
  HeightmapType,
  HeightProvider,
  IntProvider,
} from 'sandstone/arguments/generated/data/worldgen'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { NBTFloat, NBTInt } from 'sandstone'
import type { NBTObject } from 'sandstone/arguments/nbt'

export type CarvingMaskConfig = {
  /**
     * Value:
     *
     *  - Air(`air`)
     *  - Liquid(`liquid`)
     */
  step: CarveStep
}

export type CaveSurface = {
  surface: ('floor' | 'ceiling')
  floor_to_ceiling_search_range: NBTInt
}

export type ChanceConfig = {
  /**
     * Value:
     * Range: 0..
     */
  chance: NBTInt<{
    min: 0
  }>
}

export type ConfiguredDecorator = ({
  [S in Extract<`${string}:${string}`, string>]?: {
    type: S
    config: (S extends keyof SymbolDecoratorConfig ? SymbolDecoratorConfig[S] : NBTObject)
  };
}[`${string}:${string}`])

export type CountConfig = {
  count: IntProvider<NBTInt<{
    min: 0
  }>>
}

export type CountExtraConfig = {
  /**
     * Value:
     * Range: 0..
     */
  count: NBTInt<{
    min: 0
  }>
  /**
     * Value:
     * Range: 0..
     */
  extra_count: NBTInt<{
    min: 0
  }>
  /**
     * Value:
     * Range: 0..1
     */
  extra_chance: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 0
    max: 1
  }>
}

export type CountNoiseBiasedConfig = {
  noise_to_count_ratio: NBTInt
  noise_factor: NBTFloat
  noise_offset?: NBTFloat
}

export type CountNoiseConfig = {
  noise_level: NBTFloat
  below_noise: NBTInt
  above_noise: NBTInt
}

export type DecoratedConfig = {
  outer: ConfiguredDecorator
  inner: ConfiguredDecorator
}

export type DepthAverageConfig = {
  baseline: NBTInt
  spread: NBTInt
}

export type HeightmapConfig = {
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

export type OldRangeConfig = {
  maximum: NBTInt
  bottom_offset: NBTInt
  top_offset: NBTInt
}

export type RangeConfig = {
  height: HeightProvider
}

export type WaterDepthThresholdConfig = {
  max_water_depth: NBTInt
}
type DecoratorConfigDispatcherMap = {
  'carving_mask': DecoratorConfigCarvingMask
  'minecraft:carving_mask': DecoratorConfigCarvingMask
  'cave_surface': DecoratorConfigCaveSurface
  'minecraft:cave_surface': DecoratorConfigCaveSurface
  'chance': DecoratorConfigChance
  'minecraft:chance': DecoratorConfigChance
  'count': DecoratorConfigCount
  'minecraft:count': DecoratorConfigCount
  'count_extra': DecoratorConfigCountExtra
  'minecraft:count_extra': DecoratorConfigCountExtra
  'count_multilayer': DecoratorConfigCountMultilayer
  'minecraft:count_multilayer': DecoratorConfigCountMultilayer
  'count_noise': DecoratorConfigCountNoise
  'minecraft:count_noise': DecoratorConfigCountNoise
  'count_noise_biased': DecoratorConfigCountNoiseBiased
  'minecraft:count_noise_biased': DecoratorConfigCountNoiseBiased
  'dark_oak_tree': DecoratorConfigDarkOakTree
  'minecraft:dark_oak_tree': DecoratorConfigDarkOakTree
  'decorated': DecoratorConfigDecorated
  'minecraft:decorated': DecoratorConfigDecorated
  'depth_average': DecoratorConfigDepthAverage
  'minecraft:depth_average': DecoratorConfigDepthAverage
  'end_gateway': DecoratorConfigEndGateway
  'minecraft:end_gateway': DecoratorConfigEndGateway
  'fire': DecoratorConfigFire
  'minecraft:fire': DecoratorConfigFire
  'glowstone': DecoratorConfigGlowstone
  'minecraft:glowstone': DecoratorConfigGlowstone
  'heightmap': DecoratorConfigHeightmap
  'minecraft:heightmap': DecoratorConfigHeightmap
  'heightmap_spread_double': DecoratorConfigHeightmapSpreadDouble
  'minecraft:heightmap_spread_double': DecoratorConfigHeightmapSpreadDouble
  'iceberg': DecoratorConfigIceberg
  'minecraft:iceberg': DecoratorConfigIceberg
  'lava_lake': DecoratorConfigLavaLake
  'minecraft:lava_lake': DecoratorConfigLavaLake
  'nope': DecoratorConfigNope
  'minecraft:nope': DecoratorConfigNope
  'range': DecoratorConfigRange
  'minecraft:range': DecoratorConfigRange
  'range_biased': DecoratorConfigRangeBiased
  'minecraft:range_biased': DecoratorConfigRangeBiased
  'range_very_biased': DecoratorConfigRangeVeryBiased
  'minecraft:range_very_biased': DecoratorConfigRangeVeryBiased
  'spread_32_above': DecoratorConfigSpread32Above
  'minecraft:spread_32_above': DecoratorConfigSpread32Above
  'square': DecoratorConfigSquare
  'minecraft:square': DecoratorConfigSquare
  'water_depth_threshold': DecoratorConfigWaterDepthThreshold
  'minecraft:water_depth_threshold': DecoratorConfigWaterDepthThreshold
  'water_lake': DecoratorConfigWaterLake
  'minecraft:water_lake': DecoratorConfigWaterLake
}
type DecoratorConfigKeys = keyof DecoratorConfigDispatcherMap
type DecoratorConfigFallback = (
  | DecoratorConfigCarvingMask
  | DecoratorConfigCaveSurface
  | DecoratorConfigChance
  | DecoratorConfigCount
  | DecoratorConfigCountExtra
  | DecoratorConfigCountMultilayer
  | DecoratorConfigCountNoise
  | DecoratorConfigCountNoiseBiased
  | DecoratorConfigDarkOakTree
  | DecoratorConfigDecorated
  | DecoratorConfigDepthAverage
  | DecoratorConfigEndGateway
  | DecoratorConfigFire
  | DecoratorConfigGlowstone
  | DecoratorConfigHeightmap
  | DecoratorConfigHeightmapSpreadDouble
  | DecoratorConfigIceberg
  | DecoratorConfigLavaLake
  | DecoratorConfigNope
  | DecoratorConfigRange
  | DecoratorConfigRangeBiased
  | DecoratorConfigRangeVeryBiased
  | DecoratorConfigSpread32Above
  | DecoratorConfigSquare
  | DecoratorConfigWaterDepthThreshold
  | DecoratorConfigWaterLake)
type DecoratorConfigCarvingMask = CarvingMaskConfig
type DecoratorConfigCaveSurface = CaveSurface
type DecoratorConfigChance = ChanceConfig
type DecoratorConfigCount = CountConfig
type DecoratorConfigCountExtra = CountExtraConfig
type DecoratorConfigCountMultilayer = CountConfig
type DecoratorConfigCountNoise = CountNoiseConfig
type DecoratorConfigCountNoiseBiased = CountNoiseBiasedConfig
type DecoratorConfigDarkOakTree = Record<string, never>
type DecoratorConfigDecorated = DecoratedConfig
type DecoratorConfigDepthAverage = DepthAverageConfig
type DecoratorConfigEndGateway = Record<string, never>
type DecoratorConfigFire = CountConfig
type DecoratorConfigGlowstone = CountConfig
type DecoratorConfigHeightmap = HeightmapConfig
type DecoratorConfigHeightmapSpreadDouble = HeightmapConfig
type DecoratorConfigIceberg = Record<string, never>
type DecoratorConfigLavaLake = ChanceConfig
type DecoratorConfigNope = Record<string, never>
type DecoratorConfigRange = RangeConfig
type DecoratorConfigRangeBiased = OldRangeConfig
type DecoratorConfigRangeVeryBiased = OldRangeConfig
type DecoratorConfigSpread32Above = Record<string, never>
type DecoratorConfigSquare = Record<string, never>
type DecoratorConfigWaterDepthThreshold = WaterDepthThresholdConfig
type DecoratorConfigWaterLake = ChanceConfig
export type SymbolDecoratorConfig<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? DecoratorConfigDispatcherMap
  : CASE extends 'keys' ? DecoratorConfigKeys : CASE extends '%fallback' ? DecoratorConfigFallback : never
