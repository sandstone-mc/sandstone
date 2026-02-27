/* eslint-disable operator-linebreak */

import path from 'node:path'
import fs from 'fs-extra'
import { getSandstoneContext } from 'sandstone/context'
import type { SandstonePack } from 'sandstone/pack'
import { DataPackDependencies, ResourcePackDependencies } from '../pack/dependencies'
import type { MCMetaBranches } from './mcmeta'
import { MCMetaCache } from './mcmeta'
import type { AwaitNode } from './nodes'
import type { _RawMCFunctionClass, MCFunctionClass, MCFunctionNode } from './resources/datapack/mcfunction'
import { SmithedDependencyClass } from './resources/dependency'
import { type ResourceClass, ResourceNodesMap } from './resources/resource'
import { SmithedDependencyCache } from './smithed'
import type { GenericCoreVisitor } from './visitors'

export class SandstoneCore {
  /** All Resources */
  resourceNodes: ResourceNodesMap

  mcfunctionStack: MCFunctionNode[]

  awaitNodes: Set<AwaitNode>

  currentNode = ''

  _mcMetaCache: MCMetaCache | undefined | false = false

  _smithed: SmithedDependencyCache | undefined | false = false

  dependencies: ((() => Promise<true | false>) | true | false)[] = []

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

  get mcMetaCache() {
    if (this._mcMetaCache === false) {
      this._mcMetaCache = undefined

      return undefined as unknown as MCMetaCache
    }
    this._mcMetaCache ??= new MCMetaCache()
    return this._mcMetaCache as MCMetaCache
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

      return this.mcMetaCache.get(
        type,
        `${type}/${_path.join('/')}${pathOrResource.fileExtension ? `.${pathOrResource.fileExtension}` : ''}`,
        (encoding === 'utf-8') as true,
      )
    }
    // eslint-disable-next-line max-len
    const fullPath = path.join(
      getSandstoneContext().workingDir,
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
    return this.mcMetaCache.get(type === 'server' ? 'data' : 'assets', relativePath, text as true)
  }

  get smithed() {
    this._smithed ??= new SmithedDependencyCache(this)
    return this._smithed as SmithedDependencyCache
  }

  /**
   * Add a dependency for a Smithed Library
   * 
   * @returns Index of the async dependency request in SandstoneCore#dependencies
   */
  depend(dependency: string, version = 'latest') {
    const i = this.dependencies.length

    this.dependencies.push(
      async () => {
        if (!this.smithed.has(dependency)) {
          const depend = await this.smithed.get(dependency, version)

          // If dependency couldn't be fetched (not on Smithed yet), skip it
          if (depend === undefined) {
            this.dependencies[i] = false
            this.pack.dependencies.set(dependency, false)
            return false
          }
        }
        this.pack.dependencies.set(dependency, true)
        this.dependencies[i] = true
        return true
      },
    )
    return i
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
    await this.smithed.load()

    let dependenciesFailed = 0
    for (const depend of this.dependencies) {
      const success = typeof depend === 'boolean' ? depend : await depend()

      if (!success) {
        dependenciesFailed++
      }
    }
    if (dependenciesFailed !== 0) {
      console.log(`[SandstoneCore#save] Failed to load ${dependenciesFailed} dependencies, continuing with compilation.`)
    }

    if (this.dependencies.length !== 0) {
      await this.smithed.save()
    }

    if (this._mcMetaCache) {
      if (!this.mcMetaCache.loaded) {
        await this.mcMetaCache.load()
      }
      await this.mcMetaCache.save()
    }

    const resources = this.generateResources(opts)

    for await (const node of resources) {
      const { packType, fileExtension } = node.resource
      const _path = [packType.type, ...node.resource.path]

      if (packType.resourceSubFolder) {
        _path.splice(1, 0, packType.resourceSubFolder)
      }
      const resourcePath = path.join(..._path)

      let value: NonNullable<any>

      try {
        value = await node.getValue()
      } catch (e) {
        console.log('\n\n\n\n')
        console.log(node)
        throw e
      }

      if (cliOptions.verbose) {
        console.log(`Path: ${resourcePath}.${fileExtension}\n\n` + `${typeof value === 'string' ? value : '<Buffer>'}`)
      }

      if (!cliOptions.dry) {
        await cliOptions.fileHandler(`${resourcePath}.${fileExtension}`, value)
      }
    }
  }
}
