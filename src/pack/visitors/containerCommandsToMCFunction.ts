/* eslint-disable dot-notation */

import { ContainerCommandNode } from 'sandstone/core'

import { GenericSandstoneVisitor } from './visitor.js'

import type { MCFunctionNode } from 'sandstone/core'

// let bippity = 0

// let boppity = 0

/**
 * Transforms an execute with several nodes into an execute calling a new function.
 */
export class ContainerCommandsToMCFunctionVisitor extends GenericSandstoneVisitor {
  currentMCFunction: MCFunctionNode | null = null

  visitContainerCommandNode = (node_: ContainerCommandNode) => {
    // console.log('bippity', bippity++)
    const { node, mcFunction } = node_.createMCFunction(this.currentMCFunction)

    if (mcFunction) {
      const visitedMCFunction = this.visitMCFunctionNode(mcFunction)
      this.core.resourceNodes.add(visitedMCFunction)
    } else if (node instanceof ContainerCommandNode && node.body) {
      for (const [i, child] of node.body.entries()) {
        const visit = this.genericVisit(child)
        node.body.splice(i, 1, ...(Array.isArray(visit) ? visit : [visit]))
      }
    }

    return Array.isArray(node) ? node.flatMap((n) => this.genericVisit(n)) : node
  }

  visitMCFunctionNode = (node: MCFunctionNode) => {
    // console.log('boppity', boppity++)
    const prev = this.currentMCFunction

    this.currentMCFunction = node

    this.core.currentNode = node.resource.name

    // Visit the children of this node
    const result = this.genericVisit(node)

    this.core.currentNode = prev?.resource.name ?? ''

    this.currentMCFunction = prev

    return result
  }
}
