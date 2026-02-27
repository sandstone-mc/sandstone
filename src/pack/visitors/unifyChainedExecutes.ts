import { ExecuteCommandNode } from 'sandstone/commands'

import { GenericSandstoneVisitor } from './visitor'

/**
 * Transforms several chained execute.run.execute.run... into a single execute.
 * Also unwraps execute nodes with no modifiers (e.g., `execute run say hello` -> `say hello`).
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

    // If execute has no modifiers (empty args), unwrap it and return the child command directly
    const flattenedArgs = node.args.flat(1).filter(a => a !== undefined && a !== null)
    if (flattenedArgs.length === 0 && node.body.length === 1) {
      // Just return the body command, no need for execute wrapper
      return this.genericVisit(node.body[0])
    }

    return this.genericVisit(node)
  }
}
