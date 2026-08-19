import type {
  JsonCubicSpline,
  JsonDensityFunctionRef,
} from 'sandstone/arguments/generated/_json/data/worldgen/density_function.ts'
import type { JsonClimateParameter } from 'sandstone/arguments/generated/_json/data/worldgen/dimension/biome_source.ts'
import type { JsonMaterialRuleRef } from 'sandstone/arguments/generated/_json/data/worldgen/material_rule.ts'
import type {
  JsonConcentricRingsPlacement,
  JsonRandomSpreadPlacement,
} from 'sandstone/arguments/generated/_json/data/worldgen/structure_set.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { JsonNBTList, NamespacedString, NBTDouble, NBTFloat, NBTInt } from 'sandstone'

export type JsonAquifer = {
  barrier: JsonDensityFunctionRef,
  fluid_level_floodedness: JsonDensityFunctionRef,
  fluid_level_spread: JsonDensityFunctionRef,
  lava: JsonDensityFunctionRef,
  exclusion: JsonDensityFunctionRef,
  surface_level: JsonDensityFunctionRef,
}

export type JsonNoiseGeneratorFlags = {
  aquifers_enabled: boolean,
  ore_veins_enabled: boolean,
}

export type JsonNoiseGeneratorSettings = {
  default_block: JsonBlockState,
  default_fluid: JsonBlockState,
  sea_level: (NBTInt | number),
  /**
   * If true, mobs will not spawn during generation.
   */
  disable_mob_generation: boolean,
  aquifers?: JsonAquifer,
  ore_veins?: Array<JsonOreVeinifier>,
  legacy_random_source: boolean,
  noise: JsonNoiseSettings,
  noise_router: JsonNoiseRouter,
  spawn_target: Array<JsonSpawnTargetPoint>,
  material_rule: JsonMaterialRuleRef,
}

export type JsonNoiseGeneratorSettingsRef = (JsonRegistry['minecraft:worldgen/noise_settings'] | ({
  /**
   * Value:
   *
   * Value: Defines a `worldgen/noise_settings` id.
   */
  name: NamespacedString,
} & JsonNoiseGeneratorSettings))

export type JsonNoiseRouter = {
  temperature: JsonDensityFunctionRef,
  vegetation: JsonDensityFunctionRef,
  continents: JsonDensityFunctionRef,
  erosion: JsonDensityFunctionRef,
  depth: JsonDensityFunctionRef,
  ridges: JsonDensityFunctionRef,
  preliminary_surface_level: JsonDensityFunctionRef,
  final_density: JsonDensityFunctionRef,
}

export type JsonNoiseSamplingSettings = {
  /**
   * Value:
   * Range: 0.001..1000
   */
  xz_scale: (NBTDouble<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0.001..1000
   */
  y_scale: (NBTDouble<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0.001..1000
   */
  xz_factor: (NBTDouble<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 0.001..1000
   */
  y_factor: (NBTDouble<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
  }> | number),
}

export type JsonNoiseSettings = {
  /**
   * Minimum height where blocks start generating.
   *
   * Value:
   * Range: -2048..2047
   */
  min_y: (NBTInt<{}> | number),
  /**
   * The total height where blocks can generate. Max Y = Min Y + Height.
   *
   * Value:
   * Range: 0..4096
   */
  height: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Value:
   * Range: 1..4
   */
  size_horizontal: (NBTInt<{
    min: 1,
    max: 4,
  }> | number),
  /**
   * Value:
   * Range: 1..4
   */
  size_vertical: (NBTInt<{
    min: 1,
    max: 4,
  }> | number),
}

export type JsonNoiseSlideSettings = {
  /**
   * The target density. Positive values add terrain and negative values remove terrain.
   */
  target: (NBTFloat | number),
  /**
   * Defines a range of 'Size * Size vertical * 4' blocks where the existing density and target are interpolated.
   *
   * Value:
   * Range: 0..256
   */
  size: (NBTInt<{
    min: 0,
  }> | number),
  /**
   * Defines an range of 'Offset * Size vertical * 4' blocks where the density is set to the target.
   */
  offset: (NBTInt | number),
}

export type JsonOreVeinifier = {
  ore_block: JsonBlockState,
  raw_ore_block: JsonBlockState,
  filler_block: JsonBlockState,
  /**
   * Value:
   * Range: 0..1
   */
  raw_ore_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  density: JsonDensityFunctionRef,
  richness: JsonDensityFunctionRef,
  filler_gap: JsonDensityFunctionRef,
}

export type JsonSpawnTargetPoint = ({
  [Key in Extract<JsonRegistry['minecraft:worldgen/density_function'], string>]?: JsonClimateParameter
})

export type JsonStructureSettings = {
  stronghold?: JsonConcentricRingsPlacement,
  structures: ({
    [Key in Extract<NamespacedString, string>]?: JsonRandomSpreadPlacement
  }),
}

export type JsonTerrainShaper = {
  offset: JsonCubicSpline,
  factor: JsonCubicSpline,
  jaggedness: JsonCubicSpline,
}
