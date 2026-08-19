import type { JsonCaveSurface, JsonVerticalAnchor } from 'sandstone/arguments/generated/_json/data/worldgen.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NamespacedString, NBTFloat, NBTInt, TagClass } from 'sandstone'

export type JsonBiomeCondition = {
  biome_is: (
      | Array<JsonRegistry['minecraft:worldgen/biome']> | (
        | JsonRegistry['minecraft:worldgen/biome']
        | `#${JsonRegistry['minecraft:tag/worldgen/biome']}`
        | TagClass<'worldgen/biome'>)),
}

export type JsonMaterialCondition = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/material_condition_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolMaterialCondition ? JsonSymbolMaterialCondition[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:worldgen/material_condition_type'], string>])>

export type JsonMaterialConditionRef = (NamespacedString | JsonMaterialCondition)

export type JsonNoiseThresholdCondition = {
  noise: JsonRegistry['minecraft:worldgen/noise'],
  min_threshold: (NBTFloat | number),
  max_threshold: (NBTFloat | number),
  /**
   * Defaults to `false`.
   */
  is_3d?: boolean,
}

export type JsonNotCondition = {
  invert: JsonMaterialConditionRef,
}

export type JsonStoneDepthCondition = {
  offset: (NBTInt | number),
  /**
   * Value:
   *
   *  - Floor(`floor`)
   *  - Ceiling(`ceiling`)
   */
  surface_type: JsonCaveSurface,
  add_surface_depth: boolean,
  secondary_depth_range: (NBTInt | number),
}

export type JsonVerticalGradientCondition = {
  random_name: string,
  true_at_and_below: JsonVerticalAnchor,
  false_at_and_above: JsonVerticalAnchor,
}

export type JsonWaterCondition = {
  offset: (NBTInt | number),
  /**
   * Value:
   * Range: -20..20
   */
  surface_depth_multiplier: (NBTInt<{
    min: -20,
    max: 20,
  }> | number),
  add_stone_depth: boolean,
}

export type JsonYAboveCondition = {
  anchor: JsonVerticalAnchor,
  /**
   * Value:
   * Range: -20..20
   */
  surface_depth_multiplier: (NBTInt<{
    min: -20,
    max: 20,
  }> | number),
  add_stone_depth: boolean,
}
type JsonMaterialConditionDispatcherMap = {
  'biome': JsonMaterialConditionBiome,
  'minecraft:biome': JsonMaterialConditionBiome,
  'noise_threshold': JsonMaterialConditionNoiseThreshold,
  'minecraft:noise_threshold': JsonMaterialConditionNoiseThreshold,
  'not': JsonMaterialConditionNot,
  'minecraft:not': JsonMaterialConditionNot,
  'stone_depth': JsonMaterialConditionStoneDepth,
  'minecraft:stone_depth': JsonMaterialConditionStoneDepth,
  'vertical_gradient': JsonMaterialConditionVerticalGradient,
  'minecraft:vertical_gradient': JsonMaterialConditionVerticalGradient,
  'water': JsonMaterialConditionWater,
  'minecraft:water': JsonMaterialConditionWater,
  'y_above': JsonMaterialConditionYAbove,
  'minecraft:y_above': JsonMaterialConditionYAbove,
}
type JsonMaterialConditionKeys = keyof JsonMaterialConditionDispatcherMap
type JsonMaterialConditionFallback = (
  | JsonMaterialConditionBiome
  | JsonMaterialConditionNoiseThreshold
  | JsonMaterialConditionNot
  | JsonMaterialConditionStoneDepth
  | JsonMaterialConditionVerticalGradient
  | JsonMaterialConditionWater
  | JsonMaterialConditionYAbove)
type JsonMaterialConditionBiome = JsonBiomeCondition
type JsonMaterialConditionNoiseThreshold = JsonNoiseThresholdCondition
type JsonMaterialConditionNot = JsonNotCondition
type JsonMaterialConditionStoneDepth = JsonStoneDepthCondition
type JsonMaterialConditionVerticalGradient = JsonVerticalGradientCondition
type JsonMaterialConditionWater = JsonWaterCondition
type JsonMaterialConditionYAbove = JsonYAboveCondition
export type JsonSymbolMaterialCondition<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMaterialConditionDispatcherMap
  : CASE extends 'keys' ? JsonMaterialConditionKeys : CASE extends '%fallback' ? JsonMaterialConditionFallback : never
