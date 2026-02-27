/* eslint-disable no-spaced-func */
/* eslint-disable func-call-spacing */
import { ExecuteCommandNode, ReturnRunCommandNode } from 'sandstone/commands'
import { IfNode, ElseNode } from 'sandstone/flow'
import { GenericSandstoneVisitor } from './visitor'
import type { DataPointClass } from 'sandstone/variables'

function* flattenIfNode(node: IfNode): IterableIterator<IfNode | ElseNode> {
  yield node

  const next = node.nextFlowNode

  if (next instanceof IfNode) {
    yield* flattenIfNode(next)
  } else if (next) {
    yield next
  }
}

function handleMultipleNodes(visitor: GenericSandstoneVisitor, nodes: (ElseNode | IfNode)[], macroStorage: DataPointClass | undefined) {
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
          return visitor.visit(new ExecuteCommandNode(visitor.pack, [[node.condition.getValue()]], {
            isSingleExecute: false,
            givenCallbackName: callbackName,
            body: [i === (nodes.length - 1) ? child : new ReturnRunCommandNode(visitor.pack, ['run'], {
              isSingleExecute: false,
              isFlowControl: true,
              body: [child],
            })],
            macroStorage,
          }))
        }
      }

      return visitor.visit(new ExecuteCommandNode(visitor.pack, [[node.condition.getValue()]], {
        isSingleExecute: false,
        givenCallbackName: `${i}_${callbackName}`,
        body: [
          new ReturnRunCommandNode(visitor.pack, ['run'], {
            isSingleExecute: false,
            isFlowControl: true,
            body: actualBody,
          }),
        ],
        macroStorage,
      }))
    }
    // Else node, visit and add the body
    return body.flatMap((n) => visitor.visit(n))
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

    const { parentMCFunction, condition, givenCallbackName, body } = node_

    // Use givenCallbackName if set (e.g., 'loop'), otherwise default to 'if'
    const callbackName = givenCallbackName ?? 'if'

    const macroStorage = parentMCFunction.resource.macroPoint

    // 2. If we have a single if node. No need to store its result then.
    if (nodes.length === 1) {
      const executeNode = new ExecuteCommandNode(this.pack, [[condition.getValue()]], {
        isSingleExecute: false,
        givenCallbackName: callbackName,
        body,
        macroStorage,
      })
      // Store reference for LoopArgument resolution
      node_.resultingExecuteNode = executeNode
      return this.visit(executeNode)
    }

    // 3. We have multiple nodes, if there isn't any tail nodes in the parent, we can use `return` safely without entering a new function

    if (nodes.at(-1) === parentMCFunction.body.at(-1)) {
      return handleMultipleNodes(this, nodes, macroStorage)
    }

    // 4. We have multiple nodes & there's tail nodes in the parent, entering a new function to allow for `return`

    const wrapper = new ExecuteCommandNode(this.pack, [], {
      isFake: true, // trolley
      isSingleExecute: false,
      givenCallbackName: callbackName,
      body: handleMultipleNodes(this, nodes, macroStorage),
      macroStorage: macroStorage,
    })
    // Store reference for LoopArgument resolution
    node_.resultingExecuteNode = wrapper
    return this.visit(wrapper)
  }
}
