import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonNonEmptyWeightedList } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonNBTObject, JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat, NBTInt } from 'sandstone'

export type JsonBottomBiasHeightProvider = (JsonUniformHeightProvider & {
  /**
   * Value:
   * Range: 1..
   */
  inner?: (NBTInt<{
    min: 1,
  }> | number),
})

export type JsonCarveStep = ('air' | 'liquid')

export type JsonCaveSurface = ('floor' | 'ceiling')

export type JsonClampedIntProvider<T extends JsonNBTObject> = {
  min_inclusive: T,
  max_inclusive: T,
  source: JsonIntProvider<(NBTInt | number)>,
}

export type JsonClampedNormalIntProvider<T extends JsonNBTObject> = (JsonUniformIntProvider<T> & {
  mean: (NBTFloat | number),
  deviation: (NBTFloat | number),
})

export type JsonConstantHeightProvider = {
  value: JsonVerticalAnchor,
}

export type JsonConstantIntProvider<T extends JsonNBTObject> = {
  value: T,
}

export type JsonDecorationStep = (
  | 'raw_generation'
  | 'lakes'
  | 'local_modifications'
  | 'underground_structures'
  | 'surface_structures'
  | 'strongholds'
  | 'underground_ores'
  | 'underground_decoration'
  | 'fluid_springs'
  | 'vegetal_decoration'
  | 'top_layer_modification')

export type JsonFloatProvider<T extends JsonNBTObject> = (T | ({
  [S in Extract<Extract<JsonRegistry['minecraft:float_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolFloatProvider<T> ? JsonSymbolFloatProvider<T>[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:float_provider_type'], string>]))

export type JsonHeightmapType = (
  | 'MOTION_BLOCKING'
  | 'MOTION_BLOCKING_NO_LEAVES'
  | 'OCEAN_FLOOR'
  | 'OCEAN_FLOOR_WG'
  | 'WORLD_SURFACE'
  | 'WORLD_SURFACE_WG')

export type JsonHeightProvider = (({
  [S in Extract<Extract<JsonRegistry['minecraft:height_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolHeightProvider ? JsonSymbolHeightProvider[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:height_provider_type'], string>]) | JsonVerticalAnchor)

export type JsonIntProvider<T extends JsonNBTObject> = (T | ({
  [S in Extract<Extract<JsonRegistry['minecraft:int_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolIntProvider<T> ? JsonSymbolIntProvider<T>[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:int_provider_type'], string>]))

export type JsonTrapezoidHeightProvider = (JsonUniformHeightProvider & {
  plateau?: (NBTInt | number),
})

export type JsonUniformHeightProvider = {
  min_inclusive: JsonVerticalAnchor,
  max_inclusive: JsonVerticalAnchor,
}

export type JsonUniformInt<Base extends JsonNBTObject, Spread extends JsonNBTObject> = (Base | {
  base: Base,
  spread: Spread,
})

export type JsonUniformIntProvider<T extends JsonNBTObject> = {
  min_inclusive: T,
  max_inclusive: T,
}

export type JsonVerticalAnchor = ({
  absolute: (NBTInt | number),
} | {
  above_bottom: (NBTInt | number),
} | {
  below_top: (NBTInt | number),
} | {
  relative_to_sea_level: (NBTInt | number),
})

export type JsonWeightListHeightProvider = {
  distribution: JsonNonEmptyWeightedList<JsonHeightProvider>,
}
type JsonFloatProviderDispatcherMap<T extends JsonNBTObject> = {
  'clamped_normal': JsonFloatProviderClampedNormal<T>,
  'minecraft:clamped_normal': JsonFloatProviderClampedNormal<T>,
  'constant': JsonFloatProviderConstant<T>,
  'minecraft:constant': JsonFloatProviderConstant<T>,
  'trapezoid': JsonFloatProviderTrapezoid<T>,
  'minecraft:trapezoid': JsonFloatProviderTrapezoid<T>,
  'uniform': JsonFloatProviderUniform<T>,
  'minecraft:uniform': JsonFloatProviderUniform<T>,
}
type JsonFloatProviderKeys = keyof JsonFloatProviderDispatcherMap<JsonNBTObject>
type JsonFloatProviderFallback<T extends JsonNBTObject> = (
  | JsonFloatProviderClampedNormal<T>
  | JsonFloatProviderConstant<T>
  | JsonFloatProviderTrapezoid<T>
  | JsonFloatProviderUniform<T>)
export type JsonFloatProviderClampedNormal<T extends JsonNBTObject> = {
  min: T,
  max: T,
  mean: (NBTFloat | number),
  deviation: (NBTFloat | number),
}

export type JsonFloatProviderConstant<T extends JsonNBTObject> = {
  value: T,
}

export type JsonFloatProviderTrapezoid<T extends JsonNBTObject> = {
  min: T,
  max: T,
  plateau: (NBTFloat | number),
}

export type JsonFloatProviderUniform<T extends JsonNBTObject> = {
  min_inclusive: T,
  max_exclusive: T,
}

export type JsonSymbolFloatProvider<T extends JsonNBTObject, CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonFloatProviderDispatcherMap<T>
  : CASE extends 'keys' ? JsonFloatProviderKeys : CASE extends '%fallback' ? JsonFloatProviderFallback<T> : never
type JsonHeightProviderDispatcherMap = {
  'biased_to_bottom': JsonHeightProviderBiasedToBottom,
  'minecraft:biased_to_bottom': JsonHeightProviderBiasedToBottom,
  'constant': JsonHeightProviderConstant,
  'minecraft:constant': JsonHeightProviderConstant,
  'trapezoid': JsonHeightProviderTrapezoid,
  'minecraft:trapezoid': JsonHeightProviderTrapezoid,
  'uniform': JsonHeightProviderUniform,
  'minecraft:uniform': JsonHeightProviderUniform,
  'very_biased_to_bottom': JsonHeightProviderVeryBiasedToBottom,
  'minecraft:very_biased_to_bottom': JsonHeightProviderVeryBiasedToBottom,
  'weighted_list': JsonHeightProviderWeightedList,
  'minecraft:weighted_list': JsonHeightProviderWeightedList,
}
type JsonHeightProviderKeys = keyof JsonHeightProviderDispatcherMap
type JsonHeightProviderFallback = (
  | JsonHeightProviderBiasedToBottom
  | JsonHeightProviderConstant
  | JsonHeightProviderTrapezoid
  | JsonHeightProviderUniform
  | JsonHeightProviderVeryBiasedToBottom
  | JsonHeightProviderWeightedList)
type JsonHeightProviderBiasedToBottom = JsonBottomBiasHeightProvider
type JsonHeightProviderConstant = JsonConstantHeightProvider
type JsonHeightProviderTrapezoid = JsonTrapezoidHeightProvider
type JsonHeightProviderUniform = JsonUniformHeightProvider
type JsonHeightProviderVeryBiasedToBottom = JsonBottomBiasHeightProvider
type JsonHeightProviderWeightedList = JsonWeightListHeightProvider
export type JsonSymbolHeightProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonHeightProviderDispatcherMap
  : CASE extends 'keys' ? JsonHeightProviderKeys : CASE extends '%fallback' ? JsonHeightProviderFallback : never
type JsonIntProviderDispatcherMap<T extends JsonNBTObject> = {
  'biased_to_bottom': JsonIntProviderBiasedToBottom<T>,
  'minecraft:biased_to_bottom': JsonIntProviderBiasedToBottom<T>,
  'clamped': JsonIntProviderClamped<T>,
  'minecraft:clamped': JsonIntProviderClamped<T>,
  'clamped_normal': JsonIntProviderClampedNormal<T>,
  'minecraft:clamped_normal': JsonIntProviderClampedNormal<T>,
  'constant': JsonIntProviderConstant<T>,
  'minecraft:constant': JsonIntProviderConstant<T>,
  'trapezoid': JsonIntProviderTrapezoid<T>,
  'minecraft:trapezoid': JsonIntProviderTrapezoid<T>,
  'uniform': JsonIntProviderUniform<T>,
  'minecraft:uniform': JsonIntProviderUniform<T>,
  'very_biased_to_bottom': JsonIntProviderVeryBiasedToBottom<T>,
  'minecraft:very_biased_to_bottom': JsonIntProviderVeryBiasedToBottom<T>,
  'weighted_list': JsonIntProviderWeightedList<T>,
  'minecraft:weighted_list': JsonIntProviderWeightedList<T>,
}
type JsonIntProviderKeys = keyof JsonIntProviderDispatcherMap<JsonNBTObject>
type JsonIntProviderFallback<T extends JsonNBTObject> = (
  | JsonIntProviderBiasedToBottom<T>
  | JsonIntProviderClamped<T>
  | JsonIntProviderClampedNormal<T>
  | JsonIntProviderConstant<T>
  | JsonIntProviderTrapezoid<T>
  | JsonIntProviderUniform<T>
  | JsonIntProviderVeryBiasedToBottom<T>
  | JsonIntProviderWeightedList<T>)
export type JsonIntProviderBiasedToBottom<T extends JsonNBTObject> = JsonUniformIntProvider<T>

export type JsonIntProviderClamped<T extends JsonNBTObject> = JsonClampedIntProvider<T>

export type JsonIntProviderClampedNormal<T extends JsonNBTObject> = JsonClampedNormalIntProvider<T>

export type JsonIntProviderConstant<T extends JsonNBTObject> = JsonConstantIntProvider<T>

export type JsonIntProviderTrapezoid<T extends JsonNBTObject> = {
  min: T,
  max: T,
  plateau: (NBTInt | number),
}

export type JsonIntProviderUniform<T extends JsonNBTObject> = JsonUniformIntProvider<T>

export type JsonIntProviderVeryBiasedToBottom<T extends JsonNBTObject> = JsonUniformIntProvider<T>

export type JsonIntProviderWeightedList<T extends JsonNBTObject> = {
  distribution: JsonNonEmptyWeightedList<JsonIntProvider<T>>,
}

export type JsonSymbolIntProvider<T extends JsonNBTObject, CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonIntProviderDispatcherMap<T>
  : CASE extends 'keys' ? JsonIntProviderKeys : CASE extends '%fallback' ? JsonIntProviderFallback<T> : never
