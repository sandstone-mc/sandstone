/* eslint-disable dot-notation */

import { MCFunctionClass } from '#core'

import { GenericSandstoneVisitor } from './visitor'

import type { FunctionCommandNode, ScheduleCommandNode } from '#commands'

/**
 * Transforms an execute with several nodes into an execute calling a new function.
 */
export class GenerateLazyMCFunction extends GenericSandstoneVisitor {
  private generateLazyFunction(mcFunction: string | MCFunctionClass | undefined) {
    // If it's not a MCFunction / it's not lazy, there's nothing to do
    if (!(mcFunction instanceof MCFunctionClass) || !mcFunction['lazy']) {
      return
    }

    const mcFunctionNode = mcFunction['node']

    // We can generate the function.
    mcFunction['generate']()

    this.visit(mcFunctionNode)
  }

  visitFunctionCommandNode = (node: FunctionCommandNode) => {
    this.generateLazyFunction(node.args[0])
    return node
  }

  visitScheduleCommandNode = (node: ScheduleCommandNode) => {
    this.generateLazyFunction(node.args[1])
    return this.genericVisit(node)
  }
}
