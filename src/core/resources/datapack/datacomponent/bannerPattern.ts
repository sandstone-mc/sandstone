import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../../nodes'
import type { SandstoneCore } from '../../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

/**
 * A node representing a Minecraft banner pattern.
 */
export class BannerPatternNode extends ContainerNode implements ResourceNode<BannerPatternClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: BannerPatternClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type BannerPatternClassArguments = {
  /**
   * The banner pattern's JSON.
   */
  json: JsonSymbolResource[(typeof BannerPatternClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class BannerPatternClass extends ResourceClass<BannerPatternNode> implements JsonResource {
  static readonly resourceType = 'banner_pattern' as const

  public json: NonNullable<BannerPatternClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: BannerPatternClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      BannerPatternNode,
      BannerPatternClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[BannerPatternClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
