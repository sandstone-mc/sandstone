import { AdvancementConditionNode } from './resources/advancement'
import { PredicateConditionNode } from './resources/predicate'
import { TagConditionNode } from './resources/tag'
import { TrimMaterialConditionNode } from './resources/trimMaterial'
import { TrimPatternConditionNode } from './resources/trimPattern'
import { DataPointEqualsConditionNode, DataPointExistsConditionNode } from './variables/dataPoint'
import { LabelConditionNode } from './variables/label'
import { ScoreConditionNode } from './variables/score'
import { SelectorConditionNode } from './variables/selector'
import { UUIDConditionNode } from './variables/uuid'

export * from './and'
export * from './condition'
export * from './not'
export * from './or'
export * from './variables/score'

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
