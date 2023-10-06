import {
  ContainerCommandNode, ContainerNode,
} from 'sandstone/core/index.js'

import type {
  AdvancementNode, CommandNode, ItemModifierNode, LootTableNode, MCFunctionNode,
  Node, PredicateNode, RecipeNode, SandstoneCore,
  TagNode, TrimMaterialNode, TrimPatternNode,
} from 'sandstone/core/index.js'

// eslint-disable-next-line @typescript-eslint/ban-types
export function ancestors(prototype: Function): string[] {
  if (!prototype.name) {
    return []
  }

  return [prototype.name, ...(ancestors(Object.getPrototypeOf(prototype)))]
}

export type NodeVisitorMethod = ((node_: Node) => Node | Node[])

export type GenericNodeVisitor<N extends Node> = (node: N) => Node | Node[]

export type GenericResourceNodeVisitor<N extends Node> = (node: N) => N

export class GenericCoreVisitor {
  private methodCache: Map<string, NodeVisitorMethod>

  constructor(public core: SandstoneCore) {
    this.methodCache = new Map()
  }

  private getSingleNodeMethod = (nodeName: string) => {
    const methodName = `visit${nodeName}` as const
    const that = this as unknown as Record<`visit${string}`, undefined | NodeVisitorMethod>
    const method = that[methodName]
    return method
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private getNodeMethods = (prototype: Function): NodeVisitorMethod => {
    // First, try to hit the cache
    const key = prototype.name
    const cachedResult = this.methodCache.get(key)
    if (cachedResult) {
      return cachedResult
    }

    // Else, find the different methods we need to chain
    const names = ancestors(prototype)

    for (const name of names) {
      const method = this.getSingleNodeMethod(name)
      if (method) {
        this.methodCache.set(key, method)
        return method
      }
    }

    const result: NodeVisitorMethod = (node_) => node_
    this.methodCache.set(key, result)
    return result
  }

  visit = (node: Node) => this.getNodeMethods(node.constructor)(node)

  genericVisit: <N extends Node>(node: N) => N = (node) => {
    if (node instanceof ContainerNode || node instanceof ContainerCommandNode) {
      node.body = node.body.flatMap((n) => this.visit(n))
    }
    return node
  }

  onStart = (): void => {}

  onEnd = (): void => {}

  protected genericNodeVisitor: <N extends Node>() => GenericNodeVisitor<N> = () => (node) => this.genericVisit(node)

  // Container nodes
  visitCommandNode = this.genericNodeVisitor<CommandNode>()

  visitContainerCommandNode = this.genericNodeVisitor<ContainerCommandNode>()

  visitContainerNode = this.genericNodeVisitor<ContainerNode>()

  // //// Those aren't necessary, but are here for better auto-completion & type-checking. //// //

  // Resources
  visitNode?: GenericNodeVisitor<Node>

  visitMCFunctionNode?: GenericResourceNodeVisitor<MCFunctionNode>

  visitAdvancementNode?: GenericResourceNodeVisitor<AdvancementNode>

  visitItemModifierNode?: GenericResourceNodeVisitor<ItemModifierNode>

  visitLootTableNode?: GenericResourceNodeVisitor<LootTableNode>

  visitPredicateNode?: GenericResourceNodeVisitor<PredicateNode>

  visitRecipeNode?: GenericResourceNodeVisitor<RecipeNode>

  visitTagNode?: GenericResourceNodeVisitor<TagNode>

  visitTrimMaterialNode?: GenericResourceNodeVisitor<TrimMaterialNode>

  visitTrimPatternNode?: GenericResourceNodeVisitor<TrimPatternNode>
}
