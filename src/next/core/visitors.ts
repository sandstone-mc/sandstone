import { ContainerCommandNode, ContainerNode } from '@/next/core'

import type { AdvancementNode, ExecuteNode, SayNode } from '@/next/commands'
import type { MCFunctionNode, Node, SandstoneCore } from '@/next/core'

export class GenericVisitor {
  constructor(public sandstoneCore: SandstoneCore) { }

  private getMethod(node: Node) {
    const className = node.constructor.name
    const methodName = `visit${className}` as const
    const that = this as unknown as Record<`visit${string}`, undefined | ((node_: Node) => Node | Node[])>

    const method = that[methodName]
    return method
  }

  visit: (node: Node) => (Node | Node[]) = (node) => {
    const visitedNode = this.genericVisit(node)

    const method = this.getMethod(visitedNode)
    if (method === undefined) {
      // No visitor method for ${className}. Just return the node.
      return visitedNode
    }

    const transformedNode = method(visitedNode)
    return transformedNode
  }

  genericVisit: <N extends Node>(node: N) => N = (node) => {
    // For a ContainerNode / a ContainerCommandNode, visit the body first.
    if (node instanceof ContainerNode || node instanceof ContainerCommandNode) {
      node.body = node.body.flatMap((child) => this.visit(child))
    }

    return node
  }

  // //// Those aren't necessary, but are here for better auto-completion & type-checking. //// //
  private genericNodeVisitor: <N extends Node>() => ((node: N) => Node | Node[]) = () => (node) => this.genericVisit(node)

  // Resource nodes must return a node of the same type.
  private genericResourceNodeVisitor: <N extends Node>() => ((node: N) => N) = () => (node) => this.genericVisit(node)

  // Generic nodes
  visitNode = this.genericNodeVisitor<Node>()

  visitContainerNode = this.genericNodeVisitor<ContainerNode>()

  visitCommandNode = this.genericNodeVisitor<ContainerCommandNode>()

  visitContainerCommandNode = this.genericNodeVisitor<ContainerCommandNode>()

  // Resources
  visitMCFunctionNode = this.genericResourceNodeVisitor<MCFunctionNode>()

  // Commands
  visitAdvancedCommandNode = this.genericNodeVisitor<AdvancementNode>()

  visitSayNode = this.genericNodeVisitor<SayNode>()

  visitExecuteNode = this.genericNodeVisitor<ExecuteNode>()
}
