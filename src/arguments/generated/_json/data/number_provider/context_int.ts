import type { JsonFloatRef } from 'sandstone/arguments/generated/_json/data/number_provider/context_float.ts'
import type {
  JsonConstantValue,
  JsonEnvironmentAttributeProvider,
} from 'sandstone/arguments/generated/_json/data/number_provider.ts'
import type { JsonPredicateRef } from 'sandstone/arguments/generated/_json/data/predicate.ts'
import type { JsonScoreProvider } from 'sandstone/arguments/generated/_json/data/util.ts'
import type { JsonIntegerEnvironmentAttribute } from 'sandstone/arguments/generated/_json/data/worldgen/attribute.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonNonEmptyWeightedList } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type {
  DataPointClass,
  IntegerNumberProviderClass,
  JsonNBTList,
  NamespacedString,
  NBTInt,
  NonEmptyString,
  ObjectiveClass,
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
export type JsonAggregateOperands = (JsonContextIntProvider | (
  | JsonRegistry['minecraft:context_int_provider']
  | `#${string}:${string}`
  | TagClass<'context_int_provider'>
  | IntegerNumberProviderClass) | JsonNBTList<JsonIntRef, {
    leftExclusive: false,
    min: 1,
  }>)

export type JsonAggregateProvider = {
  inputs: JsonAggregateOperands,
}

export type JsonBinaryProvider = {
  left: JsonIntRef,
  right: JsonIntRef,
}

export type JsonBinomialDistributionGenerator = {
  /**
   * Number of coin flips.
   */
  n: JsonIntRef,
  /**
   * Probability of a single coin flip succeeding.
   */
  p: JsonFloatRef,
}

export type JsonContextIntProvider = ((NBTInt | number) | ({
  [S in Extract<Extract<JsonRegistry['minecraft:context_int_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolContextIntProvider ? JsonSymbolContextIntProvider[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:context_int_provider_type'], string>]))

export type JsonIntRef = ((
  | JsonRegistry['minecraft:context_int_provider'] | IntegerNumberProviderClass)
  | JsonContextIntProvider)

export type JsonScoreboardValue = {
  target: JsonScoreProvider,
  score: NonEmptyString | ObjectiveClass,
  /**
   * Defaults to constant 0.
   */
  fallback?: JsonIntRef,
}

export type JsonSingleProvider = {
  input: JsonIntRef,
}
type JsonContextIntProviderDispatcherMap = {
  'abs': JsonContextIntProviderAbs,
  'minecraft:abs': JsonContextIntProviderAbs,
  'add': JsonContextIntProviderAdd,
  'minecraft:add': JsonContextIntProviderAdd,
  'avg': JsonContextIntProviderAvg,
  'minecraft:avg': JsonContextIntProviderAvg,
  'binomial': JsonContextIntProviderBinomial,
  'minecraft:binomial': JsonContextIntProviderBinomial,
  'conditional': JsonContextIntProviderConditional,
  'minecraft:conditional': JsonContextIntProviderConditional,
  'constant': JsonContextIntProviderConstant,
  'minecraft:constant': JsonContextIntProviderConstant,
  'div': JsonContextIntProviderDiv,
  'minecraft:div': JsonContextIntProviderDiv,
  'environment_attribute': JsonContextIntProviderEnvironmentAttribute,
  'minecraft:environment_attribute': JsonContextIntProviderEnvironmentAttribute,
  'floor_div': JsonContextIntProviderFloorDiv,
  'minecraft:floor_div': JsonContextIntProviderFloorDiv,
  'floor_mod': JsonContextIntProviderFloorMod,
  'minecraft:floor_mod': JsonContextIntProviderFloorMod,
  'from_float': JsonContextIntProviderFromFloat,
  'minecraft:from_float': JsonContextIntProviderFromFloat,
  'max': JsonContextIntProviderMax,
  'minecraft:max': JsonContextIntProviderMax,
  'min': JsonContextIntProviderMin,
  'minecraft:min': JsonContextIntProviderMin,
  'mod': JsonContextIntProviderMod,
  'minecraft:mod': JsonContextIntProviderMod,
  'mul': JsonContextIntProviderMul,
  'minecraft:mul': JsonContextIntProviderMul,
  'negate': JsonContextIntProviderNegate,
  'minecraft:negate': JsonContextIntProviderNegate,
  'number_dispatcher': JsonContextIntProviderNumberDispatcher,
  'minecraft:number_dispatcher': JsonContextIntProviderNumberDispatcher,
  'pow': JsonContextIntProviderPow,
  'minecraft:pow': JsonContextIntProviderPow,
  'score': JsonContextIntProviderScore,
  'minecraft:score': JsonContextIntProviderScore,
  'storage': JsonContextIntProviderStorage,
  'minecraft:storage': JsonContextIntProviderStorage,
  'sub': JsonContextIntProviderSub,
  'minecraft:sub': JsonContextIntProviderSub,
  'uniform': JsonContextIntProviderUniform,
  'minecraft:uniform': JsonContextIntProviderUniform,
  'weighted_list': JsonContextIntProviderWeightedList,
  'minecraft:weighted_list': JsonContextIntProviderWeightedList,
}
type JsonContextIntProviderKeys = keyof JsonContextIntProviderDispatcherMap
type JsonContextIntProviderFallback = (
  | JsonContextIntProviderAbs
  | JsonContextIntProviderAdd
  | JsonContextIntProviderAvg
  | JsonContextIntProviderBinomial
  | JsonContextIntProviderConditional
  | JsonContextIntProviderConstant
  | JsonContextIntProviderDiv
  | JsonContextIntProviderEnvironmentAttribute
  | JsonContextIntProviderFloorDiv
  | JsonContextIntProviderFloorMod
  | JsonContextIntProviderFromFloat
  | JsonContextIntProviderMax
  | JsonContextIntProviderMin
  | JsonContextIntProviderMod
  | JsonContextIntProviderMul
  | JsonContextIntProviderNegate
  | JsonContextIntProviderNumberDispatcher
  | JsonContextIntProviderPow
  | JsonContextIntProviderScore
  | JsonContextIntProviderStorage
  | JsonContextIntProviderSub
  | JsonContextIntProviderUniform
  | JsonContextIntProviderWeightedList)
type JsonContextIntProviderAbs = JsonSingleProvider
type JsonContextIntProviderAdd = JsonAggregateProvider
type JsonContextIntProviderAvg = JsonAggregateProvider
type JsonContextIntProviderBinomial = JsonBinomialDistributionGenerator
type JsonContextIntProviderConditional = {
  condition: JsonPredicateRef,
  on_true: JsonIntRef,
  /**
   * Defaults to constant 0.
   */
  on_false?: JsonIntRef,
}
type JsonContextIntProviderConstant = JsonConstantValue<(NBTInt | number)>
type JsonContextIntProviderDiv = JsonBinaryProvider
type JsonContextIntProviderEnvironmentAttribute = JsonEnvironmentAttributeProvider<JsonIntegerEnvironmentAttribute>
type JsonContextIntProviderFloorDiv = JsonBinaryProvider
type JsonContextIntProviderFloorMod = JsonBinaryProvider
type JsonContextIntProviderFromFloat = {
  input: JsonFloatRef,
}
type JsonContextIntProviderMax = JsonAggregateProvider
type JsonContextIntProviderMin = JsonAggregateProvider
type JsonContextIntProviderMod = JsonBinaryProvider
type JsonContextIntProviderMul = JsonAggregateProvider
type JsonContextIntProviderNegate = JsonSingleProvider
type JsonContextIntProviderNumberDispatcher = {
  /**
   * Each condition is tested in order, the first in the list that passes is used.
   */
  cases: Array<{
    condition: JsonPredicateRef,
    value: JsonIntRef,
  }>,
  /**
   * Defaults to constant 0.
   */
  default?: JsonIntRef,
}
type JsonContextIntProviderPow = {
  base: JsonIntRef,
  exponent: JsonIntRef,
}
type JsonContextIntProviderScore = JsonScoreboardValue
type JsonContextIntProviderStorage = {
  storage: NamespacedString,
  path: NonEmptyString | DataPointClass,
  /**
   * Defaults to constant 0.
   */
  fallback?: JsonIntRef,
}
type JsonContextIntProviderSub = JsonBinaryProvider
type JsonContextIntProviderUniform = {
  min: JsonIntRef,
  max: JsonIntRef,
}
type JsonContextIntProviderWeightedList = {
  distribution: JsonNonEmptyWeightedList<JsonIntRef>,
}
export type JsonSymbolContextIntProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonContextIntProviderDispatcherMap
  : CASE extends 'keys'
    ? JsonContextIntProviderKeys
    : CASE extends '%fallback' ? JsonContextIntProviderFallback : never
