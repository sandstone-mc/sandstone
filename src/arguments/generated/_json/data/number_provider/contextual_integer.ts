import type {
  JsonFloatNumberProviderRef,
  JsonSingleInputFloat,
} from 'sandstone/arguments/generated/_json/data/number_provider/contextual_float.ts'
import type { JsonPredicateRef } from 'sandstone/arguments/generated/_json/data/predicate.ts'
import type { JsonScoreProvider } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonNumericalEnvironmentAttribute } from 'sandstone/arguments/generated/_json/data/worldgen/attribute.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonNonEmptyWeightedList } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { IntegerNumberProviderClass, JsonNBTList, NBTInt, NonEmptyString, ObjectiveClass } from 'sandstone'

export type JsonAbsoluteIntegerProvider = JsonSingleInputInteger

export type JsonAddIntegerProvider = JsonMultiInputInteger

export type JsonAverageIntegerProvider = JsonMultiInputInteger

export type JsonBinomialRandomIntegerProvider = {
  /**
   * Number of coin flips.
   */
  n: JsonIntegerNumberProviderRef,
  /**
   * Probability of a single coin flip succeeding.
   */
  p: JsonFloatNumberProviderRef,
}

export type JsonConditionalIntegerProvider = {
  condition: JsonPredicateRef,
  on_true: JsonIntegerNumberProviderRef,
  /**
   * Defaults to `0`.
   */
  on_false?: JsonIntegerNumberProviderRef,
}

export type JsonConstantIntegerProvider = {
  value: (NBTInt | number),
}

export type JsonDispatchedIntegerProvider = {
  cases: Array<{
    condition: JsonPredicateRef,
    value: JsonIntegerNumberProviderRef,
  }>,
  /**
   * Defaults to `0`.
   */
  default?: JsonIntegerNumberProviderRef,
}

export type JsonDispatcherCase = {
  condition: JsonPredicateRef,
  value: JsonIntegerNumberProviderRef,
}

export type JsonDivideIntegerProvider = JsonSidedInputsInteger

export type JsonEnvironmentAttributeIntegerProvider = {
  /**
   * Value:
   *
   *  - CloudHeight(`visual/cloud_height`)
   *  - FogStartDistance(`visual/fog_start_distance`)
   *  - MoonAngle(`visual/moon_angle`)
   *  - StarAngle(`visual/star_angle`)
   *  - SunAngle(`visual/sun_angle`)
   *  - WaterFogStartDistance(`visual/water_fog_start_distance`)
   *  - CloudFogEndDistance(`visual/cloud_fog_end_distance`)
   *  - FogEndDistance(`visual/fog_end_distance`)
   *  - SkyFogEndDistance(`visual/sky_fog_end_distance`)
   *  - WaterFogEndDistance(`visual/water_fog_end_distance`)
   *  - SkyLightFactor(`visual/sky_light_factor`)
   *  - StarBrightness(`visual/star_brightness`)
   *  - MusicVolume(`audio/music_volume`)
   *  - CatWakingUpGiftChance(`gameplay/cat_waking_up_gift_chance`)
   *  - CreatureWorldgenSpawnProbability(`gameplay/creature_world_gen_spawn_probability`)
   *  - SurfaceSlimeSpawnChance(`gameplay/surface_slime_spawn_chance`)
   *  - TurtleEggHatchChance(`gameplay/turtle_egg_hatch_chance`)
   *  - SkyLightLevel(`gameplay/sky_light_level`)
   */
  attribute: JsonNumericalEnvironmentAttribute,
}

export type JsonExponentiateIntegerProvider = {
  base: JsonIntegerNumberProviderRef,
  exponent: JsonIntegerNumberProviderRef,
}

export type JsonFlooredDivideIntegerProvider = JsonSidedInputsInteger

export type JsonFlooredModuloIntegerProvider = JsonSidedInputsInteger

export type JsonIntegerNumberProvider = ((NBTInt | number) | ({
  [S in Extract<Extract<JsonRegistry['minecraft:context_int_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolNumberProviderInteger ? JsonSymbolNumberProviderInteger[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:context_int_provider_type'], string>]))

export type JsonIntegerNumberProviderRef = ((
  | JsonRegistry['minecraft:context_int_provider'] | IntegerNumberProviderClass)
  | JsonIntegerNumberProvider)

export type JsonMaxOfSetIntegerProvider = JsonMultiInputInteger

export type JsonMinOfSetIntegerProvider = JsonMultiInputInteger

export type JsonModuloIntegerProvider = JsonSidedInputsInteger

export type JsonMultiInputInteger = {
  /**
   * Value:
   * List length range: 2..
   */
  inputs: JsonNBTList<JsonIntegerNumberProviderRef, {
    leftExclusive: false,
    min: 1,
  }>,
}

export type JsonMultiplyIntegerProvider = JsonMultiInputInteger

export type JsonNegateIntegerProvider = JsonSingleInputInteger

export type JsonRandomIntegerProvider = {
  min?: JsonIntegerNumberProviderRef,
  max?: JsonIntegerNumberProviderRef,
}

export type JsonScoreIntegerProvider = {
  target: JsonScoreProvider,
  score: NonEmptyString | ObjectiveClass,
  /**
   * Defaults to `0`.
   */
  fallback?: JsonIntegerNumberProviderRef,
}

export type JsonSidedInputsInteger = {
  left: JsonIntegerNumberProviderRef,
  right: JsonIntegerNumberProviderRef,
}

export type JsonSingleInputInteger = {
  input: JsonIntegerNumberProviderRef,
}

export type JsonSubtractIntegerProvider = JsonSidedInputsInteger

export type JsonWeightedListIntegerProvider = {
  distribution: JsonNonEmptyWeightedList<JsonIntegerNumberProviderRef>,
}
type JsonNumberProviderIntegerDispatcherMap = {
  'abs': JsonNumberProviderIntegerAbs,
  'minecraft:abs': JsonNumberProviderIntegerAbs,
  'add': JsonNumberProviderIntegerAdd,
  'minecraft:add': JsonNumberProviderIntegerAdd,
  'avg': JsonNumberProviderIntegerAvg,
  'minecraft:avg': JsonNumberProviderIntegerAvg,
  'binomial': JsonNumberProviderIntegerBinomial,
  'minecraft:binomial': JsonNumberProviderIntegerBinomial,
  'conditional': JsonNumberProviderIntegerConditional,
  'minecraft:conditional': JsonNumberProviderIntegerConditional,
  'constant': JsonNumberProviderIntegerConstant,
  'minecraft:constant': JsonNumberProviderIntegerConstant,
  'div': JsonNumberProviderIntegerDiv,
  'minecraft:div': JsonNumberProviderIntegerDiv,
  'environment_attribute': JsonNumberProviderIntegerEnvironmentAttribute,
  'minecraft:environment_attribute': JsonNumberProviderIntegerEnvironmentAttribute,
  'floor_div': JsonNumberProviderIntegerFloorDiv,
  'minecraft:floor_div': JsonNumberProviderIntegerFloorDiv,
  'floor_mod': JsonNumberProviderIntegerFloorMod,
  'minecraft:floor_mod': JsonNumberProviderIntegerFloorMod,
  'from_float': JsonNumberProviderIntegerFromFloat,
  'minecraft:from_float': JsonNumberProviderIntegerFromFloat,
  'max': JsonNumberProviderIntegerMax,
  'minecraft:max': JsonNumberProviderIntegerMax,
  'min': JsonNumberProviderIntegerMin,
  'minecraft:min': JsonNumberProviderIntegerMin,
  'mod': JsonNumberProviderIntegerMod,
  'minecraft:mod': JsonNumberProviderIntegerMod,
  'mul': JsonNumberProviderIntegerMul,
  'minecraft:mul': JsonNumberProviderIntegerMul,
  'negate': JsonNumberProviderIntegerNegate,
  'minecraft:negate': JsonNumberProviderIntegerNegate,
  'number_dispatcher': JsonNumberProviderIntegerNumberDispatcher,
  'minecraft:number_dispatcher': JsonNumberProviderIntegerNumberDispatcher,
  'pow': JsonNumberProviderIntegerPow,
  'minecraft:pow': JsonNumberProviderIntegerPow,
  'score': JsonNumberProviderIntegerScore,
  'minecraft:score': JsonNumberProviderIntegerScore,
  'sub': JsonNumberProviderIntegerSub,
  'minecraft:sub': JsonNumberProviderIntegerSub,
  'uniform': JsonNumberProviderIntegerUniform,
  'minecraft:uniform': JsonNumberProviderIntegerUniform,
  'weighted_list': JsonNumberProviderIntegerWeightedList,
  'minecraft:weighted_list': JsonNumberProviderIntegerWeightedList,
}
type JsonNumberProviderIntegerKeys = keyof JsonNumberProviderIntegerDispatcherMap
type JsonNumberProviderIntegerFallback = (
  | JsonNumberProviderIntegerAbs
  | JsonNumberProviderIntegerAdd
  | JsonNumberProviderIntegerAvg
  | JsonNumberProviderIntegerBinomial
  | JsonNumberProviderIntegerConditional
  | JsonNumberProviderIntegerConstant
  | JsonNumberProviderIntegerDiv
  | JsonNumberProviderIntegerEnvironmentAttribute
  | JsonNumberProviderIntegerFloorDiv
  | JsonNumberProviderIntegerFloorMod
  | JsonNumberProviderIntegerFromFloat
  | JsonNumberProviderIntegerMax
  | JsonNumberProviderIntegerMin
  | JsonNumberProviderIntegerMod
  | JsonNumberProviderIntegerMul
  | JsonNumberProviderIntegerNegate
  | JsonNumberProviderIntegerNumberDispatcher
  | JsonNumberProviderIntegerPow
  | JsonNumberProviderIntegerScore
  | JsonNumberProviderIntegerSub
  | JsonNumberProviderIntegerUniform
  | JsonNumberProviderIntegerWeightedList)
type JsonNumberProviderIntegerAbs = JsonAbsoluteIntegerProvider
type JsonNumberProviderIntegerAdd = JsonAddIntegerProvider
type JsonNumberProviderIntegerAvg = JsonAverageIntegerProvider
type JsonNumberProviderIntegerBinomial = JsonBinomialRandomIntegerProvider
type JsonNumberProviderIntegerConditional = JsonConditionalIntegerProvider
type JsonNumberProviderIntegerConstant = JsonConstantIntegerProvider
type JsonNumberProviderIntegerDiv = JsonDivideIntegerProvider
type JsonNumberProviderIntegerEnvironmentAttribute = JsonEnvironmentAttributeIntegerProvider
type JsonNumberProviderIntegerFloorDiv = JsonFlooredDivideIntegerProvider
type JsonNumberProviderIntegerFloorMod = JsonFlooredModuloIntegerProvider
type JsonNumberProviderIntegerFromFloat = JsonSingleInputFloat
type JsonNumberProviderIntegerMax = JsonMaxOfSetIntegerProvider
type JsonNumberProviderIntegerMin = JsonMinOfSetIntegerProvider
type JsonNumberProviderIntegerMod = JsonModuloIntegerProvider
type JsonNumberProviderIntegerMul = JsonMultiplyIntegerProvider
type JsonNumberProviderIntegerNegate = JsonNegateIntegerProvider
type JsonNumberProviderIntegerNumberDispatcher = JsonDispatchedIntegerProvider
type JsonNumberProviderIntegerPow = JsonExponentiateIntegerProvider
type JsonNumberProviderIntegerScore = JsonScoreIntegerProvider
type JsonNumberProviderIntegerSub = JsonSubtractIntegerProvider
type JsonNumberProviderIntegerUniform = JsonRandomIntegerProvider
type JsonNumberProviderIntegerWeightedList = JsonWeightedListIntegerProvider
export type JsonSymbolNumberProviderInteger<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonNumberProviderIntegerDispatcherMap
  : CASE extends 'keys'
    ? JsonNumberProviderIntegerKeys
    : CASE extends '%fallback' ? JsonNumberProviderIntegerFallback : never
