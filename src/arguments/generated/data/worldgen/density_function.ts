import type { NoiseParameters } from 'sandstone/arguments/generated/data/worldgen/dimension/biome_source.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { Axis } from 'sandstone/arguments/generated/util/direction.ts'
import type { NBTFloat, NBTInt, NBTList } from 'sandstone'

export type Clamp = {
  input: DensityFunctionRef,
  min: NoiseRange,
  max: NoiseRange,
}

export type Constant = {
  value: NoiseRange,
}

export type CubicSpline = (NBTFloat | {
  coordinate: DensityFunctionRef,
  points: Array<SplinePoint>,
})

export type DensityFunction = (NoiseRange | ({
  [S in Extract<Extract<Registry['minecraft:worldgen/density_function_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolDensityFunction ? SymbolDensityFunction[S] : SymbolDensityFunction<'%unknown'>))
}[Extract<Registry['minecraft:worldgen/density_function_type'], string>]))

export type DensityFunctionRef = (Registry['minecraft:worldgen/density_function'] | DensityFunction)

export type DistanceMetric = ('euclidean' | 'euclidean_squared' | 'manhattan' | 'chebyshev')

export type DistanceToPoint = {
  /**
   * Value:
   * List length range: 3
   */
  point: NBTList<NBTInt, {
    leftExclusive: false,
    rightExclusive: false,
    min: 3,
    max: 3,
  }>,
  /**
   * Value:
   *
   *  - Euclidean(`euclidean`): `sqrt(dx^2 + dy^2 + dz^2)`
   *  - EuclideanSquared(`euclidean_squared`): `dx^2 + dy^2 + dz^2`
   *  - Manhattan(`manhattan`): `abs(dx) + abs(dy) + abs(dz)`
   *  - Chebyshev(`chebyshev`): `max(abs(dx), abs(dy), abs(dz))`
   */
  metric: DistanceMetric,
}

export type FindTopSurface = {
  density: DensityFunctionRef,
  upper_bound: DensityFunctionRef,
  /**
   * Value:
   * Range: -4064..4062
   */
  lower_bound: NBTInt<{}>,
  /**
   * Value:
   * Range: 1..
   */
  cell_height: NBTInt<{
    min: 1,
  }>,
}

export type Gradient = {
  /**
   * Value:
   *
   *  - X(`x`)
   *  - Y(`y`)
   *  - Z(`z`)
   */
  axis: Axis,
  /**
   * Defaults to `clamp_to_edge`.
   *
   * Value:
   *
   *  - ClampToEdge(`clamp_to_edge`)
   *  - Repeat(`repeat`)
   *  - MirroredRepeat(`mirrored_repeat`)
   */
  tiling?: TilingMode,
  from_coordinate: NBTInt,
  to_coordinate: NBTInt,
  from_value: NoiseRange,
  to_value: NoiseRange,
}

export type InvervalSelect = {
  input: DensityFunctionRef,
  /**
   * Must have exactly one fewer element than `functions`.
   *
   * Value:
   * List length range: 1..
   */
  thresholds: NBTList<NoiseRange, {
    leftExclusive: false,
    min: 1,
  }>,
  /**
   * Must have exactly one more element than `thresholds`.
   *
   * Value:
   * List length range: 2..
   */
  functions: NBTList<DensityFunctionRef, {
    leftExclusive: false,
    min: 1,
  }>,
}

export type Lerp = {
  alpha: DensityFunctionRef,
  first: DensityFunctionRef,
  second: DensityFunctionRef,
}

export type Noise = {
  noise: NoiseParametersRef,
  xz_scale: NBTFloat,
  y_scale: NBTFloat,
}

export type NoiseParametersRef = (Registry['minecraft:worldgen/noise'] | NoiseParameters)

/**
 * Range: -1000000..1000000
 */
export type NoiseRange = NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
}>

export type OldBlendedNoise = {
  xz_scale: NBTFloat,
  y_scale: NBTFloat,
  xz_factor: NBTFloat,
  y_factor: NBTFloat,
  /**
   * Value:
   * Range: 1..8
   */
  smear_scale_multiplier: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 1,
  }>,
}

export type OneArgument = {
  input: DensityFunctionRef,
}

export type Pow = {
  base: DensityFunctionRef,
  exponent: DensityFunctionRef,
}

export type RangeChoice = {
  input: DensityFunctionRef,
  min_inclusive: NoiseRange,
  max_exclusive: NoiseRange,
  when_in_range: DensityFunctionRef,
  when_out_of_range: DensityFunctionRef,
}

export type RarityType = ('type_1' | 'type_2')

export type Round = {
  input: DensityFunctionRef,
  /**
   * Defaults to constant 1.
   */
  multiple?: DensityFunctionRef,
}

export type Shift = {
  noise: NoiseParametersRef,
}

export type ShiftedNoise = (Noise & {
  shift_x: DensityFunctionRef,
  shift_y: DensityFunctionRef,
  shift_z: DensityFunctionRef,
})

export type Slice = {
  /**
   * Value:
   *
   *  - X(`x`)
   *  - Y(`y`)
   *  - Z(`z`)
   */
  axis: Axis,
  coordinate: NBTInt,
  input: DensityFunctionRef,
}

export type Spline = {
  spline: CubicSpline,
}

export type SplinePoint = {
  location: NBTFloat,
  derivative: NBTFloat,
  value: CubicSpline,
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
  spline: SplineType,
  min_value: NoiseRange,
  max_value: NoiseRange,
  continentalness: DensityFunctionRef,
  erosion: DensityFunctionRef,
  weirdness: DensityFunctionRef,
}

export type TilingMode = ('clamp_to_edge' | 'repeat' | 'mirrored_repeat')

export type TwoArguments = {
  left: DensityFunctionRef,
  right: DensityFunctionRef,
}

export type WeirdScaledSampler = {
  /**
   * Value:
   *
   *  - Type1(`type_1`)
   *  - Type2(`type_2`)
   */
  rarity_value_mapper: RarityType,
  noise: NoiseParametersRef,
  input: DensityFunctionRef,
}

export type YClampedGradient = {
  /**
   * Value:
   * Range: -4064..4062
   */
  from_y: NBTInt<{}>,
  /**
   * Value:
   * Range: -4064..4062
   */
  to_y: NBTInt<{}>,
  from_value: NoiseRange,
  to_value: NoiseRange,
}
type DensityFunctionDispatcherMap = {
  'abs': DensityFunctionAbs,
  'minecraft:abs': DensityFunctionAbs,
  'add': DensityFunctionAdd,
  'minecraft:add': DensityFunctionAdd,
  'blend_density': DensityFunctionBlendDensity,
  'minecraft:blend_density': DensityFunctionBlendDensity,
  'cache_2d': DensityFunctionCache2d,
  'minecraft:cache_2d': DensityFunctionCache2d,
  'cache_all_in_cell': DensityFunctionCacheAllInCell,
  'minecraft:cache_all_in_cell': DensityFunctionCacheAllInCell,
  'cache_once': DensityFunctionCacheOnce,
  'minecraft:cache_once': DensityFunctionCacheOnce,
  'ceil': DensityFunctionCeil,
  'minecraft:ceil': DensityFunctionCeil,
  'clamp': DensityFunctionClamp,
  'minecraft:clamp': DensityFunctionClamp,
  'constant': DensityFunctionConstant,
  'minecraft:constant': DensityFunctionConstant,
  'cube': DensityFunctionCube,
  'minecraft:cube': DensityFunctionCube,
  'distance_to_point': DensityFunctionDistanceToPoint,
  'minecraft:distance_to_point': DensityFunctionDistanceToPoint,
  'div': DensityFunctionDiv,
  'minecraft:div': DensityFunctionDiv,
  'find_top_surface': DensityFunctionFindTopSurface,
  'minecraft:find_top_surface': DensityFunctionFindTopSurface,
  'flat_cache': DensityFunctionFlatCache,
  'minecraft:flat_cache': DensityFunctionFlatCache,
  'floor': DensityFunctionFloor,
  'minecraft:floor': DensityFunctionFloor,
  'gradient': DensityFunctionGradient,
  'minecraft:gradient': DensityFunctionGradient,
  'half_negative': DensityFunctionHalfNegative,
  'minecraft:half_negative': DensityFunctionHalfNegative,
  'interpolated': DensityFunctionInterpolated,
  'minecraft:interpolated': DensityFunctionInterpolated,
  'interval_select': DensityFunctionIntervalSelect,
  'minecraft:interval_select': DensityFunctionIntervalSelect,
  'lerp': DensityFunctionLerp,
  'minecraft:lerp': DensityFunctionLerp,
  'log': DensityFunctionLog,
  'minecraft:log': DensityFunctionLog,
  'max': DensityFunctionMax,
  'minecraft:max': DensityFunctionMax,
  'min': DensityFunctionMin,
  'minecraft:min': DensityFunctionMin,
  'mul': DensityFunctionMul,
  'minecraft:mul': DensityFunctionMul,
  'negate': DensityFunctionNegate,
  'minecraft:negate': DensityFunctionNegate,
  'noise': DensityFunctionNoise,
  'minecraft:noise': DensityFunctionNoise,
  'old_blended_noise': DensityFunctionOldBlendedNoise,
  'minecraft:old_blended_noise': DensityFunctionOldBlendedNoise,
  'pow': DensityFunctionPow,
  'minecraft:pow': DensityFunctionPow,
  'quarter_negative': DensityFunctionQuarterNegative,
  'minecraft:quarter_negative': DensityFunctionQuarterNegative,
  'range_choice': DensityFunctionRangeChoice,
  'minecraft:range_choice': DensityFunctionRangeChoice,
  'reciprocal': DensityFunctionReciprocal,
  'minecraft:reciprocal': DensityFunctionReciprocal,
  'round': DensityFunctionRound,
  'minecraft:round': DensityFunctionRound,
  'shift': DensityFunctionShift,
  'minecraft:shift': DensityFunctionShift,
  'shift_a': DensityFunctionShiftA,
  'minecraft:shift_a': DensityFunctionShiftA,
  'shift_b': DensityFunctionShiftB,
  'minecraft:shift_b': DensityFunctionShiftB,
  'shifted_noise': DensityFunctionShiftedNoise,
  'minecraft:shifted_noise': DensityFunctionShiftedNoise,
  'sign': DensityFunctionSign,
  'minecraft:sign': DensityFunctionSign,
  'slice': DensityFunctionSlice,
  'minecraft:slice': DensityFunctionSlice,
  'slide': DensityFunctionSlide,
  'minecraft:slide': DensityFunctionSlide,
  'spline': DensityFunctionSpline,
  'minecraft:spline': DensityFunctionSpline,
  'sqrt': DensityFunctionSqrt,
  'minecraft:sqrt': DensityFunctionSqrt,
  'square': DensityFunctionSquare,
  'minecraft:square': DensityFunctionSquare,
  'squeeze': DensityFunctionSqueeze,
  'minecraft:squeeze': DensityFunctionSqueeze,
  'sub': DensityFunctionSub,
  'minecraft:sub': DensityFunctionSub,
  'truncate': DensityFunctionTruncate,
  'minecraft:truncate': DensityFunctionTruncate,
}
type DensityFunctionKeys = keyof DensityFunctionDispatcherMap
type DensityFunctionFallback = (
  | DensityFunctionAbs
  | DensityFunctionAdd
  | DensityFunctionBlendDensity
  | DensityFunctionCache2d
  | DensityFunctionCacheAllInCell
  | DensityFunctionCacheOnce
  | DensityFunctionCeil
  | DensityFunctionClamp
  | DensityFunctionConstant
  | DensityFunctionCube
  | DensityFunctionDistanceToPoint
  | DensityFunctionDiv
  | DensityFunctionFindTopSurface
  | DensityFunctionFlatCache
  | DensityFunctionFloor
  | DensityFunctionGradient
  | DensityFunctionHalfNegative
  | DensityFunctionInterpolated
  | DensityFunctionIntervalSelect
  | DensityFunctionLerp
  | DensityFunctionLog
  | DensityFunctionMax
  | DensityFunctionMin
  | DensityFunctionMul
  | DensityFunctionNegate
  | DensityFunctionNoise
  | DensityFunctionOldBlendedNoise
  | DensityFunctionPow
  | DensityFunctionQuarterNegative
  | DensityFunctionRangeChoice
  | DensityFunctionReciprocal
  | DensityFunctionRound
  | DensityFunctionShift
  | DensityFunctionShiftA
  | DensityFunctionShiftB
  | DensityFunctionShiftedNoise
  | DensityFunctionSign
  | DensityFunctionSlice
  | DensityFunctionSlide
  | DensityFunctionSpline
  | DensityFunctionSqrt
  | DensityFunctionSquare
  | DensityFunctionSqueeze
  | DensityFunctionSub
  | DensityFunctionTruncate
  | DensityFunctionFallbackType)
export type DensityFunctionFallbackType = Record<string, never>
type DensityFunctionAbs = OneArgument
type DensityFunctionAdd = TwoArguments
type DensityFunctionBlendDensity = OneArgument
type DensityFunctionCache2d = OneArgument
type DensityFunctionCacheAllInCell = OneArgument
type DensityFunctionCacheOnce = OneArgument
type DensityFunctionCeil = Round
type DensityFunctionClamp = Clamp
type DensityFunctionConstant = Constant
type DensityFunctionCube = OneArgument
type DensityFunctionDistanceToPoint = DistanceToPoint
type DensityFunctionDiv = TwoArguments
type DensityFunctionFindTopSurface = FindTopSurface
type DensityFunctionFlatCache = OneArgument
type DensityFunctionFloor = Round
type DensityFunctionGradient = Gradient
type DensityFunctionHalfNegative = OneArgument
type DensityFunctionInterpolated = OneArgument
type DensityFunctionIntervalSelect = InvervalSelect
type DensityFunctionLerp = Lerp
type DensityFunctionLog = OneArgument
type DensityFunctionMax = TwoArguments
type DensityFunctionMin = TwoArguments
type DensityFunctionMul = TwoArguments
type DensityFunctionNegate = OneArgument
type DensityFunctionNoise = Noise
type DensityFunctionOldBlendedNoise = OldBlendedNoise
type DensityFunctionPow = Pow
type DensityFunctionQuarterNegative = OneArgument
type DensityFunctionRangeChoice = RangeChoice
type DensityFunctionReciprocal = OneArgument
type DensityFunctionRound = Round
type DensityFunctionShift = Shift
type DensityFunctionShiftA = Shift
type DensityFunctionShiftB = Shift
type DensityFunctionShiftedNoise = ShiftedNoise
type DensityFunctionSign = OneArgument
type DensityFunctionSlice = Slice
type DensityFunctionSlide = OneArgument
type DensityFunctionSpline = Spline
type DensityFunctionSqrt = OneArgument
type DensityFunctionSquare = OneArgument
type DensityFunctionSqueeze = OneArgument
type DensityFunctionSub = TwoArguments
type DensityFunctionTruncate = Round
export type SymbolDensityFunction<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? DensityFunctionDispatcherMap
  : CASE extends 'keys'
    ? DensityFunctionKeys
    : CASE extends '%fallback'
      ? DensityFunctionFallback
      : CASE extends '%unknown' ? DensityFunctionFallbackType : never
