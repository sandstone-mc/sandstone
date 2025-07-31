import { ExecuteCommandNode } from 'sandstone/commands'
import type { LoopNode } from 'sandstone/flow'
import { GenericSandstoneVisitor } from './visitor.js'

/**
 * Initialize the constants of the pack.
 */
export class LoopTransformationVisitor extends GenericSandstoneVisitor {
  visitLoopNode = (node_: LoopNode) => {
    return new ExecuteCommandNode(this.pack, node_.executeArgs, {
      isSingleExecute: false,
      givenCallbackName: 'loop',
      body: node_.body.map((node) => this.genericVisit(node)),
    })
  }

  visitWhileNode = this.visitLoopNode

  visitForINode = this.visitLoopNode

  visitForOfNode = this.visitLoopNode
}
