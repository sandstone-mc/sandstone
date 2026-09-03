import type {
  AggregateProvider,
  BinaryProvider,
  ConditionalProvider,
  ConstantValue,
  DataStorageProvider,
  DispatcherProvider,
  DistributionProvider,
  EnvironmentAttributeProvider,
  PowerProvider,
  RandomProvider,
  SingleProvider,
} from 'sandstone/arguments/generated/data/number_provider.ts'
import type { FloatRef } from 'sandstone/arguments/generated/data/number_provider/context_float.ts'
import type { ScoreProvider } from 'sandstone/arguments/generated/data/util.ts'
import type { IntegerEnvironmentAttribute } from 'sandstone/arguments/generated/data/worldgen/attribute.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { IntegerNumberProviderClass, NBTInt, NBTList, NonEmptyString, ObjectiveClass, TagClass } from 'sandstone'

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
export type AggregateOperands = (ContextIntProvider | (
  | Registry['minecraft:context_int_provider']
  | `#${string}:${string}`
  | TagClass<'context_int_provider'>
  | IntegerNumberProviderClass) | NBTList<IntRef, {
    leftExclusive: false,
    min: 1,
  }>)

export type AggregateProvider = AggregateProvider<AggregateOperands>

export type BinaryProvider = BinaryProvider<IntRef>

export type BinomialDistributionGenerator = {
  /**
   * Number of coin flips.
   */
  n: IntRef,
  /**
   * Probability of a single coin flip succeeding.
   */
  p: FloatRef,
}

export type ContextIntProvider = (NBTInt | ({
  [S in Extract<Extract<Registry['minecraft:context_int_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolContextIntProvider ? SymbolContextIntProvider[S] : RootNBT))
}[Extract<Registry['minecraft:context_int_provider_type'], string>]))

export type IntRef = ((Registry['minecraft:context_int_provider'] | IntegerNumberProviderClass) | ContextIntProvider)

export type ScoreboardValue = {
  target: ScoreProvider,
  score: NonEmptyString | ObjectiveClass,
  /**
   * Defaults to constant 0.
   */
  fallback?: IntRef,
}

export type SingleProvider = SingleProvider<IntRef>
type ContextIntProviderDispatcherMap = {
  'abs': ContextIntProviderAbs,
  'minecraft:abs': ContextIntProviderAbs,
  'add': ContextIntProviderAdd,
  'minecraft:add': ContextIntProviderAdd,
  'avg': ContextIntProviderAvg,
  'minecraft:avg': ContextIntProviderAvg,
  'binomial': ContextIntProviderBinomial,
  'minecraft:binomial': ContextIntProviderBinomial,
  'conditional': ContextIntProviderConditional,
  'minecraft:conditional': ContextIntProviderConditional,
  'constant': ContextIntProviderConstant,
  'minecraft:constant': ContextIntProviderConstant,
  'div': ContextIntProviderDiv,
  'minecraft:div': ContextIntProviderDiv,
  'environment_attribute': ContextIntProviderEnvironmentAttribute,
  'minecraft:environment_attribute': ContextIntProviderEnvironmentAttribute,
  'floor_div': ContextIntProviderFloorDiv,
  'minecraft:floor_div': ContextIntProviderFloorDiv,
  'floor_mod': ContextIntProviderFloorMod,
  'minecraft:floor_mod': ContextIntProviderFloorMod,
  'from_float': ContextIntProviderFromFloat,
  'minecraft:from_float': ContextIntProviderFromFloat,
  'max': ContextIntProviderMax,
  'minecraft:max': ContextIntProviderMax,
  'min': ContextIntProviderMin,
  'minecraft:min': ContextIntProviderMin,
  'mod': ContextIntProviderMod,
  'minecraft:mod': ContextIntProviderMod,
  'mul': ContextIntProviderMul,
  'minecraft:mul': ContextIntProviderMul,
  'negate': ContextIntProviderNegate,
  'minecraft:negate': ContextIntProviderNegate,
  'number_dispatcher': ContextIntProviderNumberDispatcher,
  'minecraft:number_dispatcher': ContextIntProviderNumberDispatcher,
  'pow': ContextIntProviderPow,
  'minecraft:pow': ContextIntProviderPow,
  'score': ContextIntProviderScore,
  'minecraft:score': ContextIntProviderScore,
  'storage': ContextIntProviderStorage,
  'minecraft:storage': ContextIntProviderStorage,
  'sub': ContextIntProviderSub,
  'minecraft:sub': ContextIntProviderSub,
  'uniform': ContextIntProviderUniform,
  'minecraft:uniform': ContextIntProviderUniform,
  'weighted_list': ContextIntProviderWeightedList,
  'minecraft:weighted_list': ContextIntProviderWeightedList,
}
type ContextIntProviderKeys = keyof ContextIntProviderDispatcherMap
type ContextIntProviderFallback = (
  | ContextIntProviderAbs
  | ContextIntProviderAdd
  | ContextIntProviderAvg
  | ContextIntProviderBinomial
  | ContextIntProviderConditional
  | ContextIntProviderConstant
  | ContextIntProviderDiv
  | ContextIntProviderEnvironmentAttribute
  | ContextIntProviderFloorDiv
  | ContextIntProviderFloorMod
  | ContextIntProviderFromFloat
  | ContextIntProviderMax
  | ContextIntProviderMin
  | ContextIntProviderMod
  | ContextIntProviderMul
  | ContextIntProviderNegate
  | ContextIntProviderNumberDispatcher
  | ContextIntProviderPow
  | ContextIntProviderScore
  | ContextIntProviderStorage
  | ContextIntProviderSub
  | ContextIntProviderUniform
  | ContextIntProviderWeightedList)
type ContextIntProviderAbs = SingleProvider
type ContextIntProviderAdd = AggregateProvider
type ContextIntProviderAvg = AggregateProvider
type ContextIntProviderBinomial = BinomialDistributionGenerator
type ContextIntProviderConditional = ConditionalProvider<IntRef>
type ContextIntProviderConstant = ConstantValue<NBTInt>
type ContextIntProviderDiv = BinaryProvider
type ContextIntProviderEnvironmentAttribute = EnvironmentAttributeProvider<IntegerEnvironmentAttribute>
type ContextIntProviderFloorDiv = BinaryProvider
type ContextIntProviderFloorMod = BinaryProvider
type ContextIntProviderFromFloat = SingleProvider<FloatRef>
type ContextIntProviderMax = AggregateProvider
type ContextIntProviderMin = AggregateProvider
type ContextIntProviderMod = BinaryProvider
type ContextIntProviderMul = AggregateProvider
type ContextIntProviderNegate = SingleProvider
type ContextIntProviderNumberDispatcher = DispatcherProvider<IntRef>
type ContextIntProviderPow = PowerProvider<IntRef>
type ContextIntProviderScore = ScoreboardValue
type ContextIntProviderStorage = DataStorageProvider<IntRef>
type ContextIntProviderSub = BinaryProvider
type ContextIntProviderUniform = RandomProvider<IntRef>
type ContextIntProviderWeightedList = DistributionProvider<IntRef>
export type SymbolContextIntProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? ContextIntProviderDispatcherMap
  : CASE extends 'keys' ? ContextIntProviderKeys : CASE extends '%fallback' ? ContextIntProviderFallback : never
