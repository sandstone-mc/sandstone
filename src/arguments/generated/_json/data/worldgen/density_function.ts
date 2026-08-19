import type { JsonNoiseParameters } from 'sandstone/arguments/generated/_json/data/worldgen/dimension/biome_source.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonAxis } from 'sandstone/arguments/generated/_json/util/direction.ts'
import type { JsonNBTList, NBTFloat, NBTInt } from 'sandstone'

export type JsonClamp = {
  input: JsonDensityFunctionRef,
  min: JsonNoiseRange,
  max: JsonNoiseRange,
}

export type JsonConstant = {
  value: JsonNoiseRange,
}

export type JsonCubicSpline = ((NBTFloat | number) | {
  coordinate: JsonDensityFunctionRef,
  points: Array<JsonSplinePoint>,
})

export type JsonDensityFunction = (JsonNoiseRange | ({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/density_function_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolDensityFunction
    ? JsonSymbolDensityFunction[S]
    : JsonSymbolDensityFunction<'%unknown'>))
}[Extract<JsonRegistry['minecraft:worldgen/density_function_type'], string>]))

export type JsonDensityFunctionRef = (JsonRegistry['minecraft:worldgen/density_function'] | JsonDensityFunction)

export type JsonDistanceMetric = ('euclidean' | 'euclidean_squared' | 'manhattan' | 'chebyshev')

export type JsonDistanceToPoint = {
  /**
   * Value:
   * List length range: 3
   */
  point: JsonNBTList<(NBTInt | number), {
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
  metric: JsonDistanceMetric,
}

export type JsonFindTopSurface = {
  density: JsonDensityFunctionRef,
  upper_bound: JsonDensityFunctionRef,
  /**
   * Value:
   * Range: -4064..4062
   */
  lower_bound: (NBTInt<{}> | number),
  /**
   * Value:
   * Range: 1..
   */
  cell_height: (NBTInt<{
    min: 1,
  }> | number),
}

export type JsonGradient = {
  /**
   * Value:
   *
   *  - X(`x`)
   *  - Y(`y`)
   *  - Z(`z`)
   */
  axis: JsonAxis,
  /**
   * Defaults to `clamp_to_edge`.
   *
   * Value:
   *
   *  - ClampToEdge(`clamp_to_edge`)
   *  - Repeat(`repeat`)
   *  - MirroredRepeat(`mirrored_repeat`)
   */
  tiling?: JsonTilingMode,
  from_coordinate: (NBTInt | number),
  to_coordinate: (NBTInt | number),
  from_value: JsonNoiseRange,
  to_value: JsonNoiseRange,
}

export type JsonInvervalSelect = {
  input: JsonDensityFunctionRef,
  /**
   * Must have exactly one fewer element than `functions`.
   *
   * Value:
   * List length range: 1..
   */
  thresholds: JsonNBTList<JsonNoiseRange, {
    leftExclusive: false,
    min: 1,
  }>,
  /**
   * Must have exactly one more element than `thresholds`.
   *
   * Value:
   * List length range: 2..
   */
  functions: JsonNBTList<JsonDensityFunctionRef, {
    leftExclusive: false,
    min: 1,
  }>,
}

export type JsonLerp = {
  alpha: JsonDensityFunctionRef,
  first: JsonDensityFunctionRef,
  second: JsonDensityFunctionRef,
}

export type JsonNoise = {
  noise: JsonNoiseParametersRef,
  xz_scale: (NBTFloat | number),
  y_scale: (NBTFloat | number),
}

export type JsonNoiseParametersRef = (JsonRegistry['minecraft:worldgen/noise'] | JsonNoiseParameters)

/**
 * Range: -1000000..1000000
 */
export type JsonNoiseRange = (NBTFloat<{
  leftExclusive: false,
  rightExclusive: false,
}> | number)

export type JsonOldBlendedNoise = {
  xz_scale: (NBTFloat | number),
  y_scale: (NBTFloat | number),
  xz_factor: (NBTFloat | number),
  y_factor: (NBTFloat | number),
  /**
   * Value:
   * Range: 1..8
   */
  smear_scale_multiplier: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 1,
  }> | number),
}

export type JsonOneArgument = {
  input: JsonDensityFunctionRef,
}

export type JsonPow = {
  base: JsonDensityFunctionRef,
  exponent: JsonDensityFunctionRef,
}

export type JsonRangeChoice = {
  input: JsonDensityFunctionRef,
  min_inclusive: JsonNoiseRange,
  max_exclusive: JsonNoiseRange,
  when_in_range: JsonDensityFunctionRef,
  when_out_of_range: JsonDensityFunctionRef,
}

export type JsonRarityType = ('type_1' | 'type_2')

export type JsonRound = {
  input: JsonDensityFunctionRef,
  /**
   * Defaults to constant 1.
   */
  multiple?: JsonDensityFunctionRef,
}

export type JsonShift = {
  noise: JsonNoiseParametersRef,
}

export type JsonShiftedNoise = (JsonNoise & {
  shift_x: JsonDensityFunctionRef,
  shift_y: JsonDensityFunctionRef,
  shift_z: JsonDensityFunctionRef,
})

export type JsonSlice = {
  /**
   * Value:
   *
   *  - X(`x`)
   *  - Y(`y`)
   *  - Z(`z`)
   */
  axis: JsonAxis,
  coordinate: (NBTInt | number),
  input: JsonDensityFunctionRef,
}

export type JsonSpline = {
  spline: JsonCubicSpline,
}

export type JsonSplinePoint = {
  location: (NBTFloat | number),
  derivative: (NBTFloat | number),
  value: JsonCubicSpline,
}

export type JsonSplineType = ('offset' | 'factor' | 'jaggedness')

export type JsonTerrainCoordinate = ('continents' | 'erosion' | 'weirdness' | 'ridges')

export type JsonTerrainShaperSpline = {
  /**
   * Value:
   *
   *  - Offset(`offset`)
   *  - Factor(`factor`)
   *  - Jaggedness(`jaggedness`)
   */
  spline: JsonSplineType,
  min_value: JsonNoiseRange,
  max_value: JsonNoiseRange,
  continentalness: JsonDensityFunctionRef,
  erosion: JsonDensityFunctionRef,
  weirdness: JsonDensityFunctionRef,
}

export type JsonTilingMode = ('clamp_to_edge' | 'repeat' | 'mirrored_repeat')

export type JsonTwoArguments = {
  left: JsonDensityFunctionRef,
  right: JsonDensityFunctionRef,
}

export type JsonWeirdScaledSampler = {
  /**
   * Value:
   *
   *  - Type1(`type_1`)
   *  - Type2(`type_2`)
   */
  rarity_value_mapper: JsonRarityType,
  noise: JsonNoiseParametersRef,
  input: JsonDensityFunctionRef,
}

export type JsonYClampedGradient = {
  /**
   * Value:
   * Range: -4064..4062
   */
  from_y: (NBTInt<{}> | number),
  /**
   * Value:
   * Range: -4064..4062
   */
  to_y: (NBTInt<{}> | number),
  from_value: JsonNoiseRange,
  to_value: JsonNoiseRange,
}
type JsonDensityFunctionDispatcherMap = {
  'abs': JsonDensityFunctionAbs,
  'minecraft:abs': JsonDensityFunctionAbs,
  'add': JsonDensityFunctionAdd,
  'minecraft:add': JsonDensityFunctionAdd,
  'blend_density': JsonDensityFunctionBlendDensity,
  'minecraft:blend_density': JsonDensityFunctionBlendDensity,
  'cache_2d': JsonDensityFunctionCache2d,
  'minecraft:cache_2d': JsonDensityFunctionCache2d,
  'cache_all_in_cell': JsonDensityFunctionCacheAllInCell,
  'minecraft:cache_all_in_cell': JsonDensityFunctionCacheAllInCell,
  'cache_once': JsonDensityFunctionCacheOnce,
  'minecraft:cache_once': JsonDensityFunctionCacheOnce,
  'ceil': JsonDensityFunctionCeil,
  'minecraft:ceil': JsonDensityFunctionCeil,
  'clamp': JsonDensityFunctionClamp,
  'minecraft:clamp': JsonDensityFunctionClamp,
  'constant': JsonDensityFunctionConstant,
  'minecraft:constant': JsonDensityFunctionConstant,
  'cube': JsonDensityFunctionCube,
  'minecraft:cube': JsonDensityFunctionCube,
  'distance_to_point': JsonDensityFunctionDistanceToPoint,
  'minecraft:distance_to_point': JsonDensityFunctionDistanceToPoint,
  'div': JsonDensityFunctionDiv,
  'minecraft:div': JsonDensityFunctionDiv,
  'find_top_surface': JsonDensityFunctionFindTopSurface,
  'minecraft:find_top_surface': JsonDensityFunctionFindTopSurface,
  'flat_cache': JsonDensityFunctionFlatCache,
  'minecraft:flat_cache': JsonDensityFunctionFlatCache,
  'floor': JsonDensityFunctionFloor,
  'minecraft:floor': JsonDensityFunctionFloor,
  'gradient': JsonDensityFunctionGradient,
  'minecraft:gradient': JsonDensityFunctionGradient,
  'half_negative': JsonDensityFunctionHalfNegative,
  'minecraft:half_negative': JsonDensityFunctionHalfNegative,
  'interpolated': JsonDensityFunctionInterpolated,
  'minecraft:interpolated': JsonDensityFunctionInterpolated,
  'interval_select': JsonDensityFunctionIntervalSelect,
  'minecraft:interval_select': JsonDensityFunctionIntervalSelect,
  'lerp': JsonDensityFunctionLerp,
  'minecraft:lerp': JsonDensityFunctionLerp,
  'log': JsonDensityFunctionLog,
  'minecraft:log': JsonDensityFunctionLog,
  'max': JsonDensityFunctionMax,
  'minecraft:max': JsonDensityFunctionMax,
  'min': JsonDensityFunctionMin,
  'minecraft:min': JsonDensityFunctionMin,
  'mul': JsonDensityFunctionMul,
  'minecraft:mul': JsonDensityFunctionMul,
  'negate': JsonDensityFunctionNegate,
  'minecraft:negate': JsonDensityFunctionNegate,
  'noise': JsonDensityFunctionNoise,
  'minecraft:noise': JsonDensityFunctionNoise,
  'old_blended_noise': JsonDensityFunctionOldBlendedNoise,
  'minecraft:old_blended_noise': JsonDensityFunctionOldBlendedNoise,
  'pow': JsonDensityFunctionPow,
  'minecraft:pow': JsonDensityFunctionPow,
  'quarter_negative': JsonDensityFunctionQuarterNegative,
  'minecraft:quarter_negative': JsonDensityFunctionQuarterNegative,
  'range_choice': JsonDensityFunctionRangeChoice,
  'minecraft:range_choice': JsonDensityFunctionRangeChoice,
  'reciprocal': JsonDensityFunctionReciprocal,
  'minecraft:reciprocal': JsonDensityFunctionReciprocal,
  'round': JsonDensityFunctionRound,
  'minecraft:round': JsonDensityFunctionRound,
  'shift': JsonDensityFunctionShift,
  'minecraft:shift': JsonDensityFunctionShift,
  'shift_a': JsonDensityFunctionShiftA,
  'minecraft:shift_a': JsonDensityFunctionShiftA,
  'shift_b': JsonDensityFunctionShiftB,
  'minecraft:shift_b': JsonDensityFunctionShiftB,
  'shifted_noise': JsonDensityFunctionShiftedNoise,
  'minecraft:shifted_noise': JsonDensityFunctionShiftedNoise,
  'sign': JsonDensityFunctionSign,
  'minecraft:sign': JsonDensityFunctionSign,
  'slice': JsonDensityFunctionSlice,
  'minecraft:slice': JsonDensityFunctionSlice,
  'slide': JsonDensityFunctionSlide,
  'minecraft:slide': JsonDensityFunctionSlide,
  'spline': JsonDensityFunctionSpline,
  'minecraft:spline': JsonDensityFunctionSpline,
  'sqrt': JsonDensityFunctionSqrt,
  'minecraft:sqrt': JsonDensityFunctionSqrt,
  'square': JsonDensityFunctionSquare,
  'minecraft:square': JsonDensityFunctionSquare,
  'squeeze': JsonDensityFunctionSqueeze,
  'minecraft:squeeze': JsonDensityFunctionSqueeze,
  'sub': JsonDensityFunctionSub,
  'minecraft:sub': JsonDensityFunctionSub,
  'truncate': JsonDensityFunctionTruncate,
  'minecraft:truncate': JsonDensityFunctionTruncate,
}
type JsonDensityFunctionKeys = keyof JsonDensityFunctionDispatcherMap
type JsonDensityFunctionFallback = (
  | JsonDensityFunctionAbs
  | JsonDensityFunctionAdd
  | JsonDensityFunctionBlendDensity
  | JsonDensityFunctionCache2d
  | JsonDensityFunctionCacheAllInCell
  | JsonDensityFunctionCacheOnce
  | JsonDensityFunctionCeil
  | JsonDensityFunctionClamp
  | JsonDensityFunctionConstant
  | JsonDensityFunctionCube
  | JsonDensityFunctionDistanceToPoint
  | JsonDensityFunctionDiv
  | JsonDensityFunctionFindTopSurface
  | JsonDensityFunctionFlatCache
  | JsonDensityFunctionFloor
  | JsonDensityFunctionGradient
  | JsonDensityFunctionHalfNegative
  | JsonDensityFunctionInterpolated
  | JsonDensityFunctionIntervalSelect
  | JsonDensityFunctionLerp
  | JsonDensityFunctionLog
  | JsonDensityFunctionMax
  | JsonDensityFunctionMin
  | JsonDensityFunctionMul
  | JsonDensityFunctionNegate
  | JsonDensityFunctionNoise
  | JsonDensityFunctionOldBlendedNoise
  | JsonDensityFunctionPow
  | JsonDensityFunctionQuarterNegative
  | JsonDensityFunctionRangeChoice
  | JsonDensityFunctionReciprocal
  | JsonDensityFunctionRound
  | JsonDensityFunctionShift
  | JsonDensityFunctionShiftA
  | JsonDensityFunctionShiftB
  | JsonDensityFunctionShiftedNoise
  | JsonDensityFunctionSign
  | JsonDensityFunctionSlice
  | JsonDensityFunctionSlide
  | JsonDensityFunctionSpline
  | JsonDensityFunctionSqrt
  | JsonDensityFunctionSquare
  | JsonDensityFunctionSqueeze
  | JsonDensityFunctionSub
  | JsonDensityFunctionTruncate
  | JsonDensityFunctionFallbackType)
export type JsonDensityFunctionFallbackType = Record<string, never>
type JsonDensityFunctionAbs = JsonOneArgument
type JsonDensityFunctionAdd = JsonTwoArguments
type JsonDensityFunctionBlendDensity = JsonOneArgument
type JsonDensityFunctionCache2d = JsonOneArgument
type JsonDensityFunctionCacheAllInCell = JsonOneArgument
type JsonDensityFunctionCacheOnce = JsonOneArgument
type JsonDensityFunctionCeil = JsonRound
type JsonDensityFunctionClamp = JsonClamp
type JsonDensityFunctionConstant = JsonConstant
type JsonDensityFunctionCube = JsonOneArgument
type JsonDensityFunctionDistanceToPoint = JsonDistanceToPoint
type JsonDensityFunctionDiv = JsonTwoArguments
type JsonDensityFunctionFindTopSurface = JsonFindTopSurface
type JsonDensityFunctionFlatCache = JsonOneArgument
type JsonDensityFunctionFloor = JsonRound
type JsonDensityFunctionGradient = JsonGradient
type JsonDensityFunctionHalfNegative = JsonOneArgument
type JsonDensityFunctionInterpolated = JsonOneArgument
type JsonDensityFunctionIntervalSelect = JsonInvervalSelect
type JsonDensityFunctionLerp = JsonLerp
type JsonDensityFunctionLog = JsonOneArgument
type JsonDensityFunctionMax = JsonTwoArguments
type JsonDensityFunctionMin = JsonTwoArguments
type JsonDensityFunctionMul = JsonTwoArguments
type JsonDensityFunctionNegate = JsonOneArgument
type JsonDensityFunctionNoise = JsonNoise
type JsonDensityFunctionOldBlendedNoise = JsonOldBlendedNoise
type JsonDensityFunctionPow = JsonPow
type JsonDensityFunctionQuarterNegative = JsonOneArgument
type JsonDensityFunctionRangeChoice = JsonRangeChoice
type JsonDensityFunctionReciprocal = JsonOneArgument
type JsonDensityFunctionRound = JsonRound
type JsonDensityFunctionShift = JsonShift
type JsonDensityFunctionShiftA = JsonShift
type JsonDensityFunctionShiftB = JsonShift
type JsonDensityFunctionShiftedNoise = JsonShiftedNoise
type JsonDensityFunctionSign = JsonOneArgument
type JsonDensityFunctionSlice = JsonSlice
type JsonDensityFunctionSlide = JsonOneArgument
type JsonDensityFunctionSpline = JsonSpline
type JsonDensityFunctionSqrt = JsonOneArgument
type JsonDensityFunctionSquare = JsonOneArgument
type JsonDensityFunctionSqueeze = JsonOneArgument
type JsonDensityFunctionSub = JsonTwoArguments
type JsonDensityFunctionTruncate = JsonRound
export type JsonSymbolDensityFunction<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonDensityFunctionDispatcherMap
  : CASE extends 'keys'
    ? JsonDensityFunctionKeys
    : CASE extends '%fallback'
      ? JsonDensityFunctionFallback
      : CASE extends '%unknown' ? JsonDensityFunctionFallbackType : never
