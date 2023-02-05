import { ExecuteCommandNode } from '@commands'
import { IfNode, NotNode, ScoreConditionNode } from '@flow'
import { ObjectiveClass } from '@variables'

import { GenericSandstoneVisitor } from './visitor'

import type { ConditionNode, ElseNode } from '@flow'

function* flattenIfNode(node: IfNode): IterableIterator<IfNode | ElseNode> {
  yield node

  const next = node.nextFlowNode

  if (next instanceof IfNode) {
    yield* flattenIfNode(next)
  } else if (next) {
    yield next
  }
}

const IF_OBJECTIVE = {
  objective: 'sandstone',
  name: 'if_result',
}

export class IfElseTransformationVisitor extends GenericSandstoneVisitor {
  visitIfNode = (node_: IfNode) => {
    // Start by flattening all nodes
    const nodes = Array.from(flattenIfNode(node_))

    const ifScore = new ObjectiveClass(this.pack, IF_OBJECTIVE.objective, undefined, undefined, { creator: 'sandstone' }).ScoreHolder(IF_OBJECTIVE.name)

    // 1. If we have a single if node. No need to store its result then.
    if (nodes.length === 1) {
      return new ExecuteCommandNode(this.pack, [[node_.condition.getValue()]], {
        isSingleExecute: false,
        givenCallbackName: 'if',
        body: node_.body,
      })
    }

    const { flow } = this.pack

    const transformedNodes = nodes.flatMap((node, i) => {
      const conditions: ConditionNode[] = []

      if (i > 0) {
        conditions.push(new NotNode(this.core, new ScoreConditionNode(this.core, ifScore, 'matches', '0..')))
        /*
         * TODO: replace with a real, existing objective
         * conditions.push(flow.not(createCondition(['unless', 'score', IF_OBJECTIVE.name, IF_OBJECTIVE.objective, 'matches', '0..'])))
         */
      }

      let callbackName: string
      const { body } = node

      // If we have a "If" node, add the condition
      if (node instanceof IfNode) {
        conditions.push(node.condition)
        callbackName = i === 0 ? 'if' : 'elseif'
      } else {
        callbackName = 'else'
      }

      return new ExecuteCommandNode(this.pack, [], {
        isSingleExecute: false,
        givenCallbackName: callbackName,
        body,
      })
    })
    return node_
  }
}
