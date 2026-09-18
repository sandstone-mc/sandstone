import { RESOURCE_PATHS, TextureType } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { BinaryResource, JsonResource, ResourceClass, jsonStringify } from '../resource'
import { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

type TextureMetaAll = JsonSymbolResource['texture_meta']

// TODO: Find which texture types actually support animations.
export type TextureMeta<Type extends TextureType> = (
  Type extends 'entity/villager' ? Omit<Omit<TextureMetaAll, 'texture'>, 'gui'> :
  Type extends 'colormap' ? Omit<Omit<TextureMetaAll, 'villager'>, 'gui'> :
  Type extends 'gui' ? Omit<Omit<TextureMetaAll, 'villager'>, 'texture'> :
  Omit<TextureMetaAll, 'villager' | 'texture' | 'gui'>
)

/**
 * A node representing a Minecraft texture.
 */
export class TextureNode<Type extends TextureType> extends ContainerNode implements ResourceNode<TextureClass<Type>> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: TextureClass<Type>,
  ) {
    super(sandstoneCore)
  }

  getValue = () => this.resource.buffer
}

export type TextureArguments<Type extends TextureType> = {
  /**
   * The texture's buffer.
   */
  texture?: Promise<ArrayBuffer | Buffer> | ArrayBuffer | Buffer

  sprite?: boolean | string

  meta?: TextureMeta<Type>
} & ResourceClassArguments<'default'>

export class TextureClass<Type extends TextureType> extends ResourceClass<TextureNode<Type>> implements BinaryResource {
  static readonly resourceType = 'texture'

  type: Type

  isSprite: boolean

  spriteTarget?: string

  protected metaResource?: TextureMetaClass<Type>
  protected metaProxy?: TextureMeta<Type>
  protected metaName?: string

  get meta() {
    if (this.metaProxy === undefined) {
      this.metaProxy = this.createMetaProxy()
    }
    return this.metaProxy
  }

  set meta(value: TextureMeta<Type> | undefined) {
    if (value === undefined) {
      if (this.metaResource === undefined) return
      this.core.resourceNodes.delete(this.metaResource.node)
      this.metaResource = undefined
      return
    }
    this.ensureMetaResource()
    this.metaResource!.json = value
  }

  buffer: NonNullable<TextureArguments<Type>['texture']>

  constructor(core: SandstoneCore, type: Type, name: string, args: TextureArguments<Type>) {
    super(
      core,
      { packType: core.pack.resourcePack(), extension: 'png', encoding: false },
      TextureNode,
      TextureClass.resourceType,
      core.pack.resourceToPath(name, [...RESOURCE_PATHS[TextureClass.resourceType].path, type]),
      args,
    )

    this.type = type
    this.metaName = name

    this.buffer = args.texture ?? {} as unknown as ArrayBuffer

    this.isSprite = args.sprite === undefined ? false : args.sprite !== false

    if (typeof args.sprite === 'string') {
      this.spriteTarget = args.sprite
    }

    if (args.meta !== undefined) {
      this.ensureMetaResource()
      this.metaResource!.json = args.meta
    }

    this.handleConflicts()
  }

  protected createMetaProxy() {
    return new Proxy({} as TextureMeta<Type>, {
      get: (_target, prop) => {
        if (this.metaResource === undefined) {
          return undefined
        }
        return Reflect.get(this.metaResource.json as object, prop)
      },
      set: (_target, prop, value) => {
        this.ensureMetaResource()
        return Reflect.set(this.metaResource!.json as object, prop, value)
      },
    })
  }

  protected ensureMetaResource() {
    if (this.metaResource) return
    this.metaResource = new TextureMetaClass<Type>(
      this.core,
      this.type,
      this.metaName!,
      {
        creator: 'sandstone',
        addToSandstoneCore: true,
      },
    )
  }

  toString() {
    return `${this.path[0]}:${this.path.slice(2).join('/')}`
  }

  // TODO
  videoToAnimation(_path: string) {
    console.log('[TextureClass#videoToAnimation] Unimplemented')
  }
}

/**
 * A node representing a texture's `.png.mcmeta` file.
 * @internal — created lazily by `TextureClass.meta`; no public factory in `SandstonePack`.
 */
export class TextureMetaNode<Type extends TextureType> extends ContainerNode implements ResourceNode<TextureMetaClass<Type>> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: TextureMetaClass<Type>,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, 'texture_meta')
}

export class TextureMetaClass<Type extends TextureType> extends ResourceClass<TextureMetaNode<Type>> implements JsonResource {
  static readonly resourceType = 'texture_meta'

  json: TextureMeta<Type> = {} as TextureMeta<Type>

  constructor(
    sandstoneCore: SandstoneCore,
    type: TextureType,
    name: string,
    args: ResourceClassArguments<'default'>,
  ) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'png.mcmeta', encoding: 'utf8' },
      TextureMetaNode,
      TextureMetaClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, [...RESOURCE_PATHS[TextureMetaClass.resourceType].path, type]),
      args,
    )

    this.handleConflicts()
  }
}
