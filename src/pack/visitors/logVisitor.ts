/* eslint-disable dot-notation */

import { GenericSandstoneVisitor } from './visitor.js'

import type { GiveCommandNode } from 'sandstone/commands'

/**
 * Transforms an execute with several nodes into an execute calling a new function.
 */
export class LogVisitor extends GenericSandstoneVisitor {
  visitGiveCommandNode = (node: GiveCommandNode) => {
    console.log('One')
    return node
  }
}
