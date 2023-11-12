import { ExecuteCommandNode } from 'sandstone/commands'

import { GenericSandstoneVisitor } from './visitor.js'

import type { LoopNode } from 'sandstone/flow'

/**
 * Initialize the constants of the pack.
 */
export class LoopTransformationVisitor extends GenericSandstoneVisitor {
  visitLoopNode = (node_: LoopNode) => new ExecuteCommandNode(this.pack, node_.executeArgs, {
    isSingleExecute: false,
    givenCallbackName: 'loop',
    body: node_.body,
  })
}
