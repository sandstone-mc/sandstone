import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

/**
 * A node representing a Minecraft jukebox song (music disc).
 */
export class JukeboxSongNode extends ContainerNode implements ResourceNode<JukeboxSongClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: JukeboxSongClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.jukeboxSongJSON)
}

export type JukeboxSongClassArguments = {
  /**
   * The jukebox song's JSON.
   */
  json: SymbolResource[(typeof JukeboxSongClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class JukeboxSongClass extends ResourceClass<JukeboxSongNode> {
  static readonly resourceType = 'jukebox_song' as const

  public jukeboxSongJSON: NonNullable<JukeboxSongClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: JukeboxSongClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      JukeboxSongNode,
      JukeboxSongClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[JukeboxSongClass.resourceType].path),
      args,
    )

    this.jukeboxSongJSON = args.json

    this.handleConflicts()
  }
}
