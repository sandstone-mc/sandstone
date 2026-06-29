import type { CaveSurface, VerticalAnchor } from 'sandstone/arguments/generated/data/worldgen.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat, NBTInt, TagClass } from 'sandstone'

export type BiomeCondition = {
  biome_is: (
      | Array<Registry['minecraft:worldgen/biome']> | (
        | Registry['minecraft:worldgen/biome']
        | `#${Registry['minecraft:tag/worldgen/biome']}`
        | TagClass<'worldgen/biome'>)),
}

export type MaterialCondition = NonNullable<({
  [S in Extract<Registry['minecraft:worldgen/material_condition'], string>]?: ({
    type: S,
  } & (S extends keyof SymbolMaterialCondition ? SymbolMaterialCondition[S] : RootNBT))
}[Registry['minecraft:worldgen/material_condition']])>

export type MaterialConditionRef = MaterialCondition

export type NoiseThresholdCondition = {
  noise: Registry['minecraft:worldgen/noise'],
  min_threshold: NBTFloat,
  max_threshold: NBTFloat,
  /**
   * Defaults to `false`.
   */
  is_3d?: boolean,
}

export type NotCondition = {
  invert: MaterialConditionRef,
}

export type StoneDepthCondition = {
  offset: NBTInt,
  /**
   * Value:
   *
   *  - Floor(`floor`)
   *  - Ceiling(`ceiling`)
   */
  surface_type: CaveSurface,
  add_surface_depth: boolean,
  secondary_depth_range: NBTInt,
}

export type VerticalGradientCondition = {
  random_name: string,
  true_at_and_below: VerticalAnchor,
  false_at_and_above: VerticalAnchor,
}

export type WaterCondition = {
  offset: NBTInt,
  /**
   * Value:
   * Range: -20..20
   */
  surface_depth_multiplier: NBTInt<{
    min: -20,
    max: 20,
  }>,
  add_stone_depth: boolean,
}

export type YAboveCondition = {
  anchor: VerticalAnchor,
  /**
   * Value:
   * Range: -20..20
   */
  surface_depth_multiplier: NBTInt<{
    min: -20,
    max: 20,
  }>,
  add_stone_depth: boolean,
}
type MaterialConditionDispatcherMap = {
  'biome': MaterialConditionBiome,
  'minecraft:biome': MaterialConditionBiome,
  'noise_threshold': MaterialConditionNoiseThreshold,
  'minecraft:noise_threshold': MaterialConditionNoiseThreshold,
  'not': MaterialConditionNot,
  'minecraft:not': MaterialConditionNot,
  'stone_depth': MaterialConditionStoneDepth,
  'minecraft:stone_depth': MaterialConditionStoneDepth,
  'vertical_gradient': MaterialConditionVerticalGradient,
  'minecraft:vertical_gradient': MaterialConditionVerticalGradient,
  'water': MaterialConditionWater,
  'minecraft:water': MaterialConditionWater,
  'y_above': MaterialConditionYAbove,
  'minecraft:y_above': MaterialConditionYAbove,
}
type MaterialConditionKeys = keyof MaterialConditionDispatcherMap
type MaterialConditionFallback = (
  | MaterialConditionBiome
  | MaterialConditionNoiseThreshold
  | MaterialConditionNot
  | MaterialConditionStoneDepth
  | MaterialConditionVerticalGradient
  | MaterialConditionWater
  | MaterialConditionYAbove)
type MaterialConditionBiome = BiomeCondition
type MaterialConditionNoiseThreshold = NoiseThresholdCondition
type MaterialConditionNot = NotCondition
type MaterialConditionStoneDepth = StoneDepthCondition
type MaterialConditionVerticalGradient = VerticalGradientCondition
type MaterialConditionWater = WaterCondition
type MaterialConditionYAbove = YAboveCondition
export type SymbolMaterialCondition<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? MaterialConditionDispatcherMap
  : CASE extends 'keys' ? MaterialConditionKeys : CASE extends '%fallback' ? MaterialConditionFallback : never
