import { ExecuteCommandNode } from 'sandstone/commands'

import { GenericSandstoneVisitor } from './visitor.js'

/**
 * Transforms several chained execute.run.execute.run... into a single execute
 */
export class UnifyChainedExecutesVisitor extends GenericSandstoneVisitor {
  visitExecuteCommandNode = (node: ExecuteCommandNode) => {
    if (node.body.length === 0) {
      return this.genericVisit(node)
    }

    const chainedCommand = node.body[0]
    if (chainedCommand && chainedCommand instanceof ExecuteCommandNode) {
      // The chained command is an execute.
      node.body = chainedCommand.body

      node.args.push(...chainedCommand.args)
    }

    return this.genericVisit(node)
  }
}
