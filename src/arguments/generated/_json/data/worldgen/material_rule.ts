import type { JsonDensityFunctionRef } from 'sandstone/arguments/generated/_json/data/worldgen/density_function.ts'
import type { JsonMaterialConditionRef } from 'sandstone/arguments/generated/_json/data/worldgen/material_condition.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { NamespacedString, NBTFloat } from 'sandstone'

export type JsonBlockRule = {
  result_state: JsonBlockState,
}

export type JsonConditionRule = {
  if_true: JsonMaterialConditionRef,
  then_run: JsonMaterialRuleRef,
}

export type JsonMaterialRule = NonNullable<({
  [S in Extract<Extract<JsonRegistry['minecraft:worldgen/material_rule_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof JsonSymbolMaterialRule ? JsonSymbolMaterialRule[S] : JsonSymbolMaterialRule<'%unknown'>))
}[Extract<JsonRegistry['minecraft:worldgen/material_rule_type'], string>])>

export type JsonMaterialRuleRef = (NamespacedString | JsonMaterialRule)

export type JsonOreVeinifier = {
  ore_block: JsonBlockState,
  raw_ore_block: JsonBlockState,
  filler_block: JsonBlockState,
  /**
   * Value:
   * Range: 0..1
   */
  raw_ore_chance: (NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }> | number),
  density: JsonDensityFunctionRef,
  richness: JsonDensityFunctionRef,
  filler_gap: JsonDensityFunctionRef,
}

export type JsonSequenceRule = {
  sequence: Array<JsonMaterialRuleRef>,
}
type JsonMaterialRuleDispatcherMap = {
  'block': JsonMaterialRuleBlock,
  'minecraft:block': JsonMaterialRuleBlock,
  'condition': JsonMaterialRuleCondition,
  'minecraft:condition': JsonMaterialRuleCondition,
  'ore_vein': JsonMaterialRuleOreVein,
  'minecraft:ore_vein': JsonMaterialRuleOreVein,
  'sequence': JsonMaterialRuleSequence,
  'minecraft:sequence': JsonMaterialRuleSequence,
}
type JsonMaterialRuleKeys = keyof JsonMaterialRuleDispatcherMap
type JsonMaterialRuleFallback = (
  | JsonMaterialRuleBlock
  | JsonMaterialRuleCondition
  | JsonMaterialRuleOreVein
  | JsonMaterialRuleSequence
  | JsonMaterialRuleFallbackType)
export type JsonMaterialRuleFallbackType = Record<string, never>
type JsonMaterialRuleBlock = JsonBlockRule
type JsonMaterialRuleCondition = JsonConditionRule
type JsonMaterialRuleOreVein = JsonOreVeinifier
type JsonMaterialRuleSequence = JsonSequenceRule
export type JsonSymbolMaterialRule<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? JsonMaterialRuleDispatcherMap
  : CASE extends 'keys'
    ? JsonMaterialRuleKeys
    : CASE extends '%fallback'
      ? JsonMaterialRuleFallback
      : CASE extends '%unknown' ? JsonMaterialRuleFallbackType : never
