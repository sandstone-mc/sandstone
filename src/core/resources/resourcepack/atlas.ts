import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'
import type { SpriteSource } from 'sandstone/arguments/generated/assets/atlas'

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

  getValue = () => jsonStringify(this.resource.atlasJSON)
}

export type AtlasClassArguments = {
  /**
   * The atlas JSON.
   */
  json?: SymbolResource[(typeof AtlasClass)['resourceType']]
} & ResourceClassArguments<'list'>

export class AtlasClass extends ResourceClass<AtlasNode> implements ListResource {
  static readonly resourceType = 'atlas'

  atlasJSON: NonNullable<AtlasClassArguments['json']>

  constructor(core: SandstoneCore, name: string, args: AtlasClassArguments) {
    super(core, { packType: core.pack.resourcePack() }, AtlasNode, core.pack.resourceToPath(name, RESOURCE_PATHS[AtlasClass.resourceType].path), args)

    this.atlasJSON = args.json || { sources: [] }

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
