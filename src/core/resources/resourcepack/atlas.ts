import type { Dispatcher } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'
import { SpriteSource } from 'sandstone/arguments/generated/assets/atlas'

/**
 * A node representing a Minecraft atlas.
 */
export class AtlasNode extends ContainerNode implements ResourceNode<AtlasClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: AtlasClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.atlasJSON)
}

export type AtlasClassArguments = {
  /**
   * The atlas JSON.
   */
  atlas?: Dispatcher<'minecraft:resource'>['atlas']
} & ResourceClassArguments<'list'>

export class AtlasClass extends ResourceClass<AtlasNode> implements ListResource {
  atlasJSON: NonNullable<AtlasClassArguments['atlas']>

  constructor(core: SandstoneCore, name: string, args: AtlasClassArguments) {
    super(core, { packType: core.pack.resourcePack() }, AtlasNode, core.pack.resourceToPath(name, ['atlases']), args)

    this.atlasJSON = args.atlas || { sources: [] }

    this.handleConflicts()
  }

  push(...sources: SpriteSource[] | AtlasClass[]) {
    if (sources[0] instanceof AtlasClass) {
      for (const provider of sources) {
        /** @ts-ignore */
        this.atlasJSON.sources.push(...provider.atlasJSON.sources)
      }
    } else {
      /** @ts-ignore */
      this.atlasJSON.sources.push(...sources)
    }
  }

  unshift(...sources: SpriteSource[] | AtlasClass[]) {
    if (sources[0] instanceof AtlasClass) {
      for (const provider of sources) {
        /** @ts-ignore */
        this.atlasJSON.sources.unshift(...provider.atlasJSON.sources)
      }
    } else {
      /** @ts-ignore */
      this.atlasJSON.sources.unshift(...sources)
    }
  }
}
