import type {
  JsonContextFloatProvider,
  JsonFloatRef,
} from 'sandstone/arguments/generated/_json/data/number_provider/context_float.ts'
import type {
  JsonContextIntProvider,
  JsonIntRef,
} from 'sandstone/arguments/generated/_json/data/number_provider/context_int.ts'
import type { JsonPredicateRef } from 'sandstone/arguments/generated/_json/data/predicate.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonNonEmptyWeightedList } from 'sandstone/arguments/generated/_json/util.ts'
import type { JsonNBTObject } from 'sandstone/arguments/nbt.ts'
import type { DataPointClass, NamespacedString, NonEmptyString } from 'sandstone'

export type JsonAggregateProvider<S extends JsonNBTObject> = {
  inputs: S,
}

export type JsonBinaryProvider<T extends JsonNBTObject> = {
  left: T,
  right: T,
}

export type JsonConditionalProvider<T extends JsonNBTObject> = {
  condition: JsonPredicateRef,
  on_true: T,
  /**
   * Defaults to constant 0.
   */
  on_false?: T,
}

export type JsonConstantValue<V extends JsonNBTObject> = {
  value: V,
}

export type JsonDataStorageProvider<T extends JsonNBTObject> = {
  storage: NamespacedString,
  path: NonEmptyString | DataPointClass,
  /**
   * Defaults to constant 0.
   */
  fallback?: T,
}

export type JsonDispatcherProvider<T extends JsonNBTObject> = {
  /**
   * Each condition is tested in order, the first in the list that passes is used.
   */
  cases: Array<{
    condition: JsonPredicateRef,
    value: T,
  }>,
  /**
   * Defaults to constant 0.
   */
  default?: T,
}

export type JsonDistributionProvider<T extends JsonNBTObject> = {
  distribution: JsonNonEmptyWeightedList<T>,
}

export type JsonEnvironmentAttributeProvider<A extends JsonNBTObject> = {
  attribute: A,
}

export type JsonFloatNumberProvider = JsonContextFloatProvider

export type JsonFloatNumberProviderRef = JsonFloatRef

export type JsonIntNumberProvider = JsonContextIntProvider

export type JsonIntNumberProviderRef = JsonIntRef

export type JsonPowerProvider<T extends JsonNBTObject> = {
  base: T,
  exponent: T,
}

export type JsonRandomProvider<T extends JsonNBTObject> = {
  min: T,
  max: T,
}

export type JsonSingleProvider<T extends JsonNBTObject> = {
  input: T,
}
