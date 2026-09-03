import type { LevelBasedValue } from 'sandstone/arguments/generated/data/enchantment/level_based_value.ts'
import type { IntRef } from 'sandstone/arguments/generated/data/number_provider/context_int.ts'
import type { ConstantValue } from 'sandstone/arguments/generated/data/number_provider.ts'
import type { NonEmptyWeightedList } from 'sandstone/arguments/generated/util.ts'
import type { NumericalEnvironmentAttribute } from 'sandstone/arguments/generated/data/worldgen/attribute.ts'
import type { PredicateRef } from 'sandstone/arguments/generated/data/predicate.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { RootNBT } from 'sandstone/arguments/nbt.ts'
import type { DataPointClass, FloatNumberProviderClass, NamespacedString, NBTFloat, NBTList, NonEmptyString, TagClass } from 'sandstone'

// TODO: Important ! The generator is currently incapable of handling the source mcdoc for this; too much circular reference jank

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
export type AggregateOperands = (ContextFloatProvider | (
  | Registry['minecraft:context_float_provider']
  | `#${string}:${string}`
  | TagClass<'context_float_provider'>
  | FloatNumberProviderClass) | NBTList<FloatRef, {
    leftExclusive: false,
    min: 1,
  }>)

export type SingleProvider = {
  input: FloatRef,
}

export type BinaryProvider = {
  left: FloatRef,
  right: FloatRef,
}

export type AggregateProvider = {
  inputs: AggregateOperands,
}

export type ContextFloatProvider = (NBTFloat | ({
  [S in Extract<Extract<Registry['minecraft:context_float_provider_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolContextFloatProvider ? SymbolContextFloatProvider[S] : RootNBT))
}[Extract<Registry['minecraft:context_float_provider_type'], string>]))

export type EnchantmentLevelProvider = {
  amount: LevelBasedValue,
}

export type FloatRef = ((
  | Registry['minecraft:context_float_provider'] | FloatNumberProviderClass)
  | ContextFloatProvider)
type ContextFloatProviderDispatcherMap = {
  'abs': ContextFloatProviderAbs,
  'minecraft:abs': ContextFloatProviderAbs,
  'add': ContextFloatProviderAdd,
  'minecraft:add': ContextFloatProviderAdd,
  'avg': ContextFloatProviderAvg,
  'minecraft:avg': ContextFloatProviderAvg,
  'ceil': ContextFloatProviderCeil,
  'minecraft:ceil': ContextFloatProviderCeil,
  'conditional': ContextFloatProviderConditional,
  'minecraft:conditional': ContextFloatProviderConditional,
  'constant': ContextFloatProviderConstant,
  'minecraft:constant': ContextFloatProviderConstant,
  'cos': ContextFloatProviderCos,
  'minecraft:cos': ContextFloatProviderCos,
  'div': ContextFloatProviderDiv,
  'minecraft:div': ContextFloatProviderDiv,
  'enchantment_level': ContextFloatProviderEnchantmentLevel,
  'minecraft:enchantment_level': ContextFloatProviderEnchantmentLevel,
  'environment_attribute': ContextFloatProviderEnvironmentAttribute,
  'minecraft:environment_attribute': ContextFloatProviderEnvironmentAttribute,
  'floor': ContextFloatProviderFloor,
  'minecraft:floor': ContextFloatProviderFloor,
  'from_int': ContextFloatProviderFromInt,
  'minecraft:from_int': ContextFloatProviderFromInt,
  'length': ContextFloatProviderLength,
  'minecraft:length': ContextFloatProviderLength,
  'max': ContextFloatProviderMax,
  'minecraft:max': ContextFloatProviderMax,
  'min': ContextFloatProviderMin,
  'minecraft:min': ContextFloatProviderMin,
  'mod': ContextFloatProviderMod,
  'minecraft:mod': ContextFloatProviderMod,
  'mul': ContextFloatProviderMul,
  'minecraft:mul': ContextFloatProviderMul,
  'negate': ContextFloatProviderNegate,
  'minecraft:negate': ContextFloatProviderNegate,
  'number_dispatcher': ContextFloatProviderNumberDispatcher,
  'minecraft:number_dispatcher': ContextFloatProviderNumberDispatcher,
  'pow': ContextFloatProviderPow,
  'minecraft:pow': ContextFloatProviderPow,
  'round': ContextFloatProviderRound,
  'minecraft:round': ContextFloatProviderRound,
  'sin': ContextFloatProviderSin,
  'minecraft:sin': ContextFloatProviderSin,
  'sqrt': ContextFloatProviderSqrt,
  'minecraft:sqrt': ContextFloatProviderSqrt,
  'storage': ContextFloatProviderStorage,
  'minecraft:storage': ContextFloatProviderStorage,
  'sub': ContextFloatProviderSub,
  'minecraft:sub': ContextFloatProviderSub,
  'truncate': ContextFloatProviderTruncate,
  'minecraft:truncate': ContextFloatProviderTruncate,
  'uniform': ContextFloatProviderUniform,
  'minecraft:uniform': ContextFloatProviderUniform,
  'weighted_list': ContextFloatProviderWeightedList,
  'minecraft:weighted_list': ContextFloatProviderWeightedList,
}
type ContextFloatProviderKeys = keyof ContextFloatProviderDispatcherMap
type ContextFloatProviderFallback = (
  | ContextFloatProviderAbs
  | ContextFloatProviderAdd
  | ContextFloatProviderAvg
  | ContextFloatProviderCeil
  | ContextFloatProviderConditional
  | ContextFloatProviderConstant
  | ContextFloatProviderCos
  | ContextFloatProviderDiv
  | ContextFloatProviderEnchantmentLevel
  | ContextFloatProviderEnvironmentAttribute
  | ContextFloatProviderFloor
  | ContextFloatProviderFromInt
  | ContextFloatProviderLength
  | ContextFloatProviderMax
  | ContextFloatProviderMin
  | ContextFloatProviderMod
  | ContextFloatProviderMul
  | ContextFloatProviderNegate
  | ContextFloatProviderNumberDispatcher
  | ContextFloatProviderPow
  | ContextFloatProviderRound
  | ContextFloatProviderSin
  | ContextFloatProviderSqrt
  | ContextFloatProviderStorage
  | ContextFloatProviderSub
  | ContextFloatProviderTruncate
  | ContextFloatProviderUniform
  | ContextFloatProviderWeightedList)
type ContextFloatProviderAbs = SingleProvider
type ContextFloatProviderAdd = AggregateProvider
type ContextFloatProviderAvg = AggregateProvider
type ContextFloatProviderCeil = SingleProvider
type ContextFloatProviderConditional = {
  condition: PredicateRef,
  on_true: FloatRef,
  on_false?: FloatRef,
}
type ContextFloatProviderConstant = ConstantValue<NBTFloat>
type ContextFloatProviderCos = SingleProvider
type ContextFloatProviderDiv = BinaryProvider
type ContextFloatProviderEnchantmentLevel = EnchantmentLevelProvider
type ContextFloatProviderEnvironmentAttribute = {
  attribute: NumericalEnvironmentAttribute,
}
type ContextFloatProviderFloor = SingleProvider
type ContextFloatProviderFromInt = { input: IntRef }
type ContextFloatProviderLength = AggregateProvider
type ContextFloatProviderMax = AggregateProvider
type ContextFloatProviderMin = AggregateProvider
type ContextFloatProviderMod = BinaryProvider
type ContextFloatProviderMul = AggregateProvider
type ContextFloatProviderNegate = SingleProvider
type ContextFloatProviderNumberDispatcher = {
  cases: Array<{
    condition: PredicateRef,
    value: FloatRef,
  }>,
  default?: FloatRef,
}
type ContextFloatProviderPow = {
  base: FloatRef,
  exponent: FloatRef,
}
type ContextFloatProviderRound = SingleProvider
type ContextFloatProviderSin = SingleProvider
type ContextFloatProviderSqrt = SingleProvider
type ContextFloatProviderStorage = {
  storage: NamespacedString,
  path: NonEmptyString | DataPointClass,
  fallback?: FloatRef,
}
type ContextFloatProviderSub = BinaryProvider
type ContextFloatProviderTruncate = SingleProvider
type ContextFloatProviderUniform = {
  min: FloatRef,
  max: FloatRef,
}
type ContextFloatProviderWeightedList = {
  distribution: NonEmptyWeightedList<FloatRef>,
}
export type SymbolContextFloatProvider<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? ContextFloatProviderDispatcherMap
  : CASE extends 'keys' ? ContextFloatProviderKeys : CASE extends '%fallback' ? ContextFloatProviderFallback : never
