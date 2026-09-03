import type {
  ContextFloatProvider,
  FloatRef,
} from 'sandstone/arguments/generated/data/number_provider/context_float.ts'
import type { ContextIntProvider, IntRef } from 'sandstone/arguments/generated/data/number_provider/context_int.ts'
import type { PredicateRef } from 'sandstone/arguments/generated/data/predicate.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { NonEmptyWeightedList } from 'sandstone/arguments/generated/util.ts'
import type { NBTObject } from 'sandstone/arguments/nbt.ts'
import type { DataPointClass, NamespacedString, NonEmptyString } from 'sandstone'

export type AggregateProvider<S extends NBTObject> = {
  inputs: S,
}

export type BinaryProvider<T extends NBTObject> = {
  left: T,
  right: T,
}

export type ConditionalProvider<T extends NBTObject> = {
  condition: PredicateRef,
  on_true: T,
  /**
   * Defaults to constant 0.
   */
  on_false?: T,
}

export type ConstantValue<V extends NBTObject> = {
  value: V,
}

export type DataStorageProvider<T extends NBTObject> = {
  storage: NamespacedString,
  path: NonEmptyString | DataPointClass,
  /**
   * Defaults to constant 0.
   */
  fallback?: T,
}

export type DispatcherProvider<T extends NBTObject> = {
  /**
   * Each condition is tested in order, the first in the list that passes is used.
   */
  cases: Array<{
    condition: PredicateRef,
    value: T,
  }>,
  /**
   * Defaults to constant 0.
   */
  default?: T,
}

export type DistributionProvider<T extends NBTObject> = {
  distribution: NonEmptyWeightedList<T>,
}

export type EnvironmentAttributeProvider<A extends NBTObject> = {
  attribute: A,
}

export type FloatNumberProvider = ContextFloatProvider

export type FloatNumberProviderRef = FloatRef

export type IntNumberProvider = ContextIntProvider

export type IntNumberProviderRef = IntRef

export type PowerProvider<T extends NBTObject> = {
  base: T,
  exponent: T,
}

export type RandomProvider<T extends NBTObject> = {
  min: T,
  max: T,
}

export type SingleProvider<T extends NBTObject> = {
  input: T,
}
