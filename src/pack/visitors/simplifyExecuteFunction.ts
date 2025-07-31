/* eslint-disable dot-notation */
import { ExecuteCommandNode, FunctionCommandNode } from 'sandstone/commands'
import { CommandNode } from 'sandstone/core/nodes'
import { LoopArgument } from 'sandstone/variables'

import { GenericSandstoneVisitor } from './visitor.js'

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

    const mcFunctionNode = mcFunction.node

    if (mcFunctionNode.body.length > 1) {
      return this.genericVisit(node)
    }

    // We know the function is a single-node function.
    let command = mcFunctionNode.body[0]

    if (!(command instanceof CommandNode)) {
      return this.genericVisit(node)
    }

    if (command instanceof LoopArgument) {
      return new FunctionCommandNode(this.pack, mcFunctionNode.resource.name)
    }

    // Yes this should be recursive, but I'm lazy. This cleans up Flow's mess.
    if (command instanceof FunctionCommandNode) {
      const innerMCFunction = command.args[0]

      if (typeof innerMCFunction === 'string') {
        return this.genericVisit(node)
      }

      const innerMCFunctionNode = innerMCFunction.node

      if (innerMCFunctionNode.body.length > 1) {
        return this.genericVisit(node)
      }

      command = innerMCFunctionNode.body[0]

      if (innerMCFunction.creator === 'sandstone') {
        this.core.resourceNodes.delete(innerMCFunctionNode)
      }
    }

    /*
     * And it's a command! Now, we can simplify the execute, except if the other command is a /execute too.
     */
    if (command instanceof ExecuteCommandNode) {
      // In that case, if the initial /execute does not imply multiple executions, we could still simplify it.
      return this.genericVisit(node)
    }

    // We can safely simplify the execute. If the called command is not a user-created MCFunction, we can safely delete it.]
    node.body = [this.genericVisit(command)]

    if (mcFunction.creator === 'sandstone') {
      this.core.resourceNodes.delete(mcFunctionNode)
    }

    return this.genericVisit(node)
  }
}
