import { GenericCoreVisitor } from 'sandstone/core/visitors'

import type {
  AdvancementCommandNode, AttributeCommandNode, CloneCommandNode, DataCommandNode, ExecuteCommandNode, FunctionCommandNode, GameRuleCommandNode, SayCommandNode,
} from 'sandstone/commands'
import type { GenericNodeVisitor } from 'sandstone/core/visitors'
import type { ElseNode, IfNode } from 'sandstone/flow'
import type { SandstonePack } from 'sandstone/pack'

export class GenericSandstoneVisitor extends GenericCoreVisitor {
  constructor(public readonly pack: SandstonePack) {
    super(pack.core)
  }

  // Other
  visitIfNode?: GenericNodeVisitor<IfNode>

  visitElseNode?: GenericNodeVisitor<ElseNode>

  // Commands
  visitAdvancementCommandNode?: GenericNodeVisitor<AdvancementCommandNode>

  visitAttributeCommandNode?: GenericNodeVisitor<AttributeCommandNode>

  visitCloneCommandNode?: GenericNodeVisitor<CloneCommandNode>

  visitDataCommandNode?: GenericNodeVisitor<DataCommandNode>

  visitExecuteCommandNode?: GenericNodeVisitor<ExecuteCommandNode>

  visitFunctionCommandNode?: GenericNodeVisitor<FunctionCommandNode>

  visitGameruleCommandNode?: GenericNodeVisitor<GameRuleCommandNode>

  visitSayCommandNode?: GenericNodeVisitor<SayCommandNode>
}
