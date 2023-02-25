import { ContainerNode } from '../../nodes'
import { ResourceClass } from '../resource'

import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'

/**
 * A node representing a Minecraft sound.
 */
export class SoundNode extends ContainerNode implements ResourceNode<SoundClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: SoundClass) {
    super(sandstoneCore)
  }

  getValue = () => this.resource.buffer
}

export type SoundArguments = {
  /**
   * The sound's buffer.
   */
  sound?: Promise<Buffer> | Buffer

} & ResourceClassArguments<'default'>

export class SoundClass extends ResourceClass<SoundNode> {
  type?: SOUND_TYPES

  buffer: SoundArguments['sound']

  constructor(core: SandstoneCore, name: string, args: SoundArguments) {
    super(core, { packType: core.pack.resourcePack, extension: 'ogg', encoding: false }, SoundNode, core.pack.resourceToPath(name, ['sounds']), args)

    this.buffer = args.sound
  }

  silent() {}
}
