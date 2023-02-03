import fs from 'fs-extra'
import path from 'path'

import type { SandstonePack } from 'sandstone'
import type { MCFunctionClass, MCFunctionNode } from './resources/mcfunction'
import type { ResourceNode } from './resources/resource'
import type { GenericCoreVisitor } from './visitors'

export class SandstoneCore {
  /** All Resources */
  resourceNodes: Set<ResourceNode>

  mcfunctionStack: MCFunctionNode[]

  constructor(public pack: SandstonePack) {
    this.resourceNodes = new Set()
    this.mcfunctionStack = []
  }

  /**
   * The current MCFunction.
   */
  get currentMCFunction(): MCFunctionNode | undefined {
    return this.mcfunctionStack[this.mcfunctionStack.length - 1]
  }

  getCurrentMCFunctionOrThrow = () => {
    const { currentMCFunction } = this

    if (!currentMCFunction) {
      throw new Error('This operation is invalid when outside a MCFunction.')
    }

    return currentMCFunction
  }

  /**
   * Enter a MCFunction, run the given callback, and then exit the MCFunction.
   * @param mcFunction The MCFunction to go in.
   * @param callback The callback to run.
   */
  insideMCFunction = (mcFunction: MCFunctionClass, callback: () => void) => {
    this.enterMCFunction(mcFunction)
    callback()
    this.exitMCFunction()
  }

  insideContext: MCFunctionNode['insideContext'] = (...args) => this.getCurrentMCFunctionOrThrow().insideContext(...args)

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

  generateResources = (opts: { visitors: GenericCoreVisitor[] }) => {
    const originalResources = new Set(this.resourceNodes)

    // First, generate all the MCFunctions.
    for (const { resource } of this.resourceNodes) {
      resource['generate']()
    }

    // Then, transform all the nodes with the given visitors.
    for (const visitor of opts.visitors) {
      visitor.onStart()

      for (const node of this.resourceNodes) {
        visitor.visit(node)
      }

      visitor.onEnd()
    }

    // Since visitors may change the resources, swap back to the previous ones.
    const finalResources = this.resourceNodes
    this.resourceNodes = originalResources

    return finalResources
  }

  save = async (opts: { visitors: GenericCoreVisitor[] }) => {
    const resources = this.generateResources(opts)

    for await (const node of resources) {
      const resourcePath = ['.sandstone', 'output', node.resource.packType.type, `${node.resource.path}.${node.resource.fileExtension}`]
      // eslint-disable-next-line no-nested-ternary
      const namespace = node.resource.packType.namespaced ? node.resource.name.includes(':') ? node.resource.name.split(':')[0] : this.pack.defaultNamespace : false
      const subFolder = node.resource.packType.resourceSubFolder

      if (namespace) {
        resourcePath.splice(2, 0, namespace)
      }

      if (subFolder) {
        resourcePath.splice(2, 0, subFolder)
      }

      await fs.writeFile(path.join(...resourcePath), node.getValue())
    }
  }
}
