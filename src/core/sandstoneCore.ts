/* eslint-disable operator-linebreak */

import path from 'node:path'
import fs from 'fs-extra'
import type { SandstonePack } from 'sandstone/pack'
import { DataPackDependencies, ResourcePackDependencies } from '../pack/dependencies.js'
import type { MCMetaBranches } from './mcmeta.js'
import { MCMetaCache } from './mcmeta.js'
import type { AwaitNode } from './nodes.js'
import type { _RawMCFunctionClass, MCFunctionClass, MCFunctionNode } from './resources/datapack/mcfunction.js'
import { SmithedDependencyClass } from './resources/dependency.js'
import { type ResourceClass, ResourceNode, ResourceNodesMap } from './resources/resource.js'
import { SmithedDependencyCache } from './smithed.js'
import type { GenericCoreVisitor } from './visitors.js'

export class SandstoneCore {
  /** All Resources */
  resourceNodes: ResourceNodesMap

  mcfunctionStack: MCFunctionNode[]

  awaitNodes: Set<AwaitNode>

  currentNode = ''

  _mcMetaCache: MCMetaCache | undefined

  _smithed: SmithedDependencyCache | undefined

  dependencies: Promise<SmithedDependencyClass[] | true>[] = []

  constructor(public pack: SandstonePack) {
    this.resourceNodes = new ResourceNodesMap()
    this.mcfunctionStack = []
    this.awaitNodes = new Set()

    // ESM is funny

    for (const method of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      /* @ts-ignore */
      if (method !== 'constructor' && typeof this[method] === 'function' && typeof this[method].bind === 'function') {
        /* @ts-ignore */
        this[method] = this[method].bind(this)
      }
    }
  }

  reset = () => {
    this.resourceNodes.clear()
    this.mcfunctionStack = []
    this.awaitNodes.clear()
    this.currentNode = ''
    this._mcMetaCache = undefined
    this._smithed = undefined
    this.dependencies = []
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

  insideContext: MCFunctionNode['insideContext'] = (...args) =>
    this.getCurrentMCFunctionOrThrow().insideContext(...args)

  /**
   * Create a new MCFunction with the given name, and switch the currently active MCFunction to it.
   * @param mcfunction The MCFunction to switch to.
   * @return The newly created and active MCFunction.
   */
  enterMCFunction = (mcfunction: _RawMCFunctionClass<any, any> | MCFunctionClass<any, any>): MCFunctionNode => {
    /*
     * We cannot simply call mcfunction.node, because .node is protected to avoid polluting the autocompleted API.
     * However, TypeScript gives us a backdoor using this dynamic call, in a fully type-safe way.
     */
    // eslint-disable-next-line prefer-destructuring, dot-notation
    const node = mcfunction.node
    this.mcfunctionStack.push(node)
    return node
  }

  /**
   * Leave the current MCFunction, and return to the previous one.
   * @return The previously active MCFunction.
   */
  exitMCFunction = () => this.mcfunctionStack.pop()

  getMcMetaCache = () => {
    this._mcMetaCache ??= new MCMetaCache()
    return this._mcMetaCache
  }

  async getExistingResource(relativePath: string): Promise<string>

  async getExistingResource(relativePath: string, encoding: false): Promise<Buffer>

  async getExistingResource(relativePath: string, encoding: fs.EncodingOption): Promise<Buffer | string>

  async getExistingResource(resource: ResourceClass, encoding?: 'utf-8'): Promise<string>

  async getExistingResource(resource: ResourceClass, encoding: false | fs.EncodingOption): Promise<Buffer>

  async getExistingResource(
    pathOrResource: string | ResourceClass,
    encoding: false | fs.EncodingOption = 'utf-8',
  ): Promise<Buffer | string> {
    if (typeof pathOrResource === 'string') {
      if (encoding === false) {
        return fs.readFile(pathOrResource)
      }
      return fs.readFile(pathOrResource, encoding)
    }
    const _path = pathOrResource.path
    if (_path[0] === 'minecraft') {
      const type = pathOrResource.packType.resourceSubFolder as MCMetaBranches

      return this.getMcMetaCache().get(
        type,
        `${type}/${_path.join('/')}${pathOrResource.fileExtension ? `.${pathOrResource.fileExtension}` : ''}`,
        (encoding === 'utf-8') as true,
      )
    }
    // eslint-disable-next-line max-len
    const fullPath = path.join(
      process.env.WORKING_DIR as string,
      `resources/${path.join(pathOrResource.packType.type, ..._path)}${pathOrResource.fileExtension ? `.${pathOrResource.fileExtension}` : ''}`,
    )

    if (pathOrResource.fileEncoding === false) {
      return fs.readFile(fullPath)
    }
    return fs.readFile(fullPath, pathOrResource.fileEncoding)
  }

  async getVanillaResource(relativePath: string): Promise<string>

  async getVanillaResource(relativePath: string, text: true, type: 'client' | 'server'): Promise<string>

  async getVanillaResource(relativePath: string, text: false, type: 'client' | 'server'): Promise<Buffer>

  async getVanillaResource(
    relativePath: string,
    text = true,
    type: 'client' | 'server' = 'server',
  ): Promise<string | Buffer> {
    return this.getMcMetaCache().get(type === 'server' ? 'data' : 'assets', relativePath, text as true)
  }

  getSmithed = () => {
    this._smithed ??= new SmithedDependencyCache(this)
    return this._smithed
  }

  /**
   * Add a dependency for a Smithed Library
   */
  depend(dependency: string, version = 'latest') {
    const adding = this.dependencies.length === 0 ? false : Promise.allSettled(this.dependencies)

    this.dependencies.push(
      (async () => {
        const smithed = this.getSmithed()
        if (!smithed.loaded) {
          await smithed.load()
        }
        if (adding) await adding

        if (!smithed.has(dependency)) {
          const _depend = await smithed.get(dependency, version)

          if (!this.pack.packTypes.has('datapack-dependencies')) {
            this.pack.packTypes.set('datapack-dependencies', new DataPackDependencies())
          }

          const dependencies = [new SmithedDependencyClass(this, dependency, _depend, 'server')]

          if (_depend.resourcepack) {
            if (!this.pack.packTypes.has('resourcepack-dependencies')) {
              this.pack.packTypes.set('resourcepack-dependencies', new ResourcePackDependencies())
            }

            dependencies.push(new SmithedDependencyClass(this, dependency, _depend, 'client'))
          }

          return dependencies
        }
        return true
      })(),
    )
  }

  generateResources = (opts: { visitors: GenericCoreVisitor[] }) => {
    const originalResources = new ResourceNodesMap(this.resourceNodes)

    // First, generate all the resources.
    for (const { resource } of this.resourceNodes) {
      resource.generate()
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

  save = async (
    cliOptions: { fileHandler: (relativePath: string, content: any) => Promise<void>; dry: boolean; verbose: boolean },
    opts: { visitors: GenericCoreVisitor[] },
  ) => {
    if (this._smithed && !this._smithed.loaded) {
      await this._smithed.load()
    }

    await Promise.allSettled(this.dependencies)

    if (this._mcMetaCache && !this._mcMetaCache.loaded) {
      await this._mcMetaCache.load()
      await this._mcMetaCache.save()
    }

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
        console.log(`Path: ${resourcePath}.${fileExtension}\n\n` + `${typeof value === 'string' ? value : '<Buffer>'}`)
      }

      if (!cliOptions.dry) {
        await cliOptions.fileHandler(`${resourcePath}.${fileExtension}`, value)
      }
    }
  }
}
