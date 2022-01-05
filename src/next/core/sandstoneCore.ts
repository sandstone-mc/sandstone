import type { MCFunctionClass, MCFunctionNode } from './resources/mcfunction'
import type { ResourceNode } from './resources/resource'
import type { GenericVisitor } from './visitors'

export class SandstoneCore {
  /** All Resources */
  resourceNodes: Set<ResourceNode>

  mcfunctionStack: MCFunctionNode[]

  constructor() {
    this.resourceNodes = new Set()
    this.mcfunctionStack = []
  }

  /**
   * The current MCFunction.
   */
  get currentMCFunction(): MCFunctionNode | undefined {
    return this.mcfunctionStack[this.mcfunctionStack.length - 1]
  }

  /**
   * Create a new MCFunction with the given name, and switch the currently active MCFunction to it.
   * @param mcfunction The MCFunction to switch to.
   * @return The newly created and active MCFunction.
   */
  enterMCFunction = (mcfunction: MCFunctionClass): MCFunctionNode => {
    /*
     * We cannot simply call mcfunction.node, because .node is protected to avoid polluting the autocompleted API.
     * However, TypeScript gives us a backdoor using this dynamic call, in a fully type-safe way.
     */
    // eslint-disable-next-line prefer-destructuring, dot-notation
    const node = mcfunction['node']
    this.mcfunctionStack.push(node)
    return node
  }

  /**
   * Leave the current MCFunction, and return to the previous one.
   * @return The previously active MCFunction.
   */
  exitMCFunction = () => this.mcfunctionStack.pop()

  save = (opts: { visitors: GenericVisitor[] }) => {
    // First, generate all the MCFunctions.
    for (const { resource } of this.resourceNodes) {
      resource.generate()
    }

    // Then, transform all the nodes with the given visitors.
    for (const visitor of opts.visitors) {
      for (const node of this.resourceNodes) {
        visitor.visit(node)
      }
    }

    // Finally, display the generated code.
    for (const node of this.resourceNodes) {
      console.log('='.repeat(80))
      console.log(node.resource.name)
      console.log('='.repeat(80))
      console.log(node.toString(), '\n')
    }
  }
}
