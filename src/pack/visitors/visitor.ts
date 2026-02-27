import type {
  AdvancementCommandNode,
  AttributeCommandNode,
  CloneCommandNode,
  DataCommandNode,
  ExecuteCommandNode,
  FunctionCommandNode,
  GameRuleCommandNode,
  SayCommandNode,
} from 'sandstone/commands'
import type { GenericNodeVisitor } from 'sandstone/core/visitors'
import { GenericCoreVisitor } from 'sandstone/core/visitors'
import type { ConditionCaseNode, DefaultCaseNode, ElseNode, IfNode, LoopNode, StaticCaseNode, SwitchNode } from 'sandstone/flow'
import type { SandstonePack } from 'sandstone/pack'
import type { LoopArgument } from 'sandstone/variables'

export class GenericSandstoneVisitor extends GenericCoreVisitor {
  constructor(public readonly pack: SandstonePack) {
    super(pack.core)
  }

  // Flow
  visitIfNode?: GenericNodeVisitor<IfNode>

  visitElseNode?: GenericNodeVisitor<ElseNode>

  visitLoopNode?: GenericNodeVisitor<LoopNode>

  visitSwitchNode?: GenericNodeVisitor<SwitchNode>

  visitStaticCaseNode?: GenericNodeVisitor<StaticCaseNode>

  visitConditionCaseNode?: GenericNodeVisitor<ConditionCaseNode>

  visitDefaultCaseNode?: GenericNodeVisitor<DefaultCaseNode>

  // Variables

  visitLoopArgumentNode?: GenericNodeVisitor<LoopArgument>

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
