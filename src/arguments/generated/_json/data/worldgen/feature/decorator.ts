import type {
  JsonCarveStep,
  JsonHeightmapType,
  JsonHeightProvider,
  JsonIntProvider,
} from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NamespacedString, NBTFloat, NBTInt } from 'sandstone'

export type JsonCarvingMaskConfig = {
  /**
   * Value:
   *
   *  - Air(`air`)
   *  - Liquid(`liquid`)
   */
  step: JsonCarveStep,
}

export type JsonCaveSurface = {
  surface: ('floor' | 'ceiling'),
  floor_to_ceiling_search_range: (NBTInt | number),
}

export type JsonChanceConfig = {
  /**
   * Value:
   * Range: 0..
   */
  chance: (NBTInt<{
    min: 0,
  }> | number),
}

export type JsonConfiguredDecorator = NonNullable<({
  [S in Extract<Extract<NamespacedString, string>, string>]?: {
    type: S,
    config: (S extends keyof JsonSymbolDecoratorConfig ? JsonSymbolDecoratorConfig[S] : JsonRootNBT),
  }
}[Extract<NamespacedString, string>])>

export type JsonCountConfig = {
  count: JsonIntProvider<(NBTInt<{
    min: 0,
  }> | number)>,
}

export type JsonCountExtraConfig = {
  /**
   * Value:
   * Range: 0..
   */
  count: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..
   */
  extra_count: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0..1
   */
  extra_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
}

export type JsonCountNoiseBiasedConfig = {
  noise_to_count_ratio: (NBTInt | number),
  noise_factor: (NBTFloat | number),
  noise_offset?: (NBTFloat | number),
}

export type JsonCountNoiseConfig = {
  noise_level: (NBTFloat | number),
  below_noise: (NBTInt | number),
  above_noise: (NBTInt | number),
}

export type JsonDecoratedConfig = {
  outer: JsonConfiguredDecorator,
  inner: JsonConfiguredDecorator,
}

export type JsonDepthAverageConfig = {
  baseline: (NBTInt | number),
  spread: (NBTInt | number),
}

export type JsonHeightmapConfig = {
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

export type JsonOldRangeConfig = {
  maximum: (NBTInt | number),
  bottom_offset: (NBTInt | number),
  top_offset: (NBTInt | number),
}

export type JsonRangeConfig = {
  height: JsonHeightProvider,
}

export type JsonWaterDepthThresholdConfig = {
  max_water_depth: (NBTInt | number),
}
type JsonDecoratorConfigDispatcherMap = {
  'carving_mask': JsonDecoratorConfigCarvingMask,
  'minecraft:carving_mask': JsonDecoratorConfigCarvingMask,
  'cave_surface': JsonDecoratorConfigCaveSurface,
  'minecraft:cave_surface': JsonDecoratorConfigCaveSurface,
  'chance': JsonDecoratorConfigChance,
  'minecraft:chance': JsonDecoratorConfigChance,
  'count': JsonDecoratorConfigCount,
  'minecraft:count': JsonDecoratorConfigCount,
  'count_extra': JsonDecoratorConfigCountExtra,
  'minecraft:count_extra': JsonDecoratorConfigCountExtra,
  'count_multilayer': JsonDecoratorConfigCountMultilayer,
  'minecraft:count_multilayer': JsonDecoratorConfigCountMultilayer,
  'count_noise': JsonDecoratorConfigCountNoise,
  'minecraft:count_noise': JsonDecoratorConfigCountNoise,
  'count_noise_biased': JsonDecoratorConfigCountNoiseBiased,
  'minecraft:count_noise_biased': JsonDecoratorConfigCountNoiseBiased,
  'dark_oak_tree': JsonDecoratorConfigDarkOakTree,
  'minecraft:dark_oak_tree': JsonDecoratorConfigDarkOakTree,
  'decorated': JsonDecoratorConfigDecorated,
  'minecraft:decorated': JsonDecoratorConfigDecorated,
  'end_gateway': JsonDecoratorConfigEndGateway,
  'minecraft:end_gateway': JsonDecoratorConfigEndGateway,
  'fire': JsonDecoratorConfigFire,
  'minecraft:fire': JsonDecoratorConfigFire,
  'glowstone': JsonDecoratorConfigGlowstone,
  'minecraft:glowstone': JsonDecoratorConfigGlowstone,
  'heightmap': JsonDecoratorConfigHeightmap,
  'minecraft:heightmap': JsonDecoratorConfigHeightmap,
  'heightmap_spread_double': JsonDecoratorConfigHeightmapSpreadDouble,
  'minecraft:heightmap_spread_double': JsonDecoratorConfigHeightmapSpreadDouble,
  'iceberg': JsonDecoratorConfigIceberg,
  'minecraft:iceberg': JsonDecoratorConfigIceberg,
  'lava_lake': JsonDecoratorConfigLavaLake,
  'minecraft:lava_lake': JsonDecoratorConfigLavaLake,
  'nope': JsonDecoratorConfigNope,
  'minecraft:nope': JsonDecoratorConfigNope,
  'range': JsonDecoratorConfigRange,
  'minecraft:range': JsonDecoratorConfigRange,
  'spread_32_above': JsonDecoratorConfigSpread32Above,
  'minecraft:spread_32_above': JsonDecoratorConfigSpread32Above,
  'square': JsonDecoratorConfigSquare,
  'minecraft:square': JsonDecoratorConfigSquare,
  'water_depth_threshold': JsonDecoratorConfigWaterDepthThreshold,
  'minecraft:water_depth_threshold': JsonDecoratorConfigWaterDepthThreshold,
}
type JsonDecoratorConfigKeys = keyof JsonDecoratorConfigDispatcherMap
type JsonDecoratorConfigFallback = (
  | JsonDecoratorConfigCarvingMask
  | JsonDecoratorConfigCaveSurface
  | JsonDecoratorConfigChance
  | JsonDecoratorConfigCount
  | JsonDecoratorConfigCountExtra
  | JsonDecoratorConfigCountMultilayer
  | JsonDecoratorConfigCountNoise
  | JsonDecoratorConfigCountNoiseBiased
  | JsonDecoratorConfigDarkOakTree
  | JsonDecoratorConfigDecorated
  | JsonDecoratorConfigEndGateway
  | JsonDecoratorConfigFire
  | JsonDecoratorConfigGlowstone
  | JsonDecoratorConfigHeightmap
  | JsonDecoratorConfigHeightmapSpreadDouble
  | JsonDecoratorConfigIceberg
  | JsonDecoratorConfigLavaLake
  | JsonDecoratorConfigNope
  | JsonDecoratorConfigRange
  | JsonDecoratorConfigSpread32Above
  | JsonDecoratorConfigSquare
  | JsonDecoratorConfigWaterDepthThreshold)
type JsonDecoratorConfigCarvingMask = JsonCarvingMaskConfig
type JsonDecoratorConfigCaveSurface = JsonCaveSurface
type JsonDecoratorConfigChance = JsonChanceConfig
type JsonDecoratorConfigCount = JsonCountConfig
type JsonDecoratorConfigCountExtra = JsonCountExtraConfig
type JsonDecoratorConfigCountMultilayer = JsonCountConfig
type JsonDecoratorConfigCountNoise = JsonCountNoiseConfig
type JsonDecoratorConfigCountNoiseBiased = JsonCountNoiseBiasedConfig
type JsonDecoratorConfigDarkOakTree = Record<string, never>
type JsonDecoratorConfigDecorated = JsonDecoratedConfig
type JsonDecoratorConfigEndGateway = Record<string, never>
type JsonDecoratorConfigFire = JsonCountConfig
type JsonDecoratorConfigGlowstone = JsonCountConfig
type JsonDecoratorConfigHeightmap = JsonHeightmapConfig
type JsonDecoratorConfigHeightmapSpreadDouble = JsonHeightmapConfig
type JsonDecoratorConfigIceberg = Record<string, never>
type JsonDecoratorConfigLavaLake = JsonChanceConfig
type JsonDecoratorConfigNope = Record<string, never>
type JsonDecoratorConfigRange = JsonRangeConfig
type JsonDecoratorConfigSpread32Above = Record<string, never>
type JsonDecoratorConfigSquare = Record<string, never>
type JsonDecoratorConfigWaterDepthThreshold = JsonWaterDepthThresholdConfig
export type JsonSymbolDecoratorConfig<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonDecoratorConfigDispatcherMap
  : CASE extends 'keys' ? JsonDecoratorConfigKeys : CASE extends '%fallback' ? JsonDecoratorConfigFallback : never
