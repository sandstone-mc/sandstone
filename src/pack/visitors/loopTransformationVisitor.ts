import { GenericSandstoneVisitor } from './visitor.js'

import type { LoopNode } from 'sandstone/flow'

/**
 * Initialize the constants of the pack.
 */
export class LoopVisitor extends GenericSandstoneVisitor {
  visitLoopNode = (node_: LoopNode) => node_ // Help
}
