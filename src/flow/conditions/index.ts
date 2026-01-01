export * from './and'
export * from './condition'
export * from './not'
export * from './or'
export * from './resources'
export * from './variables'

import * as resources from './resources'
import * as variables from './variables'

export const SandstoneConditions = {
  Advancement: resources.AdvancementConditionNode,
  Predicate: resources.PredicateConditionNode,
  Tag: resources.TagConditionNode,

  Biome: variables.BiomeConditionNode,
  Block: variables.BlockConditionNode,
  Blocks: variables.BlocksConditionNode,
  Dimension: variables.DimensionConditionNode,
  Function: variables.FunctionConditionNode,
  Loaded: variables.LoadedConditionNode,
  DataPointExists: variables.DataPointExistsConditionNode,
  DataPointEquals: variables.DataPointEqualsConditionNode,
  Label: variables.LabelConditionNode,
  Score: variables.ScoreConditionNode,
  Selector: variables.SelectorConditionNode,
  UUID: variables.UUIDConditionNode,
}
