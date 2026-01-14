import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { NonEmptyWeightedList } from 'sandstone/arguments/generated/util.ts'
import type { NBTObject, RootNBT } from 'sandstone/arguments/nbt.ts'
import type { NBTFloat, NBTInt } from 'sandstone'

export type BottomBiasHeightProvider = (UniformHeightProvider & {
  /**
   * Value:
   * Range: 1..
   */
  inner?: NBTInt<{
    min: 1
  }>
})

export type CarveStep = ('air' | 'liquid')

export type CaveSurface = ('floor' | 'ceiling')

export type ClampedIntProvider<T extends NBTObject> = {
  min_inclusive: T
  max_inclusive: T
  source: IntProvider<NBTInt>
}

export type ClampedNormalIntProvider<T extends NBTObject> = (UniformIntProvider<T> & {
  mean: NBTFloat
  deviation: NBTFloat
})

export type ConstantHeightProvider = {
  value: VerticalAnchor
}

export type ConstantIntProvider<T extends NBTObject> = {
  value: T
}

export type DecorationStep = (
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

export type FloatProvider<T extends NBTObject> = (T | ({
  [S in Extract<Registry['minecraft:float_provider_type'], string>]?: ({
    type: S
  } & (S extends keyof SymbolFloatProvider<T> ? SymbolFloatProvider<T>[S] : RootNBT));
}[Registry['minecraft:float_provider_type']]))

export type HeightmapType = (
  | 'MOTION_BLOCKING'
  | 'MOTION_BLOCKING_NO_LEAVES'
  | 'OCEAN_FLOOR'
  | 'OCEAN_FLOOR_WG'
  | 'WORLD_SURFACE'
  | 'WORLD_SURFACE_WG')

export type HeightProvider = (({
  [S in Extract<Registry['minecraft:height_provider_type'], string>]?: ({
    type: S
  } & (S extends keyof SymbolHeightProvider ? SymbolHeightProvider[S] : RootNBT));
}[Registry['minecraft:height_provider_type']]) | VerticalAnchor)

export type IntProvider<T extends NBTObject> = (T | ({
  [S in Extract<Registry['minecraft:int_provider_type'], string>]?: ({
    type: S
  } & (S extends keyof SymbolIntProvider<T> ? SymbolIntProvider<T>[S] : RootNBT));
}[Registry['minecraft:int_provider_type']]))

export type TrapezoidHeightProvider = (UniformHeightProvider & {
  plateau?: NBTInt
})

export type UniformHeightProvider = {
  min_inclusive: VerticalAnchor
  max_inclusive: VerticalAnchor
}

export type UniformInt<Base extends NBTObject, Spread extends NBTObject> = (Base | {
  base: Base
  spread: Spread
})

export type UniformIntProvider<T extends NBTObject> = {
  min_inclusive: T
  max_inclusive: T
}

export type VerticalAnchor = ({
  absolute: NBTInt
} | {
  above_bottom: NBTInt
} | {
  below_top: NBTInt
})

export type WeightListHeightProvider = {
  distribution: NonEmptyWeightedList<HeightProvider>
}
type FloatProviderDispatcherMap<T extends NBTObject> = {
  'clamped_normal': FloatProviderClampedNormal<T>
  'minecraft:clamped_normal': FloatProviderClampedNormal<T>
  'constant': FloatProviderConstant<T>
  'minecraft:constant': FloatProviderConstant<T>
  'trapezoid': FloatProviderTrapezoid<T>
  'minecraft:trapezoid': FloatProviderTrapezoid<T>
  'uniform': FloatProviderUniform<T>
  'minecraft:uniform': FloatProviderUniform<T>
}
type FloatProviderKeys = keyof FloatProviderDispatcherMap<NBTObject>
type FloatProviderFallback<T extends NBTObject> = (
  | FloatProviderClampedNormal<T>
  | FloatProviderConstant<T>
  | FloatProviderTrapezoid<T>
  | FloatProviderUniform<T>)
export type FloatProviderClampedNormal<T extends NBTObject> = {
  min: T
  max: T
  mean: NBTFloat
  deviation: NBTFloat
}

export type FloatProviderConstant<T extends NBTObject> = {
  value: T
}

export type FloatProviderTrapezoid<T extends NBTObject> = {
  min: T
  max: T
  plateau: NBTFloat
}

export type FloatProviderUniform<T extends NBTObject> = {
  min_inclusive: T
  max_exclusive: T
}

export type SymbolFloatProvider<T extends NBTObject, CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? FloatProviderDispatcherMap<T>
  : CASE extends 'keys' ? FloatProviderKeys : CASE extends '%fallback' ? FloatProviderFallback<T> : never
type HeightProviderDispatcherMap = {
  'biased_to_bottom': HeightProviderBiasedToBottom
  'minecraft:biased_to_bottom': HeightProviderBiasedToBottom
  'constant': HeightProviderConstant
  'minecraft:constant': HeightProviderConstant
  'trapezoid': HeightProviderTrapezoid
  'minecraft:trapezoid': HeightProviderTrapezoid
  'uniform': HeightProviderUniform
  'minecraft:uniform': HeightProviderUniform
  'very_biased_to_bottom': HeightProviderVeryBiasedToBottom
  'minecraft:very_biased_to_bottom': HeightProviderVeryBiasedToBottom
  'weighted_list': HeightProviderWeightedList
  'minecraft:weighted_list': HeightProviderWeightedList
}
type HeightProviderKeys = keyof HeightProviderDispatcherMap
type HeightProviderFallback = (
  | HeightProviderBiasedToBottom
  | HeightProviderConstant
  | HeightProviderTrapezoid
  | HeightProviderUniform
  | HeightProviderVeryBiasedToBottom
  | HeightProviderWeightedList)
type HeightProviderBiasedToBottom = BottomBiasHeightProvider
type HeightProviderConstant = ConstantHeightProvider
type HeightProviderTrapezoid = TrapezoidHeightProvider
type HeightProviderUniform = UniformHeightProvider
type HeightProviderVeryBiasedToBottom = BottomBiasHeightProvider
type HeightProviderWeightedList = WeightListHeightProvider
export type SymbolHeightProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? HeightProviderDispatcherMap
  : CASE extends 'keys' ? HeightProviderKeys : CASE extends '%fallback' ? HeightProviderFallback : never
type IntProviderDispatcherMap<T extends NBTObject> = {
  'biased_to_bottom': IntProviderBiasedToBottom<T>
  'minecraft:biased_to_bottom': IntProviderBiasedToBottom<T>
  'clamped': IntProviderClamped<T>
  'minecraft:clamped': IntProviderClamped<T>
  'clamped_normal': IntProviderClampedNormal<T>
  'minecraft:clamped_normal': IntProviderClampedNormal<T>
  'constant': IntProviderConstant<T>
  'minecraft:constant': IntProviderConstant<T>
  'uniform': IntProviderUniform<T>
  'minecraft:uniform': IntProviderUniform<T>
  'weighted_list': IntProviderWeightedList<T>
  'minecraft:weighted_list': IntProviderWeightedList<T>
}
type IntProviderKeys = keyof IntProviderDispatcherMap<NBTObject>
type IntProviderFallback<T extends NBTObject> = (
  | IntProviderBiasedToBottom<T>
  | IntProviderClamped<T>
  | IntProviderClampedNormal<T>
  | IntProviderConstant<T>
  | IntProviderUniform<T>
  | IntProviderWeightedList<T>)
export type IntProviderBiasedToBottom<T extends NBTObject> = UniformIntProvider<T>

export type IntProviderClamped<T extends NBTObject> = ClampedIntProvider<T>

export type IntProviderClampedNormal<T extends NBTObject> = ClampedNormalIntProvider<T>

export type IntProviderConstant<T extends NBTObject> = ConstantIntProvider<T>

export type IntProviderUniform<T extends NBTObject> = UniformIntProvider<T>

export type IntProviderWeightedList<T extends NBTObject> = {
  distribution: NonEmptyWeightedList<IntProvider<T>>
}

export type SymbolIntProvider<T extends NBTObject, CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? IntProviderDispatcherMap<T>
  : CASE extends 'keys' ? IntProviderKeys : CASE extends '%fallback' ? IntProviderFallback<T> : never
