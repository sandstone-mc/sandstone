/* eslint-disable operator-linebreak */

import path from 'path'
import { EncodingOption } from 'fs'
import fs from 'fs/promises'
import crypto from 'crypto'
import { isBinaryFileSync } from 'isbinaryfile'
import binaryExtensions from 'binary-extensions'
import { getSandstoneContext } from 'sandstone/context'
import type { SandstonePack } from 'sandstone/pack'
import { MCMetaCache } from './mcmeta'
import type { AwaitNode } from './nodes'
import type { WithClass } from '../flow/macro'
import type { _RawMCFunctionClass, MCFunctionClass, MCFunctionNode } from './resources/datapack/mcfunction'
import type { TagClass, TagValuesJSON } from './resources/datapack/tag'
import type { SoundsIndexClass } from './resources/resourcepack/sound'
import type { TextureMeta } from './resources/resourcepack/texture'
import { BinaryResource, JsonResource, type ResourceClass, ResourceNodesMap, TextResource } from './resources/resource'
import type { GenericCoreVisitor } from './visitors'
import { REGISTRIES, RESOURCE_PATHS, TextureType } from 'sandstone/arguments'
import { Set, SetType } from '../utils'
import { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'
import type { MathContainerNode } from '../flow/math/ast/MathContainerNode'

/**
 * After `getExistingResource` resolves a resource's bytes, thread them back
 * onto the resource so the caller can mutate and re-save without an extra
 * read step. Value shape matches the resource's sink:
 *
 * - binary → `buffer` field (`TextureClass`, `SoundEvent`, `StructureClass`, …)
 * - raw string → `texts` field (`PlainTextClass`)
 * - parsed JSON → `json` field, or the first public `*JSON` field if `json`
 *   isn't declared (`lootTableJSON`, `advancementJSON`, `damageTypeJSON`, …)
 *
 * `value` may arrive pre-parsed from `getVanillaResource`; in that case the
 * JSON parse is skipped. Returns silently if the value doesn't fit the sink
 * — the caller can still use the returned value directly.
 */
function assignToResource(resource: ResourceClass, value: ArrayBuffer | Buffer | string | object): void {
  const target = resource as unknown as Record<string, unknown>

  if ('buffer' in resource) {
    if (value instanceof ArrayBuffer || Buffer.isBuffer(value)) target.buffer = value
    return
  }

  if (typeof value === 'string' && 'texts' in resource) {
    target.texts = value
    return
  }

  const parsed = typeof value === 'string' ? JSON.parse(value) : value

  if ('json' in resource) {
    target.json = parsed
    return
  }

  const jsonField = Object.keys(resource).find((k) => k.endsWith('JSON') && !k.startsWith('_'))
  if (jsonField) target[jsonField] = parsed
}

export const BinaryResourceTypesSet = new Set(['font/otf', 'font/ttf', 'font/unihex', 'sound', 'structure', 'texture'] as const)

export type BinaryResourceTypes = SetType<typeof BinaryResourceTypesSet>

export type JsonResourceTypes = Exclude<({
  [K in keyof typeof RESOURCE_PATHS]: typeof RESOURCE_PATHS[K]['ext'] extends '.json' ? K : never
}[keyof typeof RESOURCE_PATHS]), 'tag'>

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

  /** Math DSL container stack — top is the active `MathContainerNode` (a `MathFunctionNode` for top-level). */
  mathStack: MathContainerNode[] = []

  awaitNodes: Set<AwaitNode>

  /** All `_.with(env, ...)` instances. Lets visitors iterate WithClasses
   * directly instead of scanning every MCFunction body. */
  withNodes: Set<WithClass>

  currentNode = ''

  /**
   * @internal
   */
  commandSerializationDepth = 0

  /**
   * @internal
   */
  macroAlreadyUsed = false

  _mcMetaCache: MCMetaCache | undefined | false = false

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
    this.mathStack = []
    this.awaitNodes.clear()
    this.withNodes.clear()
    this.currentNode = ''
    this.commandSerializationDepth = 0
    this.macroAlreadyUsed = false
    this._mcMetaCache = undefined
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
    if (_path[0] === 'minecraft' && pathOrResource._resourceType in RESOURCE_PATHS) {
      const value = await this.getVanillaResource(
        pathOrResource._resourceType as any,
        pathOrResource.name.slice(10),
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

  getVanillaResource<Resource extends JsonResourceTypes>(resourceType: Resource, path: string): Promise<JsonSymbolResource[Resource]>

  getVanillaResource<Registry extends REGISTRIES>(resourceType: `tag/${Registry}`, path: string): Promise<TagValuesJSON<Registry>>

  getVanillaResource<Type extends TextureType>(resourceType: 'texture_meta', path: `${Type}/${string}`): Promise<TextureMeta<Type>>

  getVanillaResource(resourceType: 'sounds'): Promise<JsonSymbolResource['sounds']>

  getVanillaResource(resourceType: Exclude<keyof typeof RESOURCE_PATHS, (BinaryResourceTypes | JsonResourceTypes | 'tag' | 'texture_meta' | 'sounds')>, path: string): Promise<string>

  getVanillaResource(resourceType: BinaryResourceTypes, path: string): Promise<ArrayBuffer | Buffer>

  getVanillaResource(resourceType: string, path?: string): Promise<unknown | string | ArrayBuffer | Buffer> {
    if (path === undefined) {
      if (resourceType === 'sounds') {
        const raw = this.mcMetaCache.get(
          'assets',
          ['assets', 'minecraft', `sounds.json`].join('/'),
          true,
        )
        return new Promise(async (res) => {
          res(JSON.parse(await raw))
        })
      }
      throw new Error('[SandstoneCore#getVanillaResource] How did you get here?')
    }
    if (resourceType in RESOURCE_PATHS) {
      const data = RESOURCE_PATHS[resourceType as keyof typeof RESOURCE_PATHS]
      const raw = this.mcMetaCache.get(
        data.pack,
        [data.pack, 'minecraft', ...data.path, `${path}${data.ext}`].join('/'),
        !BinaryResourceTypesSet.has(resourceType) as true,
      )
      if (data.ext === '.json' || data.ext === '.png.mcmeta') {
        return new Promise(async (res) => {
          res(JSON.parse(await raw) as never)
        })
      }
      return raw as never
    }
    const registry = resourceType.slice(4)
    const raw = this.mcMetaCache.get(
      'data',
      ['data', 'minecraft', 'tags', registry, `${path}.json`].join('/'),
      true,
    )
    return new Promise(async (res) => {
      res(JSON.parse(await raw))
    })
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
