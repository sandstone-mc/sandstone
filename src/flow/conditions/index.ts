import { AdvancementConditionNode } from './resources/advancement.js'
import { PredicateConditionNode } from './resources/predicate.js'
import { TagConditionNode } from './resources/tag.js'
import { TrimMaterialConditionNode } from './resources/trimMaterial.js'
import { TrimPatternConditionNode } from './resources/trimPattern.js'
import { DataPointEqualsConditionNode, DataPointExistsConditionNode } from './variables/dataPoint.js'
import { LabelConditionNode } from './variables/label.js'
import { ScoreConditionNode } from './variables/score.js'
import { SelectorConditionNode } from './variables/selector.js'
import { UUIDConditionNode } from './variables/uuid.js'

export * from './and.js'
export * from './condition.js'
export * from './not.js'
export * from './or.js'
export * from './variables/score.js'

export const SandstoneConditions = {
  Advancement: AdvancementConditionNode,
  Predicate: PredicateConditionNode,
  Tag: TagConditionNode,
  TrimMaterial: TrimMaterialConditionNode,
  TrimPattern: TrimPatternConditionNode,
  DataPoint: DataPointExistsConditionNode,
  DataPointEquals: DataPointEqualsConditionNode,
  Label: LabelConditionNode,
  Score: ScoreConditionNode,
  Selector: SelectorConditionNode,
  UUID: UUIDConditionNode,
}
