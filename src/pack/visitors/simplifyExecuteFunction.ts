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
    // Don't inline a loop's wrapping execute: it's the recursion target for
    // LoopArgument anywhere else in the loop body (e.g. inside `_.await.sleep`
    // continuations). Inlining it back into a one-shot `execute if cond run X`
    // strand means the LoopArgument inside the sleep's continuation calls a
    // nonexistent function. The wrapping mcfunction must survive.
    if (node.givenCallbackName === 'loop') {
      return this.genericVisit(node)
    }

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

      if (command.isFlowControl || !command.isFunctionBoundary) {
        // Preserve the return run. Either:
        //  - isFlowControl: wrapping an if/elseIf early-exit body
        //  - !isFunctionBoundary: user-written `returnCmd.run(...)` whose
        //    `return` keyword must be kept
        node.body = [this.genericVisit(command)]
      } else {
        // Auto-inserted function boundary wrapper around a function call.
        // The function it wrapped is being inlined here, so the wrapper
        // has no remaining purpose and can be safely unwrapped.
        const returnCmd = this.visit(command) as ReturnRunCommandNode
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
     * The called function is a single `execute`. `execute A run function F`,
     * where F is exactly `execute B run C`, is equivalent to `execute A B run C`
     * — the function boundary carries no semantics of its own.
     *
     * UnifyChainedExecutesVisitor performs this merge for directly-nested
     * executes, but it runs before us, while the inner execute is still behind
     * a `function` call. So the merge has to happen here.
     */
    if (command instanceof ExecuteCommandNode) {
      if (
        // A fake execute serializes as its body alone, so its args would be
        // dropped — there is nothing to merge onto.
        node.isFake
        // `function F with storage ...` feeds the callee's macro slots; once
        // inlined there is no call left to attach them to.
        || functionNode.args.length > 1
        // A loop's execute is the recursion target that LoopArgument resolves
        // through `createdMCFunction` — its function has to survive.
        || command.givenCallbackName === 'loop'
        // Only fold away functions Sandstone generated. A user's function may
        // be called from elsewhere, so it can't be deleted, and inlining
        // without deleting would alias its body into two places.
        || mcFunction.creator !== 'sandstone'
      ) {
        return this.genericVisit(node)
      }

      node.args.push(...command.args)
      node.body = command.body
      node.isMacro = node.isMacro || command.isMacro

      this.core.resourceNodes.delete(mcFunctionNode)
      // The function this pointed at no longer exists.
      node.createdMCFunction = null

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
