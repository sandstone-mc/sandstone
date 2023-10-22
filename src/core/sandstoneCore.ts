/* eslint-disable operator-linebreak */
import fs from 'fs-extra'
import path from 'path'

import { DataPackDependencies, ResourcePackDependencies } from '../pack/dependencies.js'
import { MCMetaCache } from './mcmeta.js'
import { SmithedDependencyClass } from './resources/dependency.js'
import { SmithedDependencyCache } from './smithed.js'

import type { SandstonePack } from 'sandstone/pack'
import type { MCMetaBranches } from './mcmeta.js'
import type { AwaitNode } from './nodes.js'
import type { _RawMCFunctionClass, MCFunctionClass, MCFunctionNode } from './resources/datapack/mcfunction.js'
import type { ResourceClass, ResourceNode } from './resources/resource.js'
import type { GenericCoreVisitor } from './visitors.js'

export class SandstoneCore {
  /** All Resources */
  resourceNodes: Set<ResourceNode>

  mcfunctionStack: MCFunctionNode[]

  awaitNodes: Set<AwaitNode>

  currentNode: string = ''

  mcmetaCache = new MCMetaCache()

  smithed = new SmithedDependencyCache(this)

  dependencies: Promise<SmithedDependencyClass[] | true>[] = []

  constructor(public pack: SandstonePack) {
    this.resourceNodes = new Set()
    this.mcfunctionStack = []
    this.awaitNodes = new Set()

    this.depend = this.depend.bind(this)
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
  enterMCFunction = (mcfunction: _RawMCFunctionClass<any, any> | MCFunctionClass<any, any>): MCFunctionNode => {
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

  async getExistingResource(resource: ResourceClass, encoding?: 'utf-8'): Promise<string>

  async getExistingResource(resource: ResourceClass, encoding: false | fs.EncodingOption): Promise<Buffer>

  async getExistingResource(pathOrResource: string | ResourceClass, encoding: false | fs.EncodingOption = 'utf-8'): Promise<Buffer | string> {
    if (typeof pathOrResource === 'string') {
      if (encoding === false) {
        return fs.readFile(pathOrResource)
      }
      return fs.readFile(pathOrResource, encoding)
    }
    const _path = pathOrResource.path
    if (_path[0] === 'minecraft') {
      const type = pathOrResource.packType.resourceSubFolder as MCMetaBranches

      return this.mcmetaCache.get(type, `${type}/${_path.join('/')}${pathOrResource.fileExtension ? `.${pathOrResource.fileExtension}` : ''}`, (encoding === 'utf-8') as true)
    }
    // eslint-disable-next-line max-len
    const fullPath = path.join(process.env.WORKING_DIR as string, `resources/${path.join(pathOrResource.packType.type, ..._path)}${pathOrResource.fileExtension ? `.${pathOrResource.fileExtension}` : ''}`)

    if (pathOrResource.fileEncoding === false) {
      return fs.readFile(fullPath)
    }
    return fs.readFile(fullPath, pathOrResource.fileEncoding)
  }

  async getVanillaResource(relativePath: string): Promise<string>

  async getVanillaResource(relativePath: string, text: true, type: 'client' | 'server'): Promise<string>

  async getVanillaResource(relativePath: string, text: false, type: 'client' | 'server'): Promise<Buffer>

  async getVanillaResource(relativePath: string, text = true, type: 'client' | 'server' = 'server'): Promise<string | Buffer> {
    return this.mcmetaCache.get(type === 'server' ? 'data' : 'assets', relativePath, text as true)
  }

  /**
   * Add a dependency for a Smithed Library
   */
  depend(dependency: string, version = 'latest') {
    const adding = this.dependencies.length === 0 ? false : Promise.allSettled(this.dependencies)

    this.dependencies.push((async () => {
      if (!this.smithed.loaded) {
        await this.smithed.load()
      }
      if (adding) await adding

      if (!this.smithed.has(dependency)) {
        const _depend = await this.smithed.get(dependency, version)

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
    })())
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
    if (!this.smithed.loaded) {
      await this.smithed.load()
    }

    await Promise.allSettled(this.dependencies)

    await this.mcmetaCache.save()

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

      if (!cliOptions.dry) {
        await cliOptions.fileHandler(`${resourcePath}.${fileExtension}`, value)
      }
    }
  }
}
