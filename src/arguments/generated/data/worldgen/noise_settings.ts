import type { CubicSpline, DensityFunctionRef } from 'sandstone/arguments/generated/data/worldgen/density_function.ts'
import type { ClimateParameters } from 'sandstone/arguments/generated/data/worldgen/dimension/biome_source.ts'
import type {
  ConcentricRingsPlacement,
  RandomSpreadPlacement,
} from 'sandstone/arguments/generated/data/worldgen/structure_set.ts'
import type { SurfaceRule } from 'sandstone/arguments/generated/data/worldgen/surface_rule.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.ts'
import type { NBTDouble, NBTFloat, NBTInt } from 'sandstone'

export type NoiseGeneratorSettings = ({
  default_block: BlockState,
  default_fluid: BlockState,
  sea_level: NBTInt,
  /**
   * If true, mobs will not spawn during generation.
   */
  disable_mob_generation: boolean,
  legacy_random_source: boolean,
  noise: NoiseSettings,
  noise_router: NoiseRouter,
  spawn_target: Array<ClimateParameters>,
  surface_rule: SurfaceRule,
} & {
  aquifers_enabled: boolean,
  ore_veins_enabled: boolean,
})

export type NoiseGeneratorSettingsRef = (Registry['minecraft:worldgen/noise_settings'] | ({
  /**
   * Value:
   *
   * Value: Defines a `worldgen/noise_settings` id.
   */
  name: `${string}:${string}`,
} & NoiseGeneratorSettings))

export type NoiseRouter = {
  barrier: DensityFunctionRef,
  fluid_level_floodedness: DensityFunctionRef,
  fluid_level_spread: DensityFunctionRef,
  lava: DensityFunctionRef,
  vein_toggle: DensityFunctionRef,
  vein_ridged: DensityFunctionRef,
  vein_gap: DensityFunctionRef,
  temperature: DensityFunctionRef,
  vegetation: DensityFunctionRef,
  continents: DensityFunctionRef,
  erosion: DensityFunctionRef,
  depth: DensityFunctionRef,
  ridges: DensityFunctionRef,
  preliminary_surface_level: DensityFunctionRef,
  final_density: DensityFunctionRef,
}

export type NoiseSamplingSettings = {
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

export type NoiseSettings = {
  /**
   * Minimum height where blocks start generating.
   *
   * Value:
   * Range: -2048..2047
   */
  min_y: NBTInt<{}>,
  /**
   * The total height where blocks can generate. Max Y = Min Y + Height.
   *
   * Value:
   * Range: 0..4096
   */
  height: NBTInt<{
    min: 0,
  }>,
  /**
   * Value:
   * Range: 1..4
   */
  size_horizontal: NBTInt<{
    min: 1,
    max: 4,
  }>,
  /**
   * Value:
   * Range: 1..4
   */
  size_vertical: NBTInt<{
    min: 1,
    max: 4,
  }>,
}

export type NoiseSlideSettings = {
  /**
   * The target density. Positive values add terrain and negative values remove terrain.
   */
  target: NBTFloat,
  /**
   * Defines a range of 'Size * Size vertical * 4' blocks where the existing density and target are interpolated.
   *
   * Value:
   * Range: 0..256
   */
  size: NBTInt<{
    min: 0,
  }>,
  /**
   * Defines an range of 'Offset * Size vertical * 4' blocks where the density is set to the target.
   */
  offset: NBTInt,
}

export type StructureSettings = {
  stronghold?: ConcentricRingsPlacement,
  structures: ({
    [Key in Extract<`${string}:${string}`, string>]?: RandomSpreadPlacement
  }),
}

export type TerrainShaper = {
  offset: CubicSpline,
  factor: CubicSpline,
  jaggedness: CubicSpline,
}
