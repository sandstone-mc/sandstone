import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../../nodes'
import type { SandstoneCore } from '../../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

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

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type JukeboxSongClassArguments = {
  /**
   * The jukebox song's JSON.
   */
  json: JsonSymbolResource[(typeof JukeboxSongClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class JukeboxSongClass extends ResourceClass<JukeboxSongNode> implements JsonResource {
  static readonly resourceType = 'jukebox_song' as const

  public json: NonNullable<JukeboxSongClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: JukeboxSongClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      JukeboxSongNode,
      JukeboxSongClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[JukeboxSongClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
