/* eslint-disable dot-notation */
import { FunctionNode } from '@/next/commands'
import { MCFunctionClass } from '@/next/core/resources'
import { GenericVisitor } from '@/next/core/visitors'

import type { ExecuteNode } from '@/next/commands'
import type { MCFunctionNode } from '@/next/core'

/**
 * Transforms an execute with several nodes into an execute calling a new function.
 */
export class ExecuteWithNodesToMCFunctionVisitor extends GenericVisitor {
  currentMCFunction: MCFunctionNode | null = null

  visitExecuteNode = (node: ExecuteNode) => {
    if (!this.currentMCFunction || node.isSingleExecute) {
      return this.genericVisit(node)
    }

    // Create a new MCFunctionNode with the body of the ExecuteNode.
    const mcFunction = new MCFunctionClass(this.sandstoneCore, `${this.currentMCFunction.mcFunction.name}/execute`, {
      addToSandstoneCore: false,
    })
    const mcFunctionNode = mcFunction['node']
    mcFunctionNode.body = node.body

    // Visit the new MCFunctionNode. Also add it to the sandstoneCore MCFunctions.
    const visitedMCFunction = this.visitMCFunctionNode(mcFunctionNode)
    this.sandstoneCore.resourceNodes.add(visitedMCFunction)

    // Create a node calling this MCFunction.
    const mcFunctionCall = new FunctionNode(this.sandstoneCore, mcFunction)
    node.body = [mcFunctionCall]

    return node
  }

  visitMCFunctionNode = (node: MCFunctionNode) => {
    const prev = this.currentMCFunction

    this.currentMCFunction = node
    const result = this.genericVisit(node)

    this.currentMCFunction = prev

    return result
  }
}
