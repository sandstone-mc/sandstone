/* eslint-disable dot-notation */

import { GenericSandstoneVisitor } from './visitor.js'

import type { ContainerCommandNode, MCFunctionNode } from 'sandstone/core'

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
    }

    return Array.isArray(node) ? node.flatMap((n) => this.visit(n)) : node
  }

  visitMCFunctionNode = (node: MCFunctionNode) => {
    const prev = this.currentMCFunction

    this.currentMCFunction = node

    // Visit the children of this node
    const result = this.genericVisit(node)

    this.currentMCFunction = prev

    return result
  }
}
