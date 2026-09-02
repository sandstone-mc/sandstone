import type { JsonLevelBasedValue } from 'sandstone/arguments/generated/_json/data/enchantment/level_based_value.ts'
import type {
  JsonSingleInputInteger,
} from 'sandstone/arguments/generated/_json/data/number_provider/contextual_integer.ts'
import type { JsonPredicateRef } from 'sandstone/arguments/generated/_json/data/predicate.ts'
import type { JsonNumericalEnvironmentAttribute } from 'sandstone/arguments/generated/_json/data/worldgen/attribute.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonNonEmptyWeightedList } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  DataPointClass,
  FloatNumberProviderClass,
  JsonNBTList,
  NamespacedString,
  NBTFloat,
  NonEmptyString,
} from 'sandstone'

export type JsonAbsoluteFloatProvider = JsonSingleInputFloat

export type JsonAddFloatProvider = JsonMultiInputFloat

export type JsonAverageFloatProvider = JsonMultiInputFloat

export type JsonCeilingFloatProvider = JsonSingleInputFloat

export type JsonConditionalFloatProvider = {
  conditions: JsonPredicateRef,
  on_true: JsonFloatNumberProviderRef,
  /**
   * Defaults to `0.0`.
   */
  on_false?: JsonFloatNumberProviderRef,
}

export type JsonConstantFloatProvider = {
  value: (NBTFloat | number),
}

export type JsonCosineFloatProvider = JsonSingleInputFloat

export type JsonDataStorageFloatProvider = {
  storage: NamespacedString,
  path: NonEmptyString | DataPointClass,
  fallback?: JsonFloatNumberProviderRef,
}

export type JsonDispatchedFloatProvider = {
  cases: Array<{
    condition: JsonPredicateRef,
    value: JsonFloatNumberProviderRef,
  }>,
  /**
   * Defaults to `0.0`.
   */
  default?: JsonFloatNumberProviderRef,
}

export type JsonDispatcherCase = {
  condition: JsonPredicateRef,
  value: JsonFloatNumberProviderRef,
}

export type JsonDivideFloatProvider = JsonSidedInputsFloat

export type JsonEnchantmentLevelFloatProvider = {
  amount: JsonLevelBasedValue,
}

export type JsonEnvironmentAttributeFloatProvider = {
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

export type JsonExponentiateFloatProvider = {
  base: JsonFloatNumberProviderRef,
  exponent: JsonFloatNumberProviderRef,
}

export type JsonFloatNumberProvider = ((NBTFloat | number) | ({
  [S in Extract<Extract<JsonRegistry['minecraft:context_float_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolNumberProviderFloat ? JsonSymbolNumberProviderFloat[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:context_float_provider_type'], string>]))

export type JsonFloatNumberProviderRef = ((
  | JsonRegistry['minecraft:context_float_provider'] | FloatNumberProviderClass)
  | JsonFloatNumberProvider)

export type JsonFloorFloatProvider = JsonSingleInputFloat

export type JsonMaxOfSetFloatProvider = JsonSingleInputFloat

export type JsonMinOfSetFloatProvider = JsonSingleInputFloat

export type JsonModuloFloatProvider = JsonSidedInputsFloat

export type JsonMultiInputFloat = {
  /**
   * Value:
   * List length range: 2..
   */
  inputs: JsonNBTList<JsonFloatNumberProviderRef, {
    leftExclusive: false,
    min: 1,
  }>,
}

export type JsonMultiplyFloatProvider = JsonMultiInputFloat

export type JsonNegateFloatProvider = JsonSingleInputFloat

export type JsonRandomFloatProvider = {
  min?: JsonFloatNumberProviderRef,
  max?: JsonFloatNumberProviderRef,
}

export type JsonRoundFloatProvider = JsonSingleInputFloat

export type JsonSidedInputsFloat = {
  left: JsonFloatNumberProviderRef,
  right: JsonFloatNumberProviderRef,
}

export type JsonSineFloatProvider = JsonSingleInputFloat

export type JsonSingleInputFloat = {
  input: JsonFloatNumberProviderRef,
}

export type JsonSquareRootFloatProvider = JsonSingleInputFloat

export type JsonSubtractFloatProvider = JsonSidedInputsFloat

export type JsonTruncateFloatProvider = JsonSingleInputFloat

export type JsonVectorLengthFloatProvider = JsonMultiInputFloat

export type JsonWeightedListFloatProvider = {
  distribution: JsonNonEmptyWeightedList<JsonFloatNumberProviderRef>,
}
type JsonNumberProviderFloatDispatcherMap = {
  'abs': JsonNumberProviderFloatAbs,
  'minecraft:abs': JsonNumberProviderFloatAbs,
  'add': JsonNumberProviderFloatAdd,
  'minecraft:add': JsonNumberProviderFloatAdd,
  'avg': JsonNumberProviderFloatAvg,
  'minecraft:avg': JsonNumberProviderFloatAvg,
  'ceil': JsonNumberProviderFloatCeil,
  'minecraft:ceil': JsonNumberProviderFloatCeil,
  'conditional': JsonNumberProviderFloatConditional,
  'minecraft:conditional': JsonNumberProviderFloatConditional,
  'constant': JsonNumberProviderFloatConstant,
  'minecraft:constant': JsonNumberProviderFloatConstant,
  'cos': JsonNumberProviderFloatCos,
  'minecraft:cos': JsonNumberProviderFloatCos,
  'div': JsonNumberProviderFloatDiv,
  'minecraft:div': JsonNumberProviderFloatDiv,
  'enchantment_level': JsonNumberProviderFloatEnchantmentLevel,
  'minecraft:enchantment_level': JsonNumberProviderFloatEnchantmentLevel,
  'environment_attribute': JsonNumberProviderFloatEnvironmentAttribute,
  'minecraft:environment_attribute': JsonNumberProviderFloatEnvironmentAttribute,
  'floor': JsonNumberProviderFloatFloor,
  'minecraft:floor': JsonNumberProviderFloatFloor,
  'from_int': JsonNumberProviderFloatFromInt,
  'minecraft:from_int': JsonNumberProviderFloatFromInt,
  'length': JsonNumberProviderFloatLength,
  'minecraft:length': JsonNumberProviderFloatLength,
  'max': JsonNumberProviderFloatMax,
  'minecraft:max': JsonNumberProviderFloatMax,
  'min': JsonNumberProviderFloatMin,
  'minecraft:min': JsonNumberProviderFloatMin,
  'mod': JsonNumberProviderFloatMod,
  'minecraft:mod': JsonNumberProviderFloatMod,
  'mul': JsonNumberProviderFloatMul,
  'minecraft:mul': JsonNumberProviderFloatMul,
  'negate': JsonNumberProviderFloatNegate,
  'minecraft:negate': JsonNumberProviderFloatNegate,
  'number_dispatcher': JsonNumberProviderFloatNumberDispatcher,
  'minecraft:number_dispatcher': JsonNumberProviderFloatNumberDispatcher,
  'pow': JsonNumberProviderFloatPow,
  'minecraft:pow': JsonNumberProviderFloatPow,
  'round': JsonNumberProviderFloatRound,
  'minecraft:round': JsonNumberProviderFloatRound,
  'sin': JsonNumberProviderFloatSin,
  'minecraft:sin': JsonNumberProviderFloatSin,
  'sqrt': JsonNumberProviderFloatSqrt,
  'minecraft:sqrt': JsonNumberProviderFloatSqrt,
  'storage': JsonNumberProviderFloatStorage,
  'minecraft:storage': JsonNumberProviderFloatStorage,
  'sub': JsonNumberProviderFloatSub,
  'minecraft:sub': JsonNumberProviderFloatSub,
  'truncate': JsonNumberProviderFloatTruncate,
  'minecraft:truncate': JsonNumberProviderFloatTruncate,
  'uniform': JsonNumberProviderFloatUniform,
  'minecraft:uniform': JsonNumberProviderFloatUniform,
  'weighted_list': JsonNumberProviderFloatWeightedList,
  'minecraft:weighted_list': JsonNumberProviderFloatWeightedList,
}
type JsonNumberProviderFloatKeys = keyof JsonNumberProviderFloatDispatcherMap
type JsonNumberProviderFloatFallback = (
  | JsonNumberProviderFloatAbs
  | JsonNumberProviderFloatAdd
  | JsonNumberProviderFloatAvg
  | JsonNumberProviderFloatCeil
  | JsonNumberProviderFloatConditional
  | JsonNumberProviderFloatConstant
  | JsonNumberProviderFloatCos
  | JsonNumberProviderFloatDiv
  | JsonNumberProviderFloatEnchantmentLevel
  | JsonNumberProviderFloatEnvironmentAttribute
  | JsonNumberProviderFloatFloor
  | JsonNumberProviderFloatFromInt
  | JsonNumberProviderFloatLength
  | JsonNumberProviderFloatMax
  | JsonNumberProviderFloatMin
  | JsonNumberProviderFloatMod
  | JsonNumberProviderFloatMul
  | JsonNumberProviderFloatNegate
  | JsonNumberProviderFloatNumberDispatcher
  | JsonNumberProviderFloatPow
  | JsonNumberProviderFloatRound
  | JsonNumberProviderFloatSin
  | JsonNumberProviderFloatSqrt
  | JsonNumberProviderFloatStorage
  | JsonNumberProviderFloatSub
  | JsonNumberProviderFloatTruncate
  | JsonNumberProviderFloatUniform
  | JsonNumberProviderFloatWeightedList)
type JsonNumberProviderFloatAbs = JsonAbsoluteFloatProvider
type JsonNumberProviderFloatAdd = JsonAddFloatProvider
type JsonNumberProviderFloatAvg = JsonAverageFloatProvider
type JsonNumberProviderFloatCeil = JsonCeilingFloatProvider
type JsonNumberProviderFloatConditional = JsonConditionalFloatProvider
type JsonNumberProviderFloatConstant = JsonConstantFloatProvider
type JsonNumberProviderFloatCos = JsonCosineFloatProvider
type JsonNumberProviderFloatDiv = JsonDivideFloatProvider
type JsonNumberProviderFloatEnchantmentLevel = JsonEnchantmentLevelFloatProvider
type JsonNumberProviderFloatEnvironmentAttribute = JsonEnvironmentAttributeFloatProvider
type JsonNumberProviderFloatFloor = JsonFloorFloatProvider
type JsonNumberProviderFloatFromInt = JsonSingleInputInteger
type JsonNumberProviderFloatLength = JsonVectorLengthFloatProvider
type JsonNumberProviderFloatMax = JsonMaxOfSetFloatProvider
type JsonNumberProviderFloatMin = JsonMinOfSetFloatProvider
type JsonNumberProviderFloatMod = JsonModuloFloatProvider
type JsonNumberProviderFloatMul = JsonMultiplyFloatProvider
type JsonNumberProviderFloatNegate = JsonNegateFloatProvider
type JsonNumberProviderFloatNumberDispatcher = JsonDispatchedFloatProvider
type JsonNumberProviderFloatPow = JsonExponentiateFloatProvider
type JsonNumberProviderFloatRound = JsonRoundFloatProvider
type JsonNumberProviderFloatSin = JsonSineFloatProvider
type JsonNumberProviderFloatSqrt = JsonSquareRootFloatProvider
type JsonNumberProviderFloatStorage = JsonDataStorageFloatProvider
type JsonNumberProviderFloatSub = JsonSubtractFloatProvider
type JsonNumberProviderFloatTruncate = JsonTruncateFloatProvider
type JsonNumberProviderFloatUniform = JsonRandomFloatProvider
type JsonNumberProviderFloatWeightedList = JsonWeightedListFloatProvider
export type JsonSymbolNumberProviderFloat<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonNumberProviderFloatDispatcherMap
  : CASE extends 'keys'
    ? JsonNumberProviderFloatKeys
    : CASE extends '%fallback' ? JsonNumberProviderFloatFallback : never
