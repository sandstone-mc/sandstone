/* eslint-disable dot-notation */

import { FunctionCommandNode, ReturnRunCommandNode } from 'sandstone/commands'
import type { MCFunctionNode } from 'sandstone/core'
import { AwaitNode, ContainerCommandNode } from 'sandstone/core'
import { WithClass } from 'sandstone/flow/macro'
import { GenericSandstoneVisitor } from './visitor'

/**
 * Transforms an execute with several nodes into an execute calling a new function.
 */
export class ContainerCommandsToMCFunctionVisitor extends GenericSandstoneVisitor {
  currentMCFunction: MCFunctionNode | null = null

  visitContainerCommandNode = (node_: ContainerCommandNode) => {
    const { node, mcFunction } = node_.createMCFunction(this.currentMCFunction)

    if (mcFunction) {
      // Register the parent/child relationship so visitors like
      // `AwaitBodyVisitor.collectTransientHelpers` can iterate a
      // single MCFunction's children in O(n) instead of scanning
      // `core.resourceNodes` (O(n²)).
      if (this.currentMCFunction) {
        this.currentMCFunction.transientChildMCFunctions.add(mcFunction)
      }

      // The execute's body just got moved into a brand-new wrapper MCFunction.
      // Every WithClass inside it now lives here, not in its original caller —
      // update the containing reference so visitors like WithNodeVisitor can
      // look it up in O(1). Same for any AwaitNode so
      // `AwaitBodyVisitor.cleanupUntil` can find each await's direct
      // parent in O(1) instead of scanning `core.resourceNodes`.
      for (const node of mcFunction.body) {
        if (node instanceof WithClass) {
          node.containingMCFunction = mcFunction
        } else if (node instanceof AwaitNode) {
          node.parentMCFunction = mcFunction
        }
      }

      const visitedMCFunction = this.visitMCFunctionNode(mcFunction)
      this.core.resourceNodes.add(visitedMCFunction)
    } else if (node instanceof ContainerCommandNode && node.body) {
      this.genericVisit(node)
    }

    return Array.isArray(node) ? node.flatMap((n) => this.visit(n)) : node
  }

  visitMCFunctionNode = (node: MCFunctionNode) => {
    const prev = this.currentMCFunction

    this.currentMCFunction = node

    this.core.currentNode = node.resource.name

    // Visit the children of this node
    const result = this.genericVisit(node)

    // If the last node is a FunctionCommandNode and this is a sandstone-created function,
    // wrap it in return run to propagate return values
    if (node.resource.creator === 'sandstone' && node.body.length > 0) {
      const lastNode = node.body.at(-1)!
      if (lastNode instanceof FunctionCommandNode) {
        const returnRunNode = new ReturnRunCommandNode(this.pack, false, ['run'], {
          isFunctionBoundary: true,
        })
        returnRunNode.body = [lastNode]
        node.body[node.body.length - 1] = returnRunNode
      }
    }

    this.core.currentNode = prev?.resource.name ?? ''

    this.currentMCFunction = prev

    return result
  }
}
