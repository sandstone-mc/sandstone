import type { Dispatcher } from 'sandstone/arguments/generated/dispatcher'
import type { Registry } from 'sandstone/arguments/generated/registry'
import type { NBTFloat, NBTInt } from 'sandstone'

export type Clamp = {
  input: DensityFunction
  min: NoiseRange
  max: NoiseRange
}

export type Constant = {
  argument: NoiseRange
}

export type CubicSpline = (NBTFloat | {
  coordinate: DensityFunctionRef
  points: Array<SplinePoint>
})

export type DensityFunction = (NoiseRange | ({
  [S in Extract<Registry['minecraft:worldgen/density_function_type'], string>]?: ({
    type: S
  } & (S extends keyof Dispatcher<'minecraft:density_function'>
    ? Dispatcher<'minecraft:density_function'>[S]
    : Record<string, unknown>));
}[Registry['minecraft:worldgen/density_function_type']]))

export type DensityFunctionRef = (Registry['minecraft:worldgen/density_function'] | DensityFunction)

export type FindTopSurface = {
  density: DensityFunctionRef
  upper_bound: DensityFunctionRef
  /**
     * Value:
     * Range: -4064..4062
     */
  lower_bound: NBTInt<{}>
  /**
     * Value:
     * Range: 1..
     */
  cell_height: NBTInt<{
    min: 1
  }>
}

export type Noise = {
  noise: Registry['minecraft:worldgen/noise']
  xz_scale: NBTFloat
  y_scale: NBTFloat
}

/**
 * Range: -1000000..1000000
 */
export type NoiseRange = NBTFloat<{
  leftExclusive: false
  rightExclusive: false
}>

export type OldBlendedNoise = {
  xz_scale: NBTFloat
  y_scale: NBTFloat
  xz_factor: NBTFloat
  y_factor: NBTFloat
  /**
     * Value:
     * Range: 1..8
     */
  smear_scale_multiplier: NBTFloat<{
    leftExclusive: false
    rightExclusive: false
    min: 1
  }>
}

export type OneArgument = {
  argument: DensityFunctionRef
}

export type RangeChoice = {
  input: DensityFunctionRef
  min_inclusive: NoiseRange
  max_exclusive: NoiseRange
  when_in_range: DensityFunctionRef
  when_out_of_range: DensityFunctionRef
}

export type RarityType = ('type_1' | 'type_2')

export type Shift = {
  argument: Registry['minecraft:worldgen/noise']
}

export type ShiftedNoise = (Noise & {
  shift_x: DensityFunctionRef
  shift_y: DensityFunctionRef
  shift_z: DensityFunctionRef
})

export type Spline = {
  spline: CubicSpline
}

export type SplinePoint = {
  location: NBTFloat
  derivative: NBTFloat
  value: CubicSpline
}

export type SplineType = ('offset' | 'factor' | 'jaggedness')

export type TerrainCoordinate = ('continents' | 'erosion' | 'weirdness' | 'ridges')

export type TerrainShaperSpline = {
  /**
     * Value:
     *
     *  - Offset(`offset`)
     *  - Factor(`factor`)
     *  - Jaggedness(`jaggedness`)
     */
  spline: SplineType
  min_value: NoiseRange
  max_value: NoiseRange
  continentalness: DensityFunctionRef
  erosion: DensityFunctionRef
  weirdness: DensityFunctionRef
}

export type TwoArguments = {
  argument1: DensityFunctionRef
  argument2: DensityFunctionRef
}

export type WeirdScaledSampler = {
  /**
     * Value:
     *
     *  - Type1(`type_1`)
     *  - Type2(`type_2`)
     */
  rarity_value_mapper: RarityType
  noise: Registry['minecraft:worldgen/noise']
  input: DensityFunctionRef
}

export type YClampedGradient = {
  /**
     * Value:
     * Range: -4064..4062
     */
  from_y: NBTInt<{}>
  /**
     * Value:
     * Range: -4064..4062
     */
  to_y: NBTInt<{}>
  from_value: NoiseRange
  to_value: NoiseRange
}
type DensityFunctionDispatcherMap = {
  'abs': DensityFunctionAbs
  'minecraft:abs': DensityFunctionAbs
  'add': DensityFunctionAdd
  'minecraft:add': DensityFunctionAdd
  'blend_density': DensityFunctionBlendDensity
  'minecraft:blend_density': DensityFunctionBlendDensity
  'cache_2d': DensityFunctionCache2d
  'minecraft:cache_2d': DensityFunctionCache2d
  'cache_all_in_cell': DensityFunctionCacheAllInCell
  'minecraft:cache_all_in_cell': DensityFunctionCacheAllInCell
  'cache_once': DensityFunctionCacheOnce
  'minecraft:cache_once': DensityFunctionCacheOnce
  'clamp': DensityFunctionClamp
  'minecraft:clamp': DensityFunctionClamp
  'constant': DensityFunctionConstant
  'minecraft:constant': DensityFunctionConstant
  'cube': DensityFunctionCube
  'minecraft:cube': DensityFunctionCube
  'find_top_surface': DensityFunctionFindTopSurface
  'minecraft:find_top_surface': DensityFunctionFindTopSurface
  'flat_cache': DensityFunctionFlatCache
  'minecraft:flat_cache': DensityFunctionFlatCache
  'half_negative': DensityFunctionHalfNegative
  'minecraft:half_negative': DensityFunctionHalfNegative
  'interpolated': DensityFunctionInterpolated
  'minecraft:interpolated': DensityFunctionInterpolated
  'invert': DensityFunctionInvert
  'minecraft:invert': DensityFunctionInvert
  'max': DensityFunctionMax
  'minecraft:max': DensityFunctionMax
  'min': DensityFunctionMin
  'minecraft:min': DensityFunctionMin
  'mul': DensityFunctionMul
  'minecraft:mul': DensityFunctionMul
  'noise': DensityFunctionNoise
  'minecraft:noise': DensityFunctionNoise
  'old_blended_noise': DensityFunctionOldBlendedNoise
  'minecraft:old_blended_noise': DensityFunctionOldBlendedNoise
  'quarter_negative': DensityFunctionQuarterNegative
  'minecraft:quarter_negative': DensityFunctionQuarterNegative
  'range_choice': DensityFunctionRangeChoice
  'minecraft:range_choice': DensityFunctionRangeChoice
  'shift': DensityFunctionShift
  'minecraft:shift': DensityFunctionShift
  'shift_a': DensityFunctionShiftA
  'minecraft:shift_a': DensityFunctionShiftA
  'shift_b': DensityFunctionShiftB
  'minecraft:shift_b': DensityFunctionShiftB
  'shifted_noise': DensityFunctionShiftedNoise
  'minecraft:shifted_noise': DensityFunctionShiftedNoise
  'slide': DensityFunctionSlide
  'minecraft:slide': DensityFunctionSlide
  'spline': DensityFunctionSpline
  'minecraft:spline': DensityFunctionSpline
  'square': DensityFunctionSquare
  'minecraft:square': DensityFunctionSquare
  'squeeze': DensityFunctionSqueeze
  'minecraft:squeeze': DensityFunctionSqueeze
  'terrain_shaper_spline': DensityFunctionTerrainShaperSpline
  'minecraft:terrain_shaper_spline': DensityFunctionTerrainShaperSpline
  'weird_scaled_sampler': DensityFunctionWeirdScaledSampler
  'minecraft:weird_scaled_sampler': DensityFunctionWeirdScaledSampler
  'y_clamped_gradient': DensityFunctionYClampedGradient
  'minecraft:y_clamped_gradient': DensityFunctionYClampedGradient
}
type DensityFunctionKeys = keyof DensityFunctionDispatcherMap
type DensityFunctionFallback = (
  | DensityFunctionAbs
  | DensityFunctionAdd
  | DensityFunctionBlendDensity
  | DensityFunctionCache2d
  | DensityFunctionCacheAllInCell
  | DensityFunctionCacheOnce
  | DensityFunctionClamp
  | DensityFunctionConstant
  | DensityFunctionCube
  | DensityFunctionFindTopSurface
  | DensityFunctionFlatCache
  | DensityFunctionHalfNegative
  | DensityFunctionInterpolated
  | DensityFunctionInvert
  | DensityFunctionMax
  | DensityFunctionMin
  | DensityFunctionMul
  | DensityFunctionNoise
  | DensityFunctionOldBlendedNoise
  | DensityFunctionQuarterNegative
  | DensityFunctionRangeChoice
  | DensityFunctionShift
  | DensityFunctionShiftA
  | DensityFunctionShiftB
  | DensityFunctionShiftedNoise
  | DensityFunctionSlide
  | DensityFunctionSpline
  | DensityFunctionSquare
  | DensityFunctionSqueeze
  | DensityFunctionTerrainShaperSpline
  | DensityFunctionWeirdScaledSampler
  | DensityFunctionYClampedGradient)
type DensityFunctionAbs = OneArgument
type DensityFunctionAdd = TwoArguments
type DensityFunctionBlendDensity = OneArgument
type DensityFunctionCache2d = OneArgument
type DensityFunctionCacheAllInCell = OneArgument
type DensityFunctionCacheOnce = OneArgument
type DensityFunctionClamp = Clamp
type DensityFunctionConstant = Constant
type DensityFunctionCube = OneArgument
type DensityFunctionFindTopSurface = FindTopSurface
type DensityFunctionFlatCache = OneArgument
type DensityFunctionHalfNegative = OneArgument
type DensityFunctionInterpolated = OneArgument
type DensityFunctionInvert = OneArgument
type DensityFunctionMax = TwoArguments
type DensityFunctionMin = TwoArguments
type DensityFunctionMul = TwoArguments
type DensityFunctionNoise = Noise
type DensityFunctionOldBlendedNoise = OldBlendedNoise
type DensityFunctionQuarterNegative = OneArgument
type DensityFunctionRangeChoice = RangeChoice
type DensityFunctionShift = Shift
type DensityFunctionShiftA = Shift
type DensityFunctionShiftB = Shift
type DensityFunctionShiftedNoise = ShiftedNoise
type DensityFunctionSlide = OneArgument
type DensityFunctionSpline = Spline
type DensityFunctionSquare = OneArgument
type DensityFunctionSqueeze = OneArgument
type DensityFunctionTerrainShaperSpline = TerrainShaperSpline
type DensityFunctionWeirdScaledSampler = WeirdScaledSampler
type DensityFunctionYClampedGradient = YClampedGradient
export type SymbolDensityFunction<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? DensityFunctionDispatcherMap
  : CASE extends 'keys' ? DensityFunctionKeys : CASE extends '%fallback' ? DensityFunctionFallback : never
