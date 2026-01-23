import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'

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

  getValue = () => JSON.stringify(this.resource.jukeboxSongJSON)
}

export type JukeboxSongClassArguments = {
  /**
   * The jukebox song's JSON.
   */
  jukeboxSong: SymbolResource['jukebox_song']
} & ResourceClassArguments<'default'>

export class JukeboxSongClass extends ResourceClass<JukeboxSongNode> {
  public jukeboxSongJSON: NonNullable<JukeboxSongClassArguments['jukeboxSong']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: JukeboxSongClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      JukeboxSongNode,
      sandstoneCore.pack.resourceToPath(name, ['jukebox_song']),
      args,
    )

    this.jukeboxSongJSON = args.jukeboxSong

    this.handleConflicts()
  }
}
