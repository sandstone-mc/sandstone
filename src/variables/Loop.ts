import { FunctionCommandNode } from '../commands/implementations/server/function'
import { Node } from '../core/nodes'
import type { IfNode } from '../flow/if_else'

import type { SandstonePack } from '../pack'

export class LoopArgument extends Node {
  /**
   * Reference to the loop's IfNode.
   * Set by LoopTransformationVisitor to enable correct function name resolution.
   * The IfNode's resultingExecuteNode is set by IfElseTransformationVisitor.
   */
  loopIfNode: IfNode | null = null

  constructor(private pack: SandstonePack) {
    super(pack.core)

    this.pack.appendNode(this)
  }

  getValue() {
    return this.toLoop()
  }

  toLoop() {
    // Get the ExecuteCommandNode through the IfNode reference
    const loopExecute = this.loopIfNode?.resultingExecuteNode

    // Use the loop execute's created MCFunction if available
    if (loopExecute?.createdMCFunction) {
      const funcNode = new FunctionCommandNode(this.pack, loopExecute.createdMCFunction.name)

      // If the loop uses macros, pass the storage through
      if (loopExecute.macroStorage) {
        funcNode.args.push(
          'with',
          'storage',
          loopExecute.macroStorage.currentTarget,
          loopExecute.macroStorage.path
        )
      }

      return funcNode.getValue()
    }
    // Fallback to current node (may be incorrect if inside nested function)
    return new FunctionCommandNode(this.pack, this.pack.core.currentNode)
  }
}
