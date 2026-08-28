/* eslint-disable operator-linebreak */

import path from 'path'
import { EncodingOption } from 'fs'
import fs from 'fs/promises'
import crypto from 'crypto'
import { isBinaryFileSync } from 'isbinaryfile'
import binaryExtensions from 'binary-extensions'
import { getSandstoneContext } from 'sandstone/context'
import type { SandstonePack } from 'sandstone/pack'
import type { MCMetaBranches } from './mcmeta'
import { MCMetaCache } from './mcmeta'
import type { AwaitNode } from './nodes'
import type { WithClass } from '../flow/macro'
import type { _RawMCFunctionClass, MCFunctionClass, MCFunctionNode } from './resources/datapack/mcfunction'
import type { TagClass } from './resources/datapack/tag'
import { SmithedDependencyClass } from './resources/dependency'
import type { SoundsIndexClass } from './resources/resourcepack/sound'
import { BinaryResource, JsonResource, type ResourceClass, ResourceNodesMap, TextResource } from './resources/resource'
import { SmithedDependencyCache } from './smithed'
import type { GenericCoreVisitor } from './visitors'
import { SleepClass } from 'sandstone/flow/async/sleep'

/**
 * After `getExistingResource` resolves a resource's bytes, thread them back
 * onto the resource itself so the caller can mutate and re-save without an
 * extra read step:
 *
 * - `buffer` is written as binary (works for any resource that exposes a
 *   `buffer` field — `TextureClass`, `SoundEvent`, etc.).
 * - `texts` is written as a raw string (works for `PlainTextClass`, whose
 *   data lives in a `texts` field).
 * - Otherwise the value is parsed as JSON and assigned to the resource's
 *   `json` field, if it has one, else to the first public field ending in
 *   `JSON` (e.g. `lootTableJSON`, `advancementJSON`, `damageTypeJSON`,
 *   `soundsJSON`).
 *
 * Returns silently if the resource has no recognised sink — the caller can
 * still use the returned value directly.
 */
function assignToResource(resource: ResourceClass, value: ArrayBuffer | Buffer | string): void {
  if ('buffer' in resource) {
    ;(resource as unknown as { buffer: unknown }).buffer = value
    return
  }
  if (typeof value !== 'string') return

  if ('texts' in resource) {
    ;(resource as unknown as { texts: string }).texts = value
    return
  }

  if ('json' in resource) {
    ;(resource as unknown as { json: unknown }).json = JSON.parse(value)
    return
  }

  const jsonField = Object.keys(resource).find((k) => k.endsWith('JSON') && !k.startsWith('_'))
  if (jsonField) {
    ;(resource as unknown as Record<string, unknown>)[jsonField] = JSON.parse(value)
  }
}

export class SandstoneCore {
  /**
   * Stateless helpers that coalesce any of `Promise<Blob | ArrayBuffer | Buffer> | Blob | ArrayBuffer | Buffer`
   * into the advertised shape. Awaited internally, so callers receive a resolved
   * value of the named type — never a `Promise`.
   *
   * Mirror the `Objective.create` / `Objective.get` access pattern on the pack:
   * `Binary.asArrayBuffer(...)`, `Binary.asLegacyBuffer(...)`, `Binary.asBlob(...)`.
   */
  Binary = {
    /** Resolve any binary blob into an `ArrayBuffer`. */
    async asArrayBuffer(
      input: Promise<Blob | ArrayBuffer | Buffer> | Blob | ArrayBuffer | Buffer,
    ): Promise<ArrayBuffer> {
      const value = await input
      if (value instanceof ArrayBuffer) return value
      if (value instanceof Blob) return await value.arrayBuffer()
      // Buffer — slice the underlying memory so the result respects byteOffset/byteLength.
      return new Uint8Array(value).buffer
    },

    /** Resolve any binary blob into a Node `Buffer`. */
    async asLegacyBuffer(
      input: Promise<Blob | ArrayBuffer | Buffer> | Blob | ArrayBuffer | Buffer,
    ): Promise<Buffer> {
      const value = await input
      if (Buffer.isBuffer(value)) return value
      if (value instanceof ArrayBuffer) return Buffer.from(value)
      // Blob
      return Buffer.from(await value.arrayBuffer())
    },

    /** Resolve any binary blob into a `Blob`. */
    async asBlob(
      input: Promise<Blob | ArrayBuffer | Buffer> | Blob | ArrayBuffer | Buffer,
    ): Promise<Blob> {
      const value = await input
      if (value instanceof Blob) return value
      if (value instanceof ArrayBuffer) return new Blob([value])
      // Buffer — slice the underlying ArrayBuffer so Blob sees the active range, not the wider pool.
      return new Blob([new Uint8Array(value).buffer])
    },
  }

  /** All Resources */
  resourceNodes: ResourceNodesMap

  mcfunctionStack: MCFunctionNode[]

  awaitNodes: Set<AwaitNode>

  /** All `_.with(env, ...)` instances. Lets visitors iterate WithClasses
   * directly instead of scanning every MCFunction body. */
  withNodes: Set<WithClass>

  currentNode = ''

  _mcMetaCache: MCMetaCache | undefined | false = false

  _smithed: SmithedDependencyCache | undefined | false = false

  dependencies: ((() => Promise<true | false>) | true | false)[] = []

  /** Cache of auto-generated function tags, keyed by tag name. Cleared on reset. */
  functionTags: Map<string, TagClass<'function'>> = new Map()

  /** Cache of auto-generated sounds.json definitions, keyed by namespace. Cleared on reset. */
  sounds: Map<string, SoundsIndexClass> = new Map()

  /** Cache of auto-generated polling trigger check functions, keyed by polling interval. Cleared on reset. */
  checkTriggers: Record<number, MCFunctionClass<undefined, undefined>> = {}

  constructor(public pack: SandstonePack) {
    this.resourceNodes = new ResourceNodesMap()
    this.mcfunctionStack = []
    this.awaitNodes = new Set()
    this.withNodes = new Set()
    this.functionTags = new Map()
    this.sounds = new Map()
    this.checkTriggers = {}

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
    this.withNodes.clear()
    this.currentNode = ''
    this._mcMetaCache = undefined
    this._smithed = undefined
    this.dependencies = []
    this.functionTags.clear()
    this.sounds.clear()
    this.checkTriggers = {}
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

  /** See `MCFunctionNode.balanceContext`. */
  balanceContext: MCFunctionNode['balanceContext'] = (...args) =>
    this.getCurrentMCFunctionOrThrow().balanceContext(...args)

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

  async getExistingResource(relativePath: `${string}.json`): Promise<unknown>

  async getExistingResource(
    relativePath: string & {},
    encoding?: 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'utf-16le'
  ): Promise<string>

  async getExistingResource(
    relativePath: string & {},
    encoding: false | NonNullable<Exclude<EncodingOption, 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'utf-16le'>>
  ): Promise<ArrayBuffer | Buffer>

  async getExistingResource<Resource extends JsonResource>(resource: Resource): Promise<JsonResource['json']>

  async getExistingResource(resource: TextResource): Promise<string>

  async getExistingResource(resource: BinaryResource): Promise<ArrayBuffer | Buffer>

  async getExistingResource(resource: ResourceClass): Promise<ArrayBuffer | Buffer | string | unknown>

  async getExistingResource(
    pathOrResource: string | ResourceClass,
    encoding: false | EncodingOption = 'utf-8',
  ): Promise<ArrayBuffer | Buffer | string | unknown> {
    if (typeof pathOrResource === 'string') {
      const fullPath = path.isAbsolute(pathOrResource)
        ? pathOrResource
        : path.join(getSandstoneContext().workingDir, 'resources', pathOrResource)
      if (encoding === false) {
        return fs.readFile(fullPath)
      }
      const text = await fs.readFile(fullPath, encoding)
      return pathOrResource.endsWith('.json') ? JSON.parse(text as string) : text
    }
    const _path = pathOrResource.path
    if (_path[0] === 'minecraft') {
      const type = pathOrResource.packType.resourceSubFolder as MCMetaBranches

      const value = await this.mcMetaCache.get(
        type,
        `${type}/${_path.join('/')}${pathOrResource.fileExtension ? `.${pathOrResource.fileExtension}` : ''}`,
        (encoding === 'utf-8') as true,
      )
      assignToResource(pathOrResource, value)
      return value
    }
    // eslint-disable-next-line max-len
    const pathParts = [pathOrResource.packType.type]
    if (pathOrResource.packType.resourceSubFolder) {
      pathParts.push(pathOrResource.packType.resourceSubFolder)
    }
    pathParts.push(..._path)
    const fullPath = path.join(
      getSandstoneContext().workingDir,
      `resources/${path.join(...pathParts)}${pathOrResource.fileExtension ? `.${pathOrResource.fileExtension}` : ''}`,
    )

    const value = pathOrResource.fileEncoding === false
      ? await fs.readFile(fullPath)
      : await fs.readFile(fullPath, pathOrResource.fileEncoding)
    assignToResource(pathOrResource, value)
    return value
  }

  async getVanillaResource(relativePath: string): Promise<string>

  async getVanillaResource(relativePath: string, text: true, type: 'client' | 'server'): Promise<string>

  async getVanillaResource(relativePath: string, text: false, type: 'client' | 'server'): Promise<ArrayBuffer | Buffer>

  async getVanillaResource(
    relativePath: string,
    text = true,
    type: 'client' | 'server' = 'server',
  ): Promise<string | ArrayBuffer | Buffer> {
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

  generateResources(opts: { visitors: GenericCoreVisitor[] }) {
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

  async save(
    cliOptions: { fileHandler: (relativePath: string, content: any) => Promise<void>; dry: boolean; verbose: boolean },
    opts: { visitors: GenericCoreVisitor[] },
  ) {
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

    const binaryExt = new Set(binaryExtensions)
    const encoder = new TextDecoder()

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
        console.log(`Path: ${resourcePath}.${fileExtension}\n\n` + `${(() => {
          if (typeof value === 'string') {
            return value
          }
          if (!binaryExt.has(fileExtension) && !isBinaryFileSync(value)) {
            return encoder.decode(value)
          }

          return `<Buffer: ${crypto.createHash('sha256').update(value).digest('hex')}>`
        })()}`)
      }

      if (!cliOptions.dry) {
        await cliOptions.fileHandler(`${resourcePath}.${fileExtension}`, value)
      }
    }
  }
}
