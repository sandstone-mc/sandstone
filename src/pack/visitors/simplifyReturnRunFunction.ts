import { ExecuteCommandNode, FunctionCommandNode, ReturnCommandNode, ReturnRunCommandNode } from 'sandstone/commands'
import type { Node } from 'sandstone/core'
import { CommandNode } from 'sandstone/core/nodes'
import { ElseNode } from 'sandstone/flow'

import { GenericSandstoneVisitor } from './visitor'
import { isMacroArgument } from 'sandstone/core/Macro'

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
 * Simplifies a return run calling a 1-command function to a single execute, with some exceptions.
 */
export class SimplifyReturnRunFunctionVisitor extends GenericSandstoneVisitor {
  visitReturnRunCommandNode = (node: ReturnRunCommandNode): Node | Node[] => {

    if (node.body.length === 0 || node.body.length > 1) {
      return this.genericVisit(node)
    }

    const childNode = node.body[0]

    if (!(childNode instanceof FunctionCommandNode)) {
      if (childNode instanceof ReturnRunCommandNode) {
        return this.visitReturnRunCommandNode(childNode)
      }
      if (childNode instanceof ReturnCommandNode) {
        return this.genericVisit(childNode)
      }
      return this.genericVisit(node)
    }

    const mcFunction = childNode.args[0]

    if (typeof mcFunction === 'string' || isMacroArgument(this.core, mcFunction)) {
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

    // If the effective command is a function call, we can eliminate the intermediate function
    if (command instanceof FunctionCommandNode) {
      // Replace the return run's body with the inner function call
      node.body = [command]

      if (mcFunction.creator === 'sandstone') {
        this.core.resourceNodes.delete(mcFunctionNode)
      }

      return this.genericVisit(node)
    }

    // If the effective command is a return run, flatten it:
    // "return run function X" where X = "return run Y" becomes "return run Y"
    if (command instanceof ReturnRunCommandNode) {
      // Take the inner return run's body (Y) and use it as our body
      node.body = command.body
      // Propagate flow control flag - if inner was flow control, outer should be too
      node.isFlowControl = node.isFlowControl || command.isFlowControl

      if (mcFunction.creator === 'sandstone') {
        this.core.resourceNodes.delete(mcFunctionNode)
      }

      // Recursively re-process in case further flattening is possible
      // (e.g., return run function X where X = return run function Y where Y = return run tellraw)
      return this.visitReturnRunCommandNode(node)
    }

    // If the effective command is a return, unwrap it:
    // "return run function X" where X = "return Y" becomes "return Y"
    if (command instanceof ReturnCommandNode) {
      if (mcFunction.creator === 'sandstone') {
        this.core.resourceNodes.delete(mcFunctionNode)
      }

      return this.genericVisit(command)
    }

    // We can safely simplify the execute. If the called command is not a user-created MCFunction, we can safely delete it.
    node.body = [this.genericVisit(command)]

    if (mcFunction.creator === 'sandstone') {
      this.core.resourceNodes.delete(mcFunctionNode)
    }

    return this.genericVisit(node)
  }
}
