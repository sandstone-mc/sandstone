import { ContainerNode } from '../../nodes'
import { ResourceClass } from '../resource'

import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'

/**
 * A node representing a Minecraft sound.
 */
export class TextureNode extends ContainerNode implements ResourceNode<TextureClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: TextureClass) {
    super(sandstoneCore)
  }

  getValue = () => this.resource.buffer
}

export type TextureArguments = {
  /**
   * The texture's buffer.
   */
  texture?: Promise<Buffer> | Buffer

  sprite?: boolean | string

  animate?: boolean | string | AnimationJSON

} & ResourceClassArguments<'default'>

export class TextureClass extends ResourceClass<TextureNode> {
  type: TEXTURE_TYPES

  isSprite: boolean

  spriteTarget?: string

  animated: boolean

  animation?: AnimationJSON

  buffer: TextureArguments['texture']

  constructor(core: SandstoneCore, type: TEXTURE_TYPES, name: string, args: TextureArguments) {
    super(core, { packType: core.pack.resourcePack, extension: 'png', encoding: false }, TextureNode, core.pack.resourceToPath(name, ['textures', type]), args)

    this.type = type

    this.buffer = args.texture

    this.isSprite = args.sprite === undefined ? false : args.sprite !== false

    this.animated = args.animate === undefined ? false : args.animate !== false

    if (typeof args.sprite === 'string') {
      this.spriteTarget = args.sprite
    }

    if (this.animated) {
      if (typeof this.animated === 'string') {
        this.videoToAnimation(this.animated)
      } else if (typeof this.animated === 'boolean') {
        this.animation = {}
      } else {
        this.animation = args.animate
      }
    }
  }

  videoToAnimation(path: string) {}
}
