import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonRootNBT } from 'sandstone/arguments/nbt.ts'
import type { JsonNBTList, NBTFloat } from 'sandstone'

export type JsonClampedLevelValue = {
  value: JsonLevelBasedValue,
  min: (NBTFloat | number),
  max: (NBTFloat | number),
}

export type JsonExponentLevelValue = {
  base: JsonLevelBasedValue,
  power: JsonLevelBasedValue,
}

export type JsonFractionLevelValue = {
  numerator: JsonLevelBasedValue,
  denominator: JsonLevelBasedValue,
}

export type JsonLevelBasedValue = ((NBTFloat | number) | JsonLevelBasedValueMap)

export type JsonLevelBasedValueMap = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:enchantment_level_based_value_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolLevelBasedValue ? JsonSymbolLevelBasedValue[S] : JsonRootNBT))
}[Extract<JsonRegistry['minecraft:enchantment_level_based_value_type'], string>])>

export type JsonLinearLevelValue = {
  /**
   * Base value at level 1.
   */
  base: (NBTFloat | number),
  /**
   * Value increase per level above 1.
   */
  per_level_above_first: (NBTFloat | number),
}

export type JsonLookupLevelValue = {
  /**
   * Indexed by `level - 1` to apply, if present
   *
   * Value:
   * List length range: 1..
   */
  values: JsonNBTList<JsonLevelBasedValue, {
    leftExclusive: false,
    min: 1,
  }>,
  /**
   * Applied if the level is greater than the size of `values`.
   */
  fallback: JsonLevelBasedValue,
}

export type JsonSquaredLevelValue = {
  /**
   * Added to the result so that the result becomes `square(level) + added`.
   */
  added: (NBTFloat | number),
}
type JsonLevelBasedValueDispatcherMap = {
  'clamped': JsonLevelBasedValueClamped,
  'minecraft:clamped': JsonLevelBasedValueClamped,
  'exponent': JsonLevelBasedValueExponent,
  'minecraft:exponent': JsonLevelBasedValueExponent,
  'fraction': JsonLevelBasedValueFraction,
  'minecraft:fraction': JsonLevelBasedValueFraction,
  'levels_squared': JsonLevelBasedValueLevelsSquared,
  'minecraft:levels_squared': JsonLevelBasedValueLevelsSquared,
  'linear': JsonLevelBasedValueLinear,
  'minecraft:linear': JsonLevelBasedValueLinear,
  'lookup': JsonLevelBasedValueLookup,
  'minecraft:lookup': JsonLevelBasedValueLookup,
}
type JsonLevelBasedValueKeys = keyof JsonLevelBasedValueDispatcherMap
type JsonLevelBasedValueFallback = (
  | JsonLevelBasedValueClamped
  | JsonLevelBasedValueExponent
  | JsonLevelBasedValueFraction
  | JsonLevelBasedValueLevelsSquared
  | JsonLevelBasedValueLinear
  | JsonLevelBasedValueLookup)
type JsonLevelBasedValueClamped = JsonClampedLevelValue
type JsonLevelBasedValueExponent = JsonExponentLevelValue
type JsonLevelBasedValueFraction = JsonFractionLevelValue
type JsonLevelBasedValueLevelsSquared = JsonSquaredLevelValue
type JsonLevelBasedValueLinear = JsonLinearLevelValue
type JsonLevelBasedValueLookup = JsonLookupLevelValue
export type JsonSymbolLevelBasedValue<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonLevelBasedValueDispatcherMap
  : CASE extends 'keys' ? JsonLevelBasedValueKeys : CASE extends '%fallback' ? JsonLevelBasedValueFallback : never
