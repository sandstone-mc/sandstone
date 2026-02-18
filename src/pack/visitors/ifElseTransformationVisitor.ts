/* eslint-disable no-spaced-func */
/* eslint-disable func-call-spacing */
import { ExecuteCommandNode, ReturnCommandNode, ReturnRunCommandNode } from 'sandstone/commands'
import { IfNode, ElseNode } from 'sandstone/flow'
import { GenericSandstoneVisitor } from './visitor'

function* flattenIfNode(node: IfNode): IterableIterator<IfNode | ElseNode> {
  yield node

  const next = node.nextFlowNode

  if (next instanceof IfNode) {
    yield* flattenIfNode(next)
  } else if (next) {
    yield next
  }
}

function handleMultipleNodes(visitor: GenericSandstoneVisitor, nodes: (ElseNode | IfNode)[]) {
  return nodes.flatMap((node, i) => {
    const { body } = node

    // If we have a "If" node, add the condition
    if (node instanceof IfNode) {
      const callbackName = i === 0 ? 'if' : 'elseif'

      let actualBody = body

      if (body.length === 1) {
        const child = visitor.visit(body[0])

        if (Array.isArray(child)) {
          actualBody = child
        } else {
          return new ExecuteCommandNode(visitor.pack, [[node.condition.getValue()]], {
            isSingleExecute: false,
            givenCallbackName: callbackName,
            body: [i === (nodes.length - 1) ? child : new ReturnCommandNode(visitor.pack, [`run ${child.getValue()}`])],
          })
        }
      }

      return new ExecuteCommandNode(visitor.pack, [[node.condition.getValue()]], {
        isSingleExecute: false,
        givenCallbackName: `${i}_${callbackName}`,
        body: [
          new ReturnRunCommandNode(visitor.pack, ['run'], {
            isSingleExecute: false,
            body: actualBody,
          }),
        ],
      })
    }
    // Else node, just add the body
    return body
  })
}

export class IfElseTransformationVisitor extends GenericSandstoneVisitor {
  visitIfNode = (node_: IfNode) => {
    // 1. We may be an elseIf node, if so, should exit
    if (node_._isElseIf) {
      return []
    }

    // Start by flattening all nodes
    const nodes = Array.from(flattenIfNode(node_))

    // 2. If we have a single if node. No need to store its result then.
    if (nodes.length === 1) {
      // If the body of the if node is just another if node 
      if (
        node_.body[0] instanceof IfNode
        && !node_.body.slice(1).some((node) => (!(node instanceof ElseNode) && (!(node instanceof IfNode) || node._isElseIf === false)))
      ) {
        const nodes = Array.from(flattenIfNode(node_.body[0]))

        return this.visit(new ExecuteCommandNode(this.pack, [[node_.condition.getValue()]], {
          isSingleExecute: false,
          givenCallbackName: 'if',
          body: handleMultipleNodes(this, nodes),
        }))
      }

      return this.visit(new ExecuteCommandNode(this.pack, [[node_.condition.getValue()]], {
        isSingleExecute: false,
        givenCallbackName: 'if',
        body: node_.body,
      }))
    }

    // 3. We have multiple nodes, entering a new function to allow for `return`

    const wrapper = new ExecuteCommandNode(this.pack, [], {
      isFake: true, // trolley
      isSingleExecute: false,
      givenCallbackName: 'if',
      body: handleMultipleNodes(this, nodes)
    })
    return this.visit(wrapper)
  }
}
