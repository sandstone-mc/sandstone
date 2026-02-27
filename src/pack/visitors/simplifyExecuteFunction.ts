/* eslint-disable dot-notation */
import { ExecuteCommandNode, FunctionCommandNode, ReturnRunCommandNode } from 'sandstone/commands'
import { CommandNode,Node } from 'sandstone/core/nodes'
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
  visitExecuteCommandNode = (node: ExecuteCommandNode): Node | Node[] => {
    if (node.body.length === 0 || node.body.length > 1) {
      return this.genericVisit(node)
    }

    const functionNode = node.body[0]

    if (!(functionNode instanceof FunctionCommandNode)) {
      return this.genericVisit(node)
    }

    const mcFunction = functionNode.args[0]

    // Skip if function name is a string or doesn't have a .node property (e.g., MacroLiteral)
    if (typeof mcFunction === 'string' || !mcFunction?.node) {
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

    // Check for LoopArgument first since it extends Node, not CommandNode
    if (command instanceof LoopArgument) {
      // Get the loop function that LoopArgument references (through IfNode -> ExecuteCommandNode)
      const loopExecute = command.loopIfNode?.resultingExecuteNode
      const loopFunctionName = loopExecute?.createdMCFunction?.name
      if (loopFunctionName) {
        // Replace the execute's body with a direct call to the loop function
        node.body = [new FunctionCommandNode(this.pack, loopFunctionName)]

        // Delete the intermediate function
        if (mcFunction.creator === 'sandstone') {
          this.core.resourceNodes.delete(mcFunctionNode)
        }

        return this.genericVisit(node)
      }
      // Can't simplify without the loop reference
      return this.genericVisit(node)
    }

    if (!(command instanceof CommandNode)) {
      return this.genericVisit(node)
    }

    // If the effective command is a return run, check if it's needed for flow control
    if (command instanceof ReturnRunCommandNode) {
      if (mcFunction.creator === 'sandstone') {
        this.core.resourceNodes.delete(mcFunctionNode)
      }

      if (command.isFlowControl) {
        // Preserve return run for if/elseIf early exit semantics
        node.body = [this.genericVisit(command)]
      } else {
        const returnCmd = this.visit(command) as ReturnRunCommandNode
        // Unwrap - the return run was only for function boundary semantics
        node.body = returnCmd.body

        return this.visitExecuteCommandNode(node)
      }

      return this.genericVisit(node)
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
