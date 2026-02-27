/* eslint-disable dot-notation */

import { FunctionCommandNode, ReturnRunCommandNode } from 'sandstone/commands'
import type { MCFunctionNode } from 'sandstone/core'
import { ContainerCommandNode } from 'sandstone/core'
import { GenericSandstoneVisitor } from './visitor'

/**
 * Transforms an execute with several nodes into an execute calling a new function.
 */
export class ContainerCommandsToMCFunctionVisitor extends GenericSandstoneVisitor {
  currentMCFunction: MCFunctionNode | null = null

  visitContainerCommandNode = (node_: ContainerCommandNode) => {
    const { node, mcFunction } = node_.createMCFunction(this.currentMCFunction)

    if (mcFunction) {
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
        const returnRunNode = new ReturnRunCommandNode(this.pack, ['run'])
        returnRunNode.body = [lastNode]
        node.body[node.body.length - 1] = returnRunNode
      }
    }

    this.core.currentNode = prev?.resource.name ?? ''

    this.currentMCFunction = prev

    return result
  }
}
