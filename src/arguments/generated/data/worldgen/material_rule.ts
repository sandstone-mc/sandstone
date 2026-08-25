import type { DensityFunctionRef } from 'sandstone/arguments/generated/data/worldgen/density_function.ts'
import type { MaterialConditionRef } from 'sandstone/arguments/generated/data/worldgen/material_condition.ts'
import type { Registry } from 'sandstone/arguments/generated/registry.ts'
import type { BlockState } from 'sandstone/arguments/generated/util/block_state.ts'
import type { NamespacedString, NBTFloat } from 'sandstone'

export type BlockRule = {
  result_state: BlockState,
}

export type ConditionRule = {
  if_true: MaterialConditionRef,
  then_run: MaterialRuleRef,
}

export type MaterialRule = NonNullable<({
  [S in Extract<Extract<Registry['minecraft:worldgen/material_rule_type'], string>, string>]?: ({
    type: S,
  } & (S extends keyof SymbolMaterialRule ? SymbolMaterialRule[S] : SymbolMaterialRule<'%unknown'>))
}[Extract<Registry['minecraft:worldgen/material_rule_type'], string>])>

export type MaterialRuleRef = (NamespacedString | MaterialRule)

export type OreVeinifier = {
  ore_block: BlockState,
  raw_ore_block: BlockState,
  filler_block: BlockState,
  /**
   * Value:
   * Range: 0..1
   */
  raw_ore_chance: NBTFloat<{
    leftExclusive: false,
    rightExclusive: false,
    min: 0,
    max: 1,
  }>,
  density: DensityFunctionRef,
  richness: DensityFunctionRef,
  filler_gap: DensityFunctionRef,
}

export type SequenceRule = {
  sequence: Array<MaterialRuleRef>,
}
type MaterialRuleDispatcherMap = {
  'block': MaterialRuleBlock,
  'minecraft:block': MaterialRuleBlock,
  'condition': MaterialRuleCondition,
  'minecraft:condition': MaterialRuleCondition,
  'ore_vein': MaterialRuleOreVein,
  'minecraft:ore_vein': MaterialRuleOreVein,
  'sequence': MaterialRuleSequence,
  'minecraft:sequence': MaterialRuleSequence,
}
type MaterialRuleKeys = keyof MaterialRuleDispatcherMap
type MaterialRuleFallback = (
  | MaterialRuleBlock
  | MaterialRuleCondition
  | MaterialRuleOreVein
  | MaterialRuleSequence
  | MaterialRuleFallbackType)
export type MaterialRuleFallbackType = Record<string, never>
type MaterialRuleBlock = BlockRule
type MaterialRuleCondition = ConditionRule
type MaterialRuleOreVein = OreVeinifier
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
