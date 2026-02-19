/* eslint-disable dot-notation */
import { ExecuteCommandNode, FunctionCommandNode } from 'sandstone/commands'
import { CommandNode } from 'sandstone/core/nodes'
import { ElseNode } from 'sandstone/flow'
import { LoopArgument } from 'sandstone/variables'

import { GenericSandstoneVisitor } from './visitor'

/**
 * Gets the effective single command from a function body, filtering out nodes that produce no output.
 * Returns the command if there's exactly one effective command, or null otherwise.
 */
function getEffectiveSingleCommand(body: any[]): any | null {
  // Filter out nodes that don't produce output (like ElseNode)
  const effectiveBody = body.filter((n) => !(n instanceof ElseNode))

  if (effectiveBody.length !== 1) {
    return null
  }

  let command = effectiveBody[0]

  // If it's a fake execute (used as wrapper), unwrap it
  if (command instanceof ExecuteCommandNode && command.isFake && command.body.length === 1) {
    command = command.body[0]
  }

  return command
}

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

    // Try to get effective single command, accounting for filtered nodes and fake executes
    let command = getEffectiveSingleCommand(mcFunctionNode.body)

    // Fall back to original logic if no effective single command
    if (!command) {
      if (mcFunctionNode.body.length === 1) {
        command = mcFunctionNode.body[0]
      } else {
        return this.genericVisit(node)
      }
    }

    if (!(command instanceof CommandNode)) {
      return this.genericVisit(node)
    }

    if (command instanceof LoopArgument) {
      return new FunctionCommandNode(this.pack, mcFunctionNode.resource.name)
    }

    // If the effective command is a function call, we can potentially eliminate the intermediate function
    if (command instanceof FunctionCommandNode) {
      const innerMCFunction = command.args[0]

      if (typeof innerMCFunction === 'string') {
        return this.genericVisit(node)
      }

      // Replace the outer execute's body with the inner function call
      // This eliminates the intermediate function layer
      node.body = [command]

      if (mcFunction.creator === 'sandstone') {
        this.core.resourceNodes.delete(mcFunctionNode)
      }

      return this.genericVisit(node)
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
