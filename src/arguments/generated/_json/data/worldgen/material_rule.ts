import type { JsonMaterialConditionRef } from 'sandstone/arguments/generated/_json/data/worldgen/material_condition.ts'
import type { JsonRegistry } from 'sandstone/arguments/generated/_json/registry.ts'
import type { JsonBlockState } from 'sandstone/arguments/generated/_json/util/block_state.ts'
import type { NamespacedString } from 'sandstone'

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

export type JsonSequenceRule = {
  sequence: Array<JsonMaterialRuleRef>,
}
type JsonMaterialRuleDispatcherMap = {
  'block': JsonMaterialRuleBlock,
  'minecraft:block': JsonMaterialRuleBlock,
  'condition': JsonMaterialRuleCondition,
  'minecraft:condition': JsonMaterialRuleCondition,
  'sequence': JsonMaterialRuleSequence,
  'minecraft:sequence': JsonMaterialRuleSequence,
}
type JsonMaterialRuleKeys = keyof JsonMaterialRuleDispatcherMap
type JsonMaterialRuleFallback = (
  | JsonMaterialRuleBlock
  | JsonMaterialRuleCondition
  | JsonMaterialRuleSequence
  | JsonMaterialRuleFallbackType)
export type JsonMaterialRuleFallbackType = Record<string, never>
type JsonMaterialRuleBlock = JsonBlockRule
type JsonMaterialRuleCondition = JsonConditionRule
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
