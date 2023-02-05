/* eslint-disable dot-notation */
import { ExecuteCommandNode, FunctionCommandNode } from '@commands'
import { CommandNode } from '@core'

import { GenericSandstoneVisitor } from './visitor'

/**
 * Simplifies an execute calling a 1-command function to a single execute, with some exceptions.
 */
export class SimplifyExecuteFunctionVisitor extends GenericSandstoneVisitor {
  visitExecuteCommandNode = (node: ExecuteCommandNode) => {
    if (node.body.length === 0 || node.body.length > 1) {
      return this.genericVisit(node)
    }

    const functionNode = node.body[0]
    if (!(functionNode instanceof FunctionCommandNode)) {
      return this.genericVisit(node)
    }

    const mcFunction = functionNode.args[0]

    if (typeof mcFunction === 'string') {
      return this.genericVisit(node)
    }

    const mcFunctionNode = mcFunction['node']

    if (mcFunctionNode.body.length > 1) {
      return this.genericVisit(node)
    }

    // We know the function is a single-node function.
    const command = mcFunctionNode.body[0]

    if (!(command instanceof CommandNode)) {
      return this.genericVisit(node)
    }

    /*
     * And it's a command! Now, we can simplify the execute, except if the other command is a /execute too.
     */
    if (command instanceof ExecuteCommandNode) {
      // In that case, if the initial /execute does not imply multiple executions, we could still simplify it.
      return this.genericVisit(node)
    }

    // We can safely simplify the execute. If the called command is not a user-created MCFunction, we can safely delete it.
    node.body = [command]

    if (mcFunction['creator'] === 'sandstone') {
      this.core.resourceNodes.delete(mcFunctionNode)
    }

    return this.genericVisit(node)
  }
}
