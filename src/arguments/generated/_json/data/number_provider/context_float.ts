import type { JsonLevelBasedValue } from 'sandstone/arguments/generated/_json/data/enchantment/level_based_value.ts'
import type { JsonIntRef } from 'sandstone/arguments/generated/_json/data/number_provider/context_int.ts'
import type {
  JsonConstantValue,
  JsonEnvironmentAttributeProvider,
} from 'sandstone/arguments/generated/_json/data/number_provider.ts'
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
  TagClass,
} from 'sandstone'

/**
 * *either*
 *
 * *item 0*
 *
 * *or*
 *
 * *item 1*
 *
 * *or*
 *
 * List length range: 1..
 */
export type JsonAggregateOperands = (JsonContextFloatProvider | (
  | JsonRegistry['minecraft:context_float_provider']
  | `#${string}:${string}`
  | TagClass<'context_float_provider'>
  | FloatNumberProviderClass) | JsonNBTList<JsonFloatRef, {
    leftExclusive: false,
    min: 1,
  }>)

export type JsonAggregateProvider = {
  inputs: JsonAggregateOperands,
}

export type JsonBinaryProvider = {
  left: JsonFloatRef,
  right: JsonFloatRef,
}

export type JsonContextFloatProvider = ((NBTFloat | number) | ({
  [S in Extract<Extract<JsonRegistry['minecraft:context_float_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolContextFloatProvider ? JsonSymbolContextFloatProvider[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:context_float_provider_type'], string>]))

export type JsonEnchantmentLevelProvider = {
  amount: JsonLevelBasedValue,
}

export type JsonFloatRef = ((
  | JsonRegistry['minecraft:context_float_provider'] | FloatNumberProviderClass)
  | JsonContextFloatProvider)

export type JsonSingleProvider = {
  input: JsonFloatRef,
}
type JsonContextFloatProviderDispatcherMap = {
  'abs': JsonContextFloatProviderAbs,
  'minecraft:abs': JsonContextFloatProviderAbs,
  'add': JsonContextFloatProviderAdd,
  'minecraft:add': JsonContextFloatProviderAdd,
  'avg': JsonContextFloatProviderAvg,
  'minecraft:avg': JsonContextFloatProviderAvg,
  'ceil': JsonContextFloatProviderCeil,
  'minecraft:ceil': JsonContextFloatProviderCeil,
  'conditional': JsonContextFloatProviderConditional,
  'minecraft:conditional': JsonContextFloatProviderConditional,
  'constant': JsonContextFloatProviderConstant,
  'minecraft:constant': JsonContextFloatProviderConstant,
  'cos': JsonContextFloatProviderCos,
  'minecraft:cos': JsonContextFloatProviderCos,
  'div': JsonContextFloatProviderDiv,
  'minecraft:div': JsonContextFloatProviderDiv,
  'enchantment_level': JsonContextFloatProviderEnchantmentLevel,
  'minecraft:enchantment_level': JsonContextFloatProviderEnchantmentLevel,
  'environment_attribute': JsonContextFloatProviderEnvironmentAttribute,
  'minecraft:environment_attribute': JsonContextFloatProviderEnvironmentAttribute,
  'floor': JsonContextFloatProviderFloor,
  'minecraft:floor': JsonContextFloatProviderFloor,
  'from_int': JsonContextFloatProviderFromInt,
  'minecraft:from_int': JsonContextFloatProviderFromInt,
  'length': JsonContextFloatProviderLength,
  'minecraft:length': JsonContextFloatProviderLength,
  'max': JsonContextFloatProviderMax,
  'minecraft:max': JsonContextFloatProviderMax,
  'min': JsonContextFloatProviderMin,
  'minecraft:min': JsonContextFloatProviderMin,
  'mod': JsonContextFloatProviderMod,
  'minecraft:mod': JsonContextFloatProviderMod,
  'mul': JsonContextFloatProviderMul,
  'minecraft:mul': JsonContextFloatProviderMul,
  'negate': JsonContextFloatProviderNegate,
  'minecraft:negate': JsonContextFloatProviderNegate,
  'number_dispatcher': JsonContextFloatProviderNumberDispatcher,
  'minecraft:number_dispatcher': JsonContextFloatProviderNumberDispatcher,
  'pow': JsonContextFloatProviderPow,
  'minecraft:pow': JsonContextFloatProviderPow,
  'round': JsonContextFloatProviderRound,
  'minecraft:round': JsonContextFloatProviderRound,
  'sin': JsonContextFloatProviderSin,
  'minecraft:sin': JsonContextFloatProviderSin,
  'sqrt': JsonContextFloatProviderSqrt,
  'minecraft:sqrt': JsonContextFloatProviderSqrt,
  'storage': JsonContextFloatProviderStorage,
  'minecraft:storage': JsonContextFloatProviderStorage,
  'sub': JsonContextFloatProviderSub,
  'minecraft:sub': JsonContextFloatProviderSub,
  'truncate': JsonContextFloatProviderTruncate,
  'minecraft:truncate': JsonContextFloatProviderTruncate,
  'uniform': JsonContextFloatProviderUniform,
  'minecraft:uniform': JsonContextFloatProviderUniform,
  'weighted_list': JsonContextFloatProviderWeightedList,
  'minecraft:weighted_list': JsonContextFloatProviderWeightedList,
}
type JsonContextFloatProviderKeys = keyof JsonContextFloatProviderDispatcherMap
type JsonContextFloatProviderFallback = (
  | JsonContextFloatProviderAbs
  | JsonContextFloatProviderAdd
  | JsonContextFloatProviderAvg
  | JsonContextFloatProviderCeil
  | JsonContextFloatProviderConditional
  | JsonContextFloatProviderConstant
  | JsonContextFloatProviderCos
  | JsonContextFloatProviderDiv
  | JsonContextFloatProviderEnchantmentLevel
  | JsonContextFloatProviderEnvironmentAttribute
  | JsonContextFloatProviderFloor
  | JsonContextFloatProviderFromInt
  | JsonContextFloatProviderLength
  | JsonContextFloatProviderMax
  | JsonContextFloatProviderMin
  | JsonContextFloatProviderMod
  | JsonContextFloatProviderMul
  | JsonContextFloatProviderNegate
  | JsonContextFloatProviderNumberDispatcher
  | JsonContextFloatProviderPow
  | JsonContextFloatProviderRound
  | JsonContextFloatProviderSin
  | JsonContextFloatProviderSqrt
  | JsonContextFloatProviderStorage
  | JsonContextFloatProviderSub
  | JsonContextFloatProviderTruncate
  | JsonContextFloatProviderUniform
  | JsonContextFloatProviderWeightedList)
type JsonContextFloatProviderAbs = JsonSingleProvider
type JsonContextFloatProviderAdd = JsonAggregateProvider
type JsonContextFloatProviderAvg = JsonAggregateProvider
type JsonContextFloatProviderCeil = JsonSingleProvider
type JsonContextFloatProviderConditional = {
  condition: JsonPredicateRef,
  on_true: JsonFloatRef,
  /**
   * Defaults to constant 0.
   */
  on_false?: JsonFloatRef,
}
type JsonContextFloatProviderConstant = JsonConstantValue<(NBTFloat | number)>
type JsonContextFloatProviderCos = JsonSingleProvider
type JsonContextFloatProviderDiv = JsonBinaryProvider
type JsonContextFloatProviderEnchantmentLevel = JsonEnchantmentLevelProvider
type JsonContextFloatProviderEnvironmentAttribute = JsonEnvironmentAttributeProvider<JsonNumericalEnvironmentAttribute>
type JsonContextFloatProviderFloor = JsonSingleProvider
type JsonContextFloatProviderFromInt = {
  input: JsonIntRef,
}
type JsonContextFloatProviderLength = JsonAggregateProvider
type JsonContextFloatProviderMax = JsonAggregateProvider
type JsonContextFloatProviderMin = JsonAggregateProvider
type JsonContextFloatProviderMod = JsonBinaryProvider
type JsonContextFloatProviderMul = JsonAggregateProvider
type JsonContextFloatProviderNegate = JsonSingleProvider
type JsonContextFloatProviderNumberDispatcher = {
  /**
   * Each condition is tested in order, the first in the list that passes is used.
   */
  cases: Array<{
    condition: JsonPredicateRef,
    value: JsonFloatRef,
  }>,
  /**
   * Defaults to constant 0.
   */
  default?: JsonFloatRef,
}
type JsonContextFloatProviderPow = {
  base: JsonFloatRef,
  exponent: JsonFloatRef,
}
type JsonContextFloatProviderRound = JsonSingleProvider
type JsonContextFloatProviderSin = JsonSingleProvider
type JsonContextFloatProviderSqrt = JsonSingleProvider
type JsonContextFloatProviderStorage = {
  storage: NamespacedString,
  path: NonEmptyString | DataPointClass,
  /**
   * Defaults to constant 0.
   */
  fallback?: JsonFloatRef,
}
type JsonContextFloatProviderSub = JsonBinaryProvider
type JsonContextFloatProviderTruncate = JsonSingleProvider
type JsonContextFloatProviderUniform = {
  min: JsonFloatRef,
  max: JsonFloatRef,
}
type JsonContextFloatProviderWeightedList = {
  distribution: JsonNonEmptyWeightedList<JsonFloatRef>,
}
export type JsonSymbolContextFloatProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonContextFloatProviderDispatcherMap
  : CASE extends 'keys'
    ? JsonContextFloatProviderKeys
    : CASE extends '%fallback' ? JsonContextFloatProviderFallback : never
