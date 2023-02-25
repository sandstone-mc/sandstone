/* eslint-disable operator-linebreak */
import fs from 'fs-extra'
import path from 'path'

import { handleDependencies } from '../pack/dependencies'

import type { SandstonePack } from 'sandstone'
import type { AwaitNode } from './nodes'
import type { _RawMCFunctionClass, MCFunctionClass, MCFunctionNode } from './resources/datapack/mcfunction'
import type { ResourceClass, ResourceNode } from './resources/resource'
import type { GenericCoreVisitor } from './visitors'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = import('node-fetch')

export class SandstoneCore {
  /** All Resources */
  resourceNodes: Set<ResourceNode>

  mcfunctionStack: MCFunctionNode[]

  awaitNodes: Set<AwaitNode>

  constructor(public pack: SandstonePack) {
    this.resourceNodes = new Set()
    this.mcfunctionStack = []
    this.awaitNodes = new Set()
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

  insideContext: MCFunctionNode['insideContext'] = (...args) => this.getCurrentMCFunctionOrThrow().insideContext(...args)

  /**
   * Create a new MCFunction with the given name, and switch the currently active MCFunction to it.
   * @param mcfunction The MCFunction to switch to.
   * @return The newly created and active MCFunction.
   */
  enterMCFunction = (mcfunction: _RawMCFunctionClass | MCFunctionClass): MCFunctionNode => {
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

  async getExistingResource(relativePath: string): Promise<string>

  async getExistingResource(relativePath: string, encoding: false): Promise<Buffer>

  async getExistingResource(relativePath: string, encoding: fs.EncodingOption): Promise<Buffer | string>

  async getExistingResource(resource: ResourceClass): Promise<Buffer | string>

  async getExistingResource(pathOrResource: string | ResourceClass, encoding: false | fs.EncodingOption = 'utf8'): Promise<Buffer | string> {
    if (typeof pathOrResource === 'string') {
      if (encoding === false) {
        return fs.readFile(pathOrResource)
      }
      return fs.readFile(pathOrResource, encoding)
    }
    const _path = pathOrResource.path
    if (_path[0] === 'minecraft') {
      const type = pathOrResource.packType.resourceSubFolder as string
      // TODO: Add cache to CLI
      // eslint-disable-next-line max-len
      const resource = (await (await fetch).default(`https://raw.githubusercontent.com/misode/mcmeta/${type}/${type}/${_path.join('/')}${pathOrResource.fileExtension ? `.${pathOrResource.fileExtension}` : ''}`))

      if (encoding === 'utf8') {
        return resource.text()
      }
      return resource.buffer()
    }
    // eslint-disable-next-line max-len
    const fullPath = path.join(process.env.WORKING_DIR as string, `resources/${path.join(pathOrResource.packType.type, ..._path)}${pathOrResource.fileExtension ? `.${pathOrResource.fileExtension}` : ''}`)

    if (pathOrResource.fileEncoding === false) {
      return fs.readFile(fullPath)
    }
    return fs.readFile(fullPath, pathOrResource.fileEncoding)
  }

  generateResources = (opts: { visitors: GenericCoreVisitor[] }) => {
    const originalResources = new Set(this.resourceNodes)

    // First, generate all the resources.
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

  save = async (cliOptions: { fileHandler: (relativePath: string, content: any) => Promise<void>, dry: boolean, verbose: boolean }, opts: { visitors: GenericCoreVisitor[] }) => {
    const resources = this.generateResources(opts)

    for await (const node of resources) {
      const { packType, fileExtension } = node.resource
      const _path = [packType.type, ...node.resource.path]

      if (packType.resourceSubFolder) {
        _path.splice(1, 0, packType.resourceSubFolder)
      }
      const resourcePath = path.join(..._path)

      const value = node.getValue()

      if (cliOptions.verbose) {
        console.log(
          `Path: ${resourcePath}.${fileExtension}\n\n` +
          `${typeof value === 'string' ? value : '<Buffer>'}`,
        )
      }

      /* @ts-ignore */
      if (!cliOptions.dry) {
        await cliOptions.fileHandler(`${resourcePath}.${fileExtension}`, value)
      }
    }

    handleDependencies(this.pack.dependencies)
  }
}
