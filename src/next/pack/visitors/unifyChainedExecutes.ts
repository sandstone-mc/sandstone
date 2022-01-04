import { ExecuteNode } from '@/next/commands'
import { GenericVisitor } from '@/next/core/visitors'

/**
 * Transforms several chained execute.run.execute.run... into a single execute
 */
export class UnifyChainedExecutesVisitor extends GenericVisitor {
  visitExecuteNode = (node: ExecuteNode) => {
    if (node.body.length === 0) {
      return this.genericVisit(node)
    }

    const chainedCommand = node.body[0]
    if (chainedCommand instanceof ExecuteNode) {
      // The chained command is an execute.
      node.body = [chainedCommand.body[0]]

      node.args.push(...chainedCommand.args)
    }

    return this.genericVisit(node)
  }
}
