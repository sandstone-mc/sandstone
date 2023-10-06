import path from 'path'

import { ContainerNode } from '../../nodes.js'
import { ResourceClass } from '../resource.js'

import type { SandstoneCore } from '../../sandstoneCore.js'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource.js'
import type { SOUND_TYPES, SoundsDefinitions } from 'sandstone/arguments/index.js'

const sounds: Map<string, SoundsClass> = new Map()

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

  /**
   * Whether to automatically add this to a sounds.json file. Defaults to false.
   */
  addToSounds?: boolean

} & ResourceClassArguments<'default'>

export class SoundEventClass<Type extends SOUND_TYPES> extends ResourceClass<SoundEventNode<Type>> {
  buffer?: Promise<Buffer> | Buffer

  constructor(core: SandstoneCore, public type: Type, name: string, args: SoundEventArguments) {
    super(core, { packType: core.pack.resourcePack(), extension: 'ogg', encoding: false }, SoundEventNode<Type>, core.pack.resourceToPath(name, ['sounds', type]), args)

    if (args.addToSandstoneCore && args.sound !== undefined) {
      if (typeof args.sound === 'string') {
        this.buffer = core.getExistingResource(path.join('resourcepack', 'assets', ...this.path), false)
      } else {
        this.buffer = args.sound
      }

      if (args.addToSounds) {
        let def = sounds.get(this.path[0])

        if (!def) {
          def = sounds.set(this.path[0], new SoundsClass(this.core, this.path[0], {
            addToSandstoneCore: true,
            creator: 'sandstone',
          })).get(this.path[0])
        }

        (def as SoundsClass).push(this)
      }
    }

    this.handleConflicts()
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

export class SoundsClass extends ResourceClass<SoundsNode> implements ListResource {
  soundsJSON: SoundsDefinitions | Promise<SoundsDefinitions>

  constructor(core: SandstoneCore, namespace: string, args: SoundsArguments) {
    super(core, { packType: core.pack.resourcePack() }, SoundsNode, core.pack.resourceToPath(`${namespace}:sounds`, []), args)

    if (args.definitions) {
      this.soundsJSON = args.definitions
    } else {
      this.soundsJSON = (async () => JSON.parse(await (core.getExistingResource(this) as Promise<string>)))()
    }
  }

  async push(...soundEvents: SoundsClass[] | SoundEventClass<SOUND_TYPES>[]) {
    if (soundEvents[0] instanceof SoundsClass) {
      for await (const _sounds of soundEvents) {
        const def = _sounds as SoundsClass
        const s = await this.soundsJSON

        // TODO: Implement sound event options
        this.soundsJSON = { ...s, ...def }
      }
    } else {
      for await (const _sound of soundEvents) {
        const sound = _sound as SoundEventClass<SOUND_TYPES>
        const s = await this.soundsJSON

        // TODO: Implement sound event options
        s[`${sound.type}.${sound.name}`] = {
          sounds: [`${sound.type}.${sound.name}`],
        }
      }
    }
  }

  async unshift(...soundEvents: SoundsClass[] | SoundEventClass<SOUND_TYPES>[]) {
    if (soundEvents[0] instanceof SoundsClass) {
      for await (const _sounds of soundEvents) {
        const def = _sounds as SoundsClass
        const s = await this.soundsJSON

        // TODO: Implement sound event options
        this.soundsJSON = { ...def, ...s }
      }
    } else {
      for await (const _sound of soundEvents) {
        const sound = _sound as SoundEventClass<SOUND_TYPES>
        const s = await this.soundsJSON

        // TODO: Implement sound event options
        s[`${sound.type}.${sound.name}`] = {
          sounds: [`${sound.type}.${sound.name}`],
        }
      }
    }
  }
}
