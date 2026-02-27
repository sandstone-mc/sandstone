import type { LoopNode } from 'sandstone/flow'
import { IfNode } from 'sandstone/flow'
import { LoopArgument } from 'sandstone/variables'
import { GenericSandstoneVisitor } from './visitor'

/**
 * Transforms loop nodes into IfNodes, which are later transformed to ExecuteCommandNodes.
 * This allows OrTransformationVisitor to process Or conditions in loops.
 */
export class LoopTransformationVisitor extends GenericSandstoneVisitor {
  /**
   * The current loop's IfNode, used to set LoopArgument references.
   */
  currentLoopIfNode: IfNode | null = null

  visitLoopNode = (node_: LoopNode) => {
    const ifNode = new IfNode(this.core, node_.condition, undefined, node_.parentMCFunction)
    ifNode.givenCallbackName = 'loop'

    // Set the current loop IfNode before visiting children
    const previousLoopIfNode = this.currentLoopIfNode
    this.currentLoopIfNode = ifNode

    // Visit body nodes and add to IfNode (use visit instead of genericVisit to transform nested loops)
    ifNode.body = node_.body.flatMap((node) => this.visit(node))

    // Restore previous loop IfNode (for nested loops)
    this.currentLoopIfNode = previousLoopIfNode

    return ifNode
  }

  visitLoopArgument = (node_: LoopArgument) => {
    if (this.currentLoopIfNode) {
      node_.loopIfNode = this.currentLoopIfNode
    }
    return node_
  }

  visitWhileNode = this.visitLoopNode

  visitForINode = this.visitLoopNode

  visitForOfNode = this.visitLoopNode
}
