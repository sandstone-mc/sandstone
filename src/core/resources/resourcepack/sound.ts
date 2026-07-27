import path from 'node:path'
import { RESOURCE_PATHS, type MCDocToJSON, type SymbolResource, type SOUND_TYPES } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

/**
 * A node representing a Minecraft sound.
 */
export class SoundEventNode<Type extends SOUND_TYPES>
  extends ContainerNode
  implements ResourceNode<SoundEventClass<Type>> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: SoundEventClass<Type>,
  ) {
    super(sandstoneCore)
  }

  getValue = () => this.resource.buffer
}

export type SoundEventArguments = {
  /**
   * The sound's buffer. Path string in `./resources` will be used. Defaults to `/resources/resourcepack/assets/(namespace)/sounds/(type)/(name)`.
   */
  sound?: string | ArrayBuffer | Buffer | Promise<ArrayBuffer | Buffer>

  /**
   * Whether to automatically add this to a sounds.json file. Defaults to false.
   */
  addToSounds?: boolean
} & ResourceClassArguments<'default'>

export class SoundEventClass<Type extends SOUND_TYPES = SOUND_TYPES> extends ResourceClass<SoundEventNode<Type>> {
  static readonly resourceType = 'sound'

  buffer?: Promise<ArrayBuffer | Buffer> | ArrayBuffer | Buffer

  constructor(
    core: SandstoneCore,
    public type: Type,
    name: string,
    args: SoundEventArguments,
  ) {
    super(
      core,
      { packType: core.pack.resourcePack(), extension: 'ogg', encoding: false },
      SoundEventNode<Type>,
      SoundEventClass.resourceType,
      core.pack.resourceToPath(name, [...RESOURCE_PATHS[SoundEventClass.resourceType].path, type]),
      args,
    )

    if (args.addToSandstoneCore && args.sound !== undefined) {
      if (typeof args.sound === 'string') {
        this.buffer = core.getExistingResource(path.join('resourcepack', 'assets', ...this.path), false)
      } else {
        this.buffer = args.sound
      }

      if (args.addToSounds) {
        let def = this.core.sounds.get(this.path[0])

        if (!def) {
          def = this.core.sounds
            .set(
              this.path[0],
              new SoundsIndexClass(this.core, this.path[0], {
                addToSandstoneCore: true,
                creator: 'sandstone',
              }),
            )
            .get(this.path[0])
        }

        def!.push(this)
      }
    }

    this.handleConflicts()
  }

  // TODO: Add sound event methods; play, stop, etc.

  // silent() {}
}

/**
 * A node representing a Minecraft sounds index.
 */
export class SoundsIndexNode extends ContainerNode implements ResourceNode<SoundsIndexClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: SoundsIndexClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.soundsJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

type SoundsJSON = NonNullable<MCDocToJSON<SymbolResource['sounds']>>

export type SoundsIndexArguments = {
  /**
   * The sounds definition map.
   */
  definitions?: SoundsJSON
} & ResourceClassArguments<'default'>

export class SoundsIndexClass extends ResourceClass<SoundsIndexNode> implements ListResource {
  static readonly resourceType = 'sounds'

  soundsJSON: SoundsJSON | Promise<SoundsJSON>

  constructor(core: SandstoneCore, namespace: string, args: SoundsIndexArguments) {
    super(
      core,
      { packType: core.pack.resourcePack() },
      SoundsIndexNode,
      SoundsIndexClass.resourceType,
      core.pack.resourceToPath(`${namespace}:sounds`, RESOURCE_PATHS[SoundsIndexClass.resourceType].path),
      args,
    )

    if (args.definitions !== undefined) {
      this.soundsJSON = args.definitions
    } else {
      this.soundsJSON = (async () => JSON.parse(await (core.getExistingResource(this) as Promise<string>)))()
    }
  }

  async push(...soundEvents: SoundsIndexClass[] | SoundEventClass<SOUND_TYPES>[]) {
    if (soundEvents[0] instanceof SoundsIndexClass) {
      for await (const _sounds of soundEvents) {
        const def = await (_sounds as SoundsIndexClass).soundsJSON
        const s = await this.soundsJSON

        // TODO: Implement sound event merging
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

  async unshift(...soundEvents: SoundsIndexClass[] | SoundEventClass<SOUND_TYPES>[]) {
    if (soundEvents[0] instanceof SoundsIndexClass) {
      for await (const _sounds of soundEvents) {
        const def = await (_sounds as SoundsIndexClass).soundsJSON
        const s = await this.soundsJSON

        // TODO: Implement sound event merging
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
