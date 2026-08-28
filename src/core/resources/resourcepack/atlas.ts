import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ListResource, ResourceClassArguments, ResourceNode } from '../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../resource'
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

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type AtlasClassArguments = {
  /**
   * The atlas JSON.
   */
  json?: JsonSymbolResource[(typeof AtlasClass)['resourceType']]
} & ResourceClassArguments<'list'>

export class AtlasClass extends ResourceClass<AtlasNode> implements JsonResource, ListResource {
  static readonly resourceType = 'atlas'

  json: NonNullable<AtlasClassArguments['json']>

  constructor(core: SandstoneCore, name: string, args: AtlasClassArguments) {
    super(
      core,
      { packType: core.pack.resourcePack() },
      AtlasNode,
      AtlasClass.resourceType,
      core.pack.resourceToPath(name, RESOURCE_PATHS[AtlasClass.resourceType].path),
      args,
    )

    this.json = args.json || { sources: [] }

    this.handleConflicts()
  }

  push(...sources: JsonSpriteSource[] | AtlasClass[]) {
    if (sources[0] instanceof AtlasClass) {
      for (const provider of sources) {
        /** @ts-ignore */
        this.json.sources.push(...provider.atlasJSON.sources)
      }
    } else {
      /** @ts-ignore */
      this.json.sources.push(...sources)
    }
  }

  unshift(...sources: JsonSpriteSource[] | AtlasClass[]) {
    if (sources[0] instanceof AtlasClass) {
      for (const provider of sources) {
        /** @ts-ignore */
        this.json.sources.unshift(...provider.atlasJSON.sources)
      }
    } else {
      /** @ts-ignore */
      this.json.sources.unshift(...sources)
    }
  }
}
