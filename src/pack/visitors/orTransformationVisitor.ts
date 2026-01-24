import { ScoreboardCommandNode } from '../../commands'
import type { Node } from '../../core'
import { AndNode, type ConditionNode, IfNode, NotNode, OrNode } from '../../flow'
import { GenericSandstoneVisitor } from './visitor'

export class OrTransformationVisitor extends GenericSandstoneVisitor {
  visitIfNode = (node_: IfNode) => {
    const { preNodes, conditionNode } = this.parseConditionNode(node_.condition)
    node_.condition = conditionNode
    return [...preNodes, this.genericVisit(node_)]
  }

  parseConditionNode = (node: ConditionNode): { preNodes: Node[]; conditionNode: ConditionNode } => {
    if (node instanceof OrNode) {
      return this.parseOrNode(node)
    }
    if (node instanceof AndNode) {
      return this.parseAndNode(node)
    }
    if (node instanceof NotNode) {
      return this.parseNotNode(node)
    }

    // Default case, just return the node as is
    return { preNodes: [], conditionNode: node }
  }
  parseOrNode = (node: OrNode): { preNodes: Node[]; conditionNode: ConditionNode } => {
    const variable = this.core.pack.Variable(undefined, 'condition')

    const conditionNode = variable.equalTo(1)._toMinecraftCondition()

    const realPreNodes: Node[] = [new ScoreboardCommandNode(this.pack, 'players', 'reset', variable)]
    const orExecuteNodes = node.conditions.map((condition) => {
      const { preNodes, conditionNode: parsedConditionNode } = this.parseConditionNode(condition)
      realPreNodes.push(...preNodes)

      const ifNode = new IfNode(this.core, parsedConditionNode)
      ifNode.body = [new ScoreboardCommandNode(this.pack, 'players', 'set', variable, 1)]
      return ifNode
    })

    return {
      preNodes: [...realPreNodes, ...orExecuteNodes],
      conditionNode,
    }
  }
  parseAndNode = (node: AndNode): { preNodes: Node[]; conditionNode: ConditionNode } => {
    const finalPreNodes: Node[] = []

    const conditionNode = new AndNode(
      node.sandstoneCore,
      node.conditions.map((condition) => {
        const { preNodes, conditionNode } = this.parseConditionNode(condition)
        finalPreNodes.push(...preNodes)
        return conditionNode
      }),
    )

    return {
      preNodes: finalPreNodes,
      conditionNode,
    }
  }
  parseNotNode = (node: NotNode): { preNodes: Node[]; conditionNode: ConditionNode } => {
    const { preNodes, conditionNode } = this.parseConditionNode(node.condition)
    return {
      preNodes,
      conditionNode: new NotNode(node.sandstoneCore, conditionNode),
    }
  }
}
