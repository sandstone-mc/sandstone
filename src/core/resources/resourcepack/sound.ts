import path from 'path'

import { ContainerNode } from '../../nodes'
import { ResourceClass } from '../resource'

import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import type { SOUND_TYPES, SoundsDefinitions } from '#arguments'

/**
 * A node representing a Minecraft sound.
 */
export class SoundEventNode<Type extends SOUND_TYPES> extends ContainerNode implements ResourceNode<SoundEventClass<Type>> {
  constructor(sandstoneCore: SandstoneCore, public resource: SoundEventClass<Type>) {
    super(sandstoneCore)
  }

  getValue = () => this.resource.buffer
}

export type SoundEventArguments = {
  /**
   * The sound's buffer. Path string in `./resources` will be used. Defaults to `/resources/resourcepack/assets/(namespace)/sounds/(type)/(name)`.
   */
  sound?: string | Promise<Buffer> | Buffer

  id?: string

} & ResourceClassArguments<'default'>

export class SoundEventClass<Type extends SOUND_TYPES> extends ResourceClass<SoundEventNode<Type>> {
  buffer?: Promise<Buffer> | Buffer

  constructor(core: SandstoneCore, public type: Type, name: string, args: SoundEventArguments) {
    super(core, { packType: core.pack.resourcePack, extension: 'ogg', encoding: false }, SoundEventNode<Type>, core.pack.resourceToPath(name, ['sounds', type]), args)

    if (args.addToSandstoneCore && args.sound !== undefined) {
      if (typeof args.sound === 'string') {
        this.buffer = core.getExistingResource(path.join('resourcepack', 'assets', ...this.path), false)
      } else {
        this.buffer = args.sound
      }
    }
  }

  silent() {}
}

/**
 * A node representing a Minecraft sound.
 */
export class SoundsNode extends ContainerNode implements ResourceNode<SoundsClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: SoundsClass) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.soundsJSON)
}

export type SoundsArguments = {
  /**
   * The sounds definition map.
   */
  definitions?: SoundsDefinitions

} & ResourceClassArguments<'default'>

export class SoundsClass extends ResourceClass<SoundsNode> {
  soundsJSON: SoundsDefinitions | Promise<SoundsDefinitions>

  constructor(core: SandstoneCore, name: string, args: SoundsArguments) {
    super(core, { packType: core.pack.resourcePack }, SoundsNode, core.pack.resourceToPath(name, ['sounds']), args)

    if (args.definitions) {
      this.soundsJSON = args.definitions
    } else if (this.path[0] === 'minecraft') {
      this.soundsJSON = (async () => JSON.parse(await (core.getVanillaResource(this) as Promise<string>)))()
    } else {
      this.soundsJSON = (async () => JSON.parse(await (core.getExistingResource(this) as Promise<string>)))()
    }
  }
}
