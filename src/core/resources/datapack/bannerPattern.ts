import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

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

  getValue = () => jsonStringify(this.resource.bannerPatternJSON)
}

export type BannerPatternClassArguments = {
  /**
   * The banner pattern's JSON.
   */
  json: SymbolResource[(typeof BannerPatternClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class BannerPatternClass extends ResourceClass<BannerPatternNode> {
  static readonly resourceType = 'banner_pattern' as const

  public bannerPatternJSON: NonNullable<BannerPatternClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: BannerPatternClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      BannerPatternNode,
      BannerPatternClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[BannerPatternClass.resourceType].path),
      args,
    )

    this.bannerPatternJSON = args.json

    this.handleConflicts()
  }
}
