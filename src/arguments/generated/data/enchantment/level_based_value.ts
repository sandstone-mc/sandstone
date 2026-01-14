import type { Registry } from 'sandstone/arguments/generated/registry'
import type { NBTFloat, NBTList } from 'sandstone'
import type { RootNBT } from 'sandstone/arguments/nbt'

export type ClampedLevelValue = {
  value: LevelBasedValue
  min: NBTFloat
  max: NBTFloat
}

export type ExponentLevelValue = {
  base: LevelBasedValue
  power: LevelBasedValue
}

export type FractionLevelValue = {
  numerator: LevelBasedValue
  denominator: LevelBasedValue
}

export type LevelBasedValue = (NBTFloat | LevelBasedValueMap)

export type LevelBasedValueMap = ({
  [S in Extract<Registry['minecraft:enchantment_level_based_value_type'], string>]?: ({
    type: S
  } & (S extends keyof SymbolLevelBasedValue ? SymbolLevelBasedValue[S] : RootNBT));
}[Registry['minecraft:enchantment_level_based_value_type']])

export type LinearLevelValue = {
  /**
     * Base cost at level 1.
     */
  base: NBTFloat
  /**
     * Cost increase per level above 1.
     */
  per_level_above_first: NBTFloat
}

export type LookupLevelValue = {
  /**
     * Indexed by `level - 1` to apply, if present
     *
     * Value:
     * List length range: 1..
     */
  values: NBTList<LevelBasedValue, {
    leftExclusive: false
    min: 1
  }>
  /**
     * Applied if the level is greater than the size of `values`.
     */
  fallback: LevelBasedValue
}

export type SquaredLevelValue = {
  /**
     * Added to the exponent; `0.0` for squared, `1.0` for cubed, `.5` for square root, `-4` for negpow(2), etc.
     */
  added: NBTFloat
}
type LevelBasedValueDispatcherMap = {
  'clamped': LevelBasedValueClamped
  'minecraft:clamped': LevelBasedValueClamped
  'exponent': LevelBasedValueExponent
  'minecraft:exponent': LevelBasedValueExponent
  'fraction': LevelBasedValueFraction
  'minecraft:fraction': LevelBasedValueFraction
  'levels_squared': LevelBasedValueLevelsSquared
  'minecraft:levels_squared': LevelBasedValueLevelsSquared
  'linear': LevelBasedValueLinear
  'minecraft:linear': LevelBasedValueLinear
  'lookup': LevelBasedValueLookup
  'minecraft:lookup': LevelBasedValueLookup
}
type LevelBasedValueKeys = keyof LevelBasedValueDispatcherMap
type LevelBasedValueFallback = (
  | LevelBasedValueClamped
  | LevelBasedValueExponent
  | LevelBasedValueFraction
  | LevelBasedValueLevelsSquared
  | LevelBasedValueLinear
  | LevelBasedValueLookup)
type LevelBasedValueClamped = ClampedLevelValue
type LevelBasedValueExponent = ExponentLevelValue
type LevelBasedValueFraction = FractionLevelValue
type LevelBasedValueLevelsSquared = SquaredLevelValue
type LevelBasedValueLinear = LinearLevelValue
type LevelBasedValueLookup = LookupLevelValue
export type SymbolLevelBasedValue<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none' = 'map'> = CASE extends 'map'
  ? LevelBasedValueDispatcherMap
  : CASE extends 'keys' ? LevelBasedValueKeys : CASE extends '%fallback' ? LevelBasedValueFallback : never
