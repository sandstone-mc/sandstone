export * from './and.js'
export * from './condition.js'
export * from './not.js'
export * from './or.js'
export * from './resources/index.js'
export * from './variables/index.js'

import * as resources from './resources/index.js'
import * as variables from './variables/index.js'

export const SandstoneConditions = {
  Advancement: resources.AdvancementConditionNode,
  Predicate: resources.PredicateConditionNode,
  Tag: resources.TagConditionNode,
  TrimMaterial: resources.TrimMaterialConditionNode,
  TrimPattern: resources.TrimPatternConditionNode,

  Biome: variables.BiomeConditionNode,
  Block: variables.BlockConditionNode,
  Blocks: variables.BlocksConditionNode,
  Dimension: variables.FunctionConditionNode,
  Function: variables.FunctionConditionNode,
  Loaded: variables.LoadedConditionNode,
  DataPointExists: variables.DataPointExistsConditionNode,
  DataPointEquals: variables.DataPointEqualsConditionNode,
  Label: variables.LabelConditionNode,
  Score: variables.ScoreConditionNode,
  Selector: variables.SelectorConditionNode,
  UUID: variables.UUIDConditionNode,
}
