/* eslint-disable dot-notation */

import { ContainerCommandNode } from 'sandstone/core'

import { GenericSandstoneVisitor } from './visitor.js'

import type { MCFunctionNode } from 'sandstone/core'

let ifscore = 0

/**
 * Transforms an execute with several nodes into an execute calling a new function.
 */
export class ContainerCommandsToMCFunctionVisitor extends GenericSandstoneVisitor {
  currentMCFunction: MCFunctionNode | null = null

  visitContainerCommandNode = (node_: ContainerCommandNode) => {
    function getNamed(input: any) {
      const children: any[] = []
      if (Array.isArray(input)) {
        children.push(input.map((i) => getNamed(i)))
      }
      if (input instanceof ContainerCommandNode) {
        children.push(input.body.map((i) => getNamed(i)))
      }
      if (input.constructor.name === 'ExecuteCommandNode') {
        ifscore++

        if (ifscore % 100 === 0) console.log(input.args?.[0]?.[0])
      }
    }
    getNamed(node_)
    // console.log('out:', out.length, JSON.stringify(out), '\n')
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
