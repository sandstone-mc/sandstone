import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'
import type { SpriteSource } from 'sandstone/arguments/generated/assets/atlas'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'
import type { JsonSpriteSource } from 'sandstone/arguments/generated/_json/assets/atlas'

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

  getValue = () => jsonStringify(this.resource.atlasJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type AtlasClassArguments = {
  /**
   * The atlas JSON.
   */
  json?: JsonSymbolResource[(typeof AtlasClass)['resourceType']]
} & ResourceClassArguments<'list'>

export class AtlasClass extends ResourceClass<AtlasNode> implements ListResource {
  static readonly resourceType = 'atlas'

  atlasJSON: NonNullable<AtlasClassArguments['json']>

  constructor(core: SandstoneCore, name: string, args: AtlasClassArguments) {
    super(
      core,
      { packType: core.pack.resourcePack() },
      AtlasNode,
      AtlasClass.resourceType,
      core.pack.resourceToPath(name, RESOURCE_PATHS[AtlasClass.resourceType].path),
      args,
    )

    this.atlasJSON = args.json || { sources: [] }

    this.handleConflicts()
  }

  push(...sources: JsonSpriteSource[] | AtlasClass[]) {
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

  unshift(...sources: JsonSpriteSource[] | AtlasClass[]) {
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
