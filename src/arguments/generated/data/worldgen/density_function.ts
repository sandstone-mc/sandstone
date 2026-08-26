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
  argument: NoiseRange,
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

export type Interpolated = OneArgument

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
  argument: DensityFunctionRef,
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
  argument: NoiseParametersRef,
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
  argument1: DensityFunctionRef,
  argument2: DensityFunctionRef,
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
  'clamp': DensityFunctionClamp,
  'minecraft:clamp': DensityFunctionClamp,
  'constant': DensityFunctionConstant,
  'minecraft:constant': DensityFunctionConstant,
  'cube': DensityFunctionCube,
  'minecraft:cube': DensityFunctionCube,
  'find_top_surface': DensityFunctionFindTopSurface,
  'minecraft:find_top_surface': DensityFunctionFindTopSurface,
  'flat_cache': DensityFunctionFlatCache,
  'minecraft:flat_cache': DensityFunctionFlatCache,
  'half_negative': DensityFunctionHalfNegative,
  'minecraft:half_negative': DensityFunctionHalfNegative,
  'interpolated': DensityFunctionInterpolated,
  'minecraft:interpolated': DensityFunctionInterpolated,
  'interval_select': DensityFunctionIntervalSelect,
  'minecraft:interval_select': DensityFunctionIntervalSelect,
  'invert': DensityFunctionInvert,
  'minecraft:invert': DensityFunctionInvert,
  'max': DensityFunctionMax,
  'minecraft:max': DensityFunctionMax,
  'min': DensityFunctionMin,
  'minecraft:min': DensityFunctionMin,
  'mul': DensityFunctionMul,
  'minecraft:mul': DensityFunctionMul,
  'noise': DensityFunctionNoise,
  'minecraft:noise': DensityFunctionNoise,
  'old_blended_noise': DensityFunctionOldBlendedNoise,
  'minecraft:old_blended_noise': DensityFunctionOldBlendedNoise,
  'quarter_negative': DensityFunctionQuarterNegative,
  'minecraft:quarter_negative': DensityFunctionQuarterNegative,
  'range_choice': DensityFunctionRangeChoice,
  'minecraft:range_choice': DensityFunctionRangeChoice,
  'shift': DensityFunctionShift,
  'minecraft:shift': DensityFunctionShift,
  'shift_a': DensityFunctionShiftA,
  'minecraft:shift_a': DensityFunctionShiftA,
  'shift_b': DensityFunctionShiftB,
  'minecraft:shift_b': DensityFunctionShiftB,
  'shifted_noise': DensityFunctionShiftedNoise,
  'minecraft:shifted_noise': DensityFunctionShiftedNoise,
  'slide': DensityFunctionSlide,
  'minecraft:slide': DensityFunctionSlide,
  'spline': DensityFunctionSpline,
  'minecraft:spline': DensityFunctionSpline,
  'square': DensityFunctionSquare,
  'minecraft:square': DensityFunctionSquare,
  'squeeze': DensityFunctionSqueeze,
  'minecraft:squeeze': DensityFunctionSqueeze,
  'y_clamped_gradient': DensityFunctionYClampedGradient,
  'minecraft:y_clamped_gradient': DensityFunctionYClampedGradient,
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
  | DensityFunctionIntervalSelect
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
  | DensityFunctionYClampedGradient
  | DensityFunctionFallbackType)
export type DensityFunctionFallbackType = Record<string, never>
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
type DensityFunctionInterpolated = Interpolated
type DensityFunctionIntervalSelect = InvervalSelect
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
type DensityFunctionYClampedGradient = YClampedGradient
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
