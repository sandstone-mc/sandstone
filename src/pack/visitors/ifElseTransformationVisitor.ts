/* eslint-disable no-spaced-func */
/* eslint-disable func-call-spacing */
import { ExecuteCommandNode, ReturnCommandNode, ReturnRunCommandNode } from 'sandstone/commands'
import { IfNode } from 'sandstone/flow'

import { GenericSandstoneVisitor } from './visitor.js'

import type { ElseNode } from 'sandstone/flow'

function* flattenIfNode(node: IfNode): IterableIterator<IfNode | ElseNode> {
  yield node

  const next = node.nextFlowNode

  if (next instanceof IfNode) {
    yield* flattenIfNode(next)
  } else if (next) {
    yield next
  }
}

export class IfElseTransformationVisitor extends GenericSandstoneVisitor {
  visitIfNode = (node_: IfNode) => {
    // 1. We may be an elseIf node, if so, should exit
    if (node_['_isElseIf']) {
      return []
    }

    // Start by flattening all nodes
    const nodes = Array.from(flattenIfNode(node_))

    // 2. If we have a single if node. No need to store its result then.
    if (nodes.length === 1) {
      return new ExecuteCommandNode(this.pack, [[node_.condition.getValue()]], {
        isSingleExecute: false,
        givenCallbackName: 'if',
        body: node_.body,
      })
    }

    // 3. We have multiple nodes, entering a new function to allow for `return`

    const wrapper = new ExecuteCommandNode(this.pack, [], {
      isFake: true,
      isSingleExecute: false,
      givenCallbackName: 'if',
      body: nodes.flatMap((node, i) => {
        const { body } = node

        // If we have a "If" node, add the condition
        if (node instanceof IfNode) {
          const callbackName = i === 0 ? 'if' : 'elseif'

          if (body.length === 1) {
            return new ExecuteCommandNode(this.pack, [[node.condition.getValue()]], {
              isSingleExecute: false,
              givenCallbackName: callbackName,
              body: [new ReturnCommandNode(this.pack, [`run ${body[0].getValue()}`])],
            })
          }

          const last = body[body.length - 1]

          if (!((last instanceof ReturnCommandNode) || (last instanceof ReturnRunCommandNode))) {
            body.push(new ReturnCommandNode(this.pack, [0]))
          }

          return new ExecuteCommandNode(this.pack, [[node.condition.getValue()]], {
            isSingleExecute: false,
            givenCallbackName: `${i}_${callbackName}`,
            body,
          })
        }
        // Else node, just add the body
        return body
      }),
    })
    return [wrapper]
  }
}
