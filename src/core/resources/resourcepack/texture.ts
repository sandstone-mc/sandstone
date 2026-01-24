import type { SymbolResource, TEXTURE_TYPES } from 'sandstone/arguments'
import type { LiteralUnion } from 'sandstone/utils'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'

type TextureType = LiteralUnion<TEXTURE_TYPES>

type TextureMetaAll = SymbolResource['texture_meta']

// TODO: Find which texture types actually support animations.
type TextureMeta<Type extends TextureType> = (
  Type extends 'entity/villager' ? Omit<Omit<TextureMetaAll, 'texture'>, 'gui'> :
  Type extends 'colormap' ? Omit<Omit<TextureMetaAll, 'villager'>, 'gui'> :
  Type extends 'gui' ? Omit<Omit<TextureMetaAll, 'villager'>, 'texture'> :
  Omit<Omit<Omit<TextureMetaAll, 'villager'>, 'texture'>, 'gui'>
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
  texture?: Promise<Buffer> | Buffer

  sprite?: boolean | string

  meta?: TextureMeta<Type>
} & ResourceClassArguments<'default'>

export class TextureClass<Type extends TextureType = 'block'> extends ResourceClass<TextureNode<Type>> {
  type: Type

  isSprite: boolean

  spriteTarget?: string

  meta?: TextureMeta<Type>

  buffer: TextureArguments<Type>['texture']

  constructor(core: SandstoneCore, type: Type, name: string, args: TextureArguments<Type>) {
    super(
      core,
      { packType: core.pack.resourcePack(), extension: 'png', encoding: false },
      TextureNode,
      core.pack.resourceToPath(name, ['textures', type]),
      args,
    )

    this.type = type

    this.buffer = args.texture

    this.isSprite = args.sprite === undefined ? false : args.sprite !== false

    this.meta = args.meta

    if (typeof args.sprite === 'string') {
      this.spriteTarget = args.sprite
    }

    this.handleConflicts()
  }

  toString() {
    return `${this.path[0]}:${this.path.slice(2)}`
  }

  // TODO
  videoToAnimation(_path: string) {
    console.log('[TextureClass#videoToAnimation] Unimplemented')
  }
}
