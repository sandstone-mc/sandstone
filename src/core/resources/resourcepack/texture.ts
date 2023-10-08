import { ContainerNode } from '../../nodes.js'
import { ResourceClass } from '../resource.js'

import type { SandstoneCore } from '../../sandstoneCore.js'
import type { ResourceClassArguments, ResourceNode } from '../resource.js'
import type { TEXTURE_TYPES, TextureMeta } from 'sandstone/arguments'
import type { LiteralUnion } from 'sandstone/utils'

type TextureType = LiteralUnion<TEXTURE_TYPES>

/**
 * A node representing a Minecraft sound.
 */
export class TextureNode<Type extends TextureType> extends ContainerNode implements ResourceNode<TextureClass<Type>> {
  constructor(sandstoneCore: SandstoneCore, public resource: TextureClass<Type>) {
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

export class TextureClass<Type extends TextureType> extends ResourceClass<TextureNode<Type>> {
  type: Type

  isSprite: boolean

  spriteTarget?: string

  meta?: TextureMeta<Type>

  buffer: TextureArguments<Type>['texture']

  constructor(core: SandstoneCore, type: Type, name: string, args: TextureArguments<Type>) {
    super(core, { packType: core.pack.resourcePack(), extension: 'png', encoding: false }, TextureNode, core.pack.resourceToPath(name, ['textures', type]), args)

    this.type = type

    this.buffer = args.texture

    this.isSprite = args.sprite === undefined ? false : args.sprite !== false

    this.meta = args.meta

    if (typeof args.sprite === 'string') {
      this.spriteTarget = args.sprite
    }

    this.handleConflicts()
  }

  videoToAnimation(path: string) {
    console.log('Unimplemented')
  }
}
