import type { MaterialConditionRef } from 'sandstone/arguments/generated/data/worldgen/material_condition.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.ts'

export type BlockRule = {
  result_state: BlockState,
}

export type ConditionRule = {
  if_true: MaterialConditionRef,
  then_run: MaterialRuleRef,
}

export type MaterialRule = NonNullable<({
  [S in Extract<Registry['minecraft:worldgen/material_rule'], string>]?: ({
    type: S,
  } & (S extends keyof SymbolMaterialRule ? SymbolMaterialRule[S] : SymbolMaterialRule<'%unknown'>))
}[Registry['minecraft:worldgen/material_rule']])>

export type MaterialRuleRef = MaterialRule

export type SequenceRule = {
  sequence: Array<MaterialRuleRef>,
}
type MaterialRuleDispatcherMap = {
  'block': MaterialRuleBlock,
  'minecraft:block': MaterialRuleBlock,
  'condition': MaterialRuleCondition,
  'minecraft:condition': MaterialRuleCondition,
  'sequence': MaterialRuleSequence,
  'minecraft:sequence': MaterialRuleSequence,
}
type MaterialRuleKeys = keyof MaterialRuleDispatcherMap
type MaterialRuleFallback = (
  | MaterialRuleBlock
  | MaterialRuleCondition
  | MaterialRuleSequence
  | MaterialRuleFallbackType)
export type MaterialRuleFallbackType = Record<string, never>
type MaterialRuleBlock = BlockRule
type MaterialRuleCondition = ConditionRule
type MaterialRuleSequence = SequenceRule
export type SymbolMaterialRule<CASE extends
  | 'map'
  | 'keys'
  | '%fallback'
  | '%none'
  | '%unknown' = 'map'> = CASE extends 'map'
  ? MaterialRuleDispatcherMap
  : CASE extends 'keys'
    ? MaterialRuleKeys
    : CASE extends '%fallback' ? MaterialRuleFallback : CASE extends '%unknown' ? MaterialRuleFallbackType : never
