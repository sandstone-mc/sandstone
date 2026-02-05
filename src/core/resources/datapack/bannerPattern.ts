import type { SymbolResource } from 'sandstone/arguments'
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
  bannerPattern: SymbolResource['banner_pattern']
} & ResourceClassArguments<'default'>

export class BannerPatternClass extends ResourceClass<BannerPatternNode> {
  public bannerPatternJSON: NonNullable<BannerPatternClassArguments['bannerPattern']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: BannerPatternClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      BannerPatternNode,
      sandstoneCore.pack.resourceToPath(name, ['banner_pattern']),
      args,
    )

    this.bannerPatternJSON = args.bannerPattern

    this.handleConflicts()
  }
}
