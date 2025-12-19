import type { Dispatcher } from 'sandstone/generated/dispatcher'
import type { Registry } from 'sandstone/generated/registry'
import type { NonEmptyWeightedList } from 'sandstone/generated/util'
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

export type ClampedIntProvider<T> = {
    min_inclusive: T
    max_inclusive: T
    source: IntProvider<NBTInt>
}

export type ClampedNormalIntProvider<T> = (UniformIntProvider<T> & {
    mean: NBTFloat
    deviation: NBTFloat
})

export type ConstantHeightProvider = {
    value: VerticalAnchor
}

export type ConstantIntProvider<T> = {
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

export type FloatProvider<T> = (T | ({
    [S in Extract<Registry['minecraft:float_provider_type'], string>]?: ({
        type: S
    } & (S extends keyof Dispatcher<'minecraft:float_provider', [
        T,
    ]> ? Dispatcher<'minecraft:float_provider', [
            T,
        ]>[S] : Record<string, unknown>));
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
    } & (S extends keyof Dispatcher<'minecraft:height_provider'>
        ? Dispatcher<'minecraft:height_provider'>[S]
        : Record<string, unknown>));
}[Registry['minecraft:height_provider_type']]) | VerticalAnchor)

export type IntProvider<T> = (T | ({
    [S in Extract<Registry['minecraft:int_provider_type'], string>]?: ({
        type: S
    } & (S extends keyof Dispatcher<'minecraft:int_provider', [
        T,
    ]> ? Dispatcher<'minecraft:int_provider', [
            T,
        ]>[S] : Record<string, unknown>));
}[Registry['minecraft:int_provider_type']]))

export type TrapezoidHeightProvider = (UniformHeightProvider & {
    plateau?: NBTInt
})

export type UniformHeightProvider = {
    min_inclusive: VerticalAnchor
    max_inclusive: VerticalAnchor
}

export type UniformInt<Base, Spread> = (Base | {
    base: Base
    spread: Spread
})

export type UniformIntProvider<T> = {
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
type FloatProviderDispatcherMap<T> = {
    'clamped_normal': FloatProviderClampedNormal<T>
    'minecraft:clamped_normal': FloatProviderClampedNormal<T>
    'constant': FloatProviderConstant<T>
    'minecraft:constant': FloatProviderConstant<T>
    'trapezoid': FloatProviderTrapezoid<T>
    'minecraft:trapezoid': FloatProviderTrapezoid<T>
    'uniform': FloatProviderUniform<T>
    'minecraft:uniform': FloatProviderUniform<T>
}
type FloatProviderKeys = keyof FloatProviderDispatcherMap<unknown>
type FloatProviderFallback<T> = (
    | FloatProviderClampedNormal<T>
    | FloatProviderConstant<T>
    | FloatProviderTrapezoid<T>
    | FloatProviderUniform<T>)
export type FloatProviderClampedNormal<T> = {
    min: T
    max: T
    mean: NBTFloat
    deviation: NBTFloat
}

export type FloatProviderConstant<T> = {
    value: T
}

export type FloatProviderTrapezoid<T> = {
    min: T
    max: T
    plateau: NBTFloat
}

export type FloatProviderUniform<T> = {
    min_inclusive: T
    max_exclusive: T
}

export type SymbolFloatProvider<T, CASE extends
    | 'map'
    | 'keys'
    | '%fallback'
    | '%none' = 'map'> = CASE extends 'map'
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
    | '%none' = 'map'> = CASE extends 'map'
    ? HeightProviderDispatcherMap
    : CASE extends 'keys' ? HeightProviderKeys : CASE extends '%fallback' ? HeightProviderFallback : never
type IntProviderDispatcherMap<T> = {
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
type IntProviderKeys = keyof IntProviderDispatcherMap<unknown>
type IntProviderFallback<T> = (
    | IntProviderBiasedToBottom<T>
    | IntProviderClamped<T>
    | IntProviderClampedNormal<T>
    | IntProviderConstant<T>
    | IntProviderUniform<T>
    | IntProviderWeightedList<T>)
export type IntProviderBiasedToBottom<T> = UniformIntProvider<T>

export type IntProviderClamped<T> = ClampedIntProvider<T>

export type IntProviderClampedNormal<T> = ClampedNormalIntProvider<T>

export type IntProviderConstant<T> = ConstantIntProvider<T>

export type IntProviderUniform<T> = UniformIntProvider<T>

export type IntProviderWeightedList<T> = {
    distribution: NonEmptyWeightedList<IntProvider<T>>
}

export type SymbolIntProvider<T, CASE extends
    | 'map'
    | 'keys'
    | '%fallback'
    | '%none' = 'map'> = CASE extends 'map'
    ? IntProviderDispatcherMap<T>
    : CASE extends 'keys' ? IntProviderKeys : CASE extends '%fallback' ? IntProviderFallback<T> : never
