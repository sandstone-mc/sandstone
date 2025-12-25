/* eslint-disable dot-notation */

import type { FunctionCommandNode, ScheduleCommandNode } from 'sandstone/commands'
import { MCFunctionClass } from 'sandstone/core'
import { GenericSandstoneVisitor } from './visitor'

// TODO: Add support for macros

/**
 * Transforms an execute with several nodes into an execute calling a new function.
 */
export class GenerateLazyMCFunction extends GenericSandstoneVisitor {
  private generateLazyFunction(mcFunction: string | MCFunctionClass<any, any> | undefined) {
    // If it's not a MCFunction / it's not lazy, there's nothing to do
    if (!(mcFunction instanceof MCFunctionClass) || !mcFunction.lazy) {
      return
    }

    const mcFunctionNode = mcFunction.node

    // We can generate the function.
    mcFunction.generate()

    this.visit(mcFunctionNode)
  }

  visitFunctionCommandNode = (node: FunctionCommandNode) => {
    this.generateLazyFunction(node.args[0])
    return node
  }

  visitScheduleCommandNode = (node: ScheduleCommandNode) => {
    /* @ts-ignore */
    this.generateLazyFunction(node.args[1])
    return this.genericVisit(node)
  }
}
