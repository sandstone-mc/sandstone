/* eslint-disable dot-notation */
import { ExecuteCommandNode, FunctionCommandNode, ReturnRunCommandNode } from 'sandstone/commands'
import { CommandNode,Node } from 'sandstone/core/nodes'
import { ElseNode } from 'sandstone/flow'
import { LoopArgument } from 'sandstone/variables'

import { GenericSandstoneVisitor } from './visitor'

/**
 * When set to `'1'`, `SimplifyExecuteFunctionVisitor` traces every recursive
 * call into `visitExecuteCommandNode` plus the action it took. Useful for
 * debugging why a chain didn't inline as expected. Off by default.
 *
 *   SANDSTONE_DEBUG_SIMPLIFY_EXEC=1 sand build
 */
const DEBUG_SIMPLIFY_EXEC = (): boolean => process.env.SANDSTONE_DEBUG_SIMPLIFY_EXEC === '1'

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
  /** Recursion depth for debug logging. Increments on entry, decrements on exit. */
  private depth = 0

  /** Whether debug logging is currently active. Read once per call (env var can change between calls). */
  private debugging = DEBUG_SIMPLIFY_EXEC()

  private debug = (msg: string): void => {
    if (!this.debugging) return
    console.log(`[SimplifyExec:${'  '.repeat(this.depth)}${msg}`)
  }

  private debugEnter = (node: ExecuteCommandNode): void => {
    if (!this.debugging) return
    this.depth++
    const args = node.args.map((a) => (typeof a === 'string' ? JSON.stringify(a) : '...'))
    this.debug(`> enter callbackName=${node.givenCallbackName ?? '-'} args=[${args.join(',')}] bodyLen=${node.body.length}`)
  }

  private debugExit = (msg: string): void => {
    if (!this.debugging) return
    this.debug(`< exit (${msg})`)
    this.depth--
  }

  visitExecuteCommandNode = (node: ExecuteCommandNode): Node | Node[] => {
    this.debugEnter(node)

    // Don't inline a loop's wrapping execute: it's the recursion target for
    // LoopArgument anywhere else in the loop body (e.g. inside `_.await.sleep`
    // continuations). Inlining it back into a one-shot `execute if cond run X`
    // strand means the LoopArgument inside the sleep's continuation calls a
    // nonexistent function. The wrapping mcfunction must survive.
    if (node.givenCallbackName === 'loop') {
      this.debugExit('loop callback, skipped')
      return this.genericVisit(node)
    }

    if (node.body.length === 0 || node.body.length > 1) {
      this.debugExit(`body.length=${node.body.length}, no inline`)
      return this.genericVisit(node)
    }

    const functionNode = node.body[0]

    if (!(functionNode instanceof FunctionCommandNode)) {
      this.debugExit('body[0] not FunctionCommandNode')
      return this.genericVisit(node)
    }

    const mcFunction = functionNode.args[0]

    // Skip if function name is a string or doesn't have a .node property (e.g., MacroLiteral)
    if (typeof mcFunction === 'string' || !mcFunction?.node) {
      this.debugExit('mcFunction not an instance')
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
        this.debugExit(`no effective single command in ${mcFunctionNode.resource?.name}`)
        return this.genericVisit(node)
      }
    }

    this.debug(`  effective command class=${command?.constructor?.name}`)

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

        this.debugExit(`loopArg -> call ${loopFunctionName}`)
        return this.genericVisit(node)
      }
      // Can't simplify without the loop reference
      this.debugExit('loopArg without reference')
      return this.genericVisit(node)
    }

    if (!(command instanceof CommandNode)) {
      this.debugExit('effective command not a CommandNode')
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

        this.debugExit('returnRun auto-boundary, re-run')
        return this.visitExecuteCommandNode(node)
      }

      this.debugExit('returnRun preserved')
      return this.genericVisit(node)
    }

    // If the effective command is a function call, we can potentially eliminate the intermediate function
    if (command instanceof FunctionCommandNode) {
      const innerMCFunction = command.args[0]

      if (typeof innerMCFunction === 'string') {
        this.debugExit('inner function call is string macro, skip')
        return this.genericVisit(node)
      }

      // Replace the outer execute's body with the inner function call
      // This eliminates the intermediate function layer
      node.body = [command]

      if (mcFunction.creator === 'sandstone') {
        this.core.resourceNodes.delete(mcFunctionNode)
      }

      this.debug(`  collapsed ${mcFunctionNode.resource?.name} -> inner function call`)

      // Re-run so the new body — now a `function F2` call — can be inlined
      // through the same logic (e.g., `execute A run function F1` where F1
      // contains `function F2` becomes `execute A run function F2`, and
      // a further visit inlines F2 too).
      const result = this.visitExecuteCommandNode(node)
      this.debugExit('FunctionCommandNode branch (collapsed F1)')
      return result
    }

    /*
     * And it's a command! Now, we can simplify the execute, except if the other command is a /execute too.
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
        this.debugExit('ExecuteCommandNode guard tripped')
        return this.genericVisit(node)
      }

      const innerArgs = command.args.map((a) => (typeof a === 'string' ? JSON.stringify(a) : '...'))
      node.args.push(...command.args)
      node.body = command.body
      node.isMacro = node.isMacro || command.isMacro

      this.core.resourceNodes.delete(mcFunctionNode)
      // The function this pointed at no longer exists.
      node.createdMCFunction = null

      this.debug(`  merged inner execute (args=[${innerArgs.join(',')}])`)

      // Re-run so the merged body — often now a `function F2` call left
      // over from the inner execute — gets inlined in turn. Without this
      // recursive visit, `execute as @e if … run function F1` where F1
      // contains `execute if … run function F2` would leave F2 surviving
      // even though the only call to it is one execute chain away.
      const result = this.visitExecuteCommandNode(node)
      this.debugExit('ExecuteCommandNode merge (deleted F1)')
      return result
    }

    // We can safely simplify the execute. If the called command is not a user-created MCFunction, we can safely delete it.]
    node.body = [this.genericVisit(command)]

    if (mcFunction.creator === 'sandstone') {
      this.core.resourceNodes.delete(mcFunctionNode)
    }

    this.debugExit(`inlined single command, deleted ${mcFunctionNode.resource?.name}`)
    return this.genericVisit(node)
  }
}
