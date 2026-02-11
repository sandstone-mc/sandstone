import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

/**
 * A node representing a Minecraft post effect (post-processing shader).
 */
export class PostEffectNode extends ContainerNode implements ResourceNode<PostEffectClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: PostEffectClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.postEffectJSON)
}

export type PostEffectClassArguments = {
  /**
   * The post effect's JSON.
   */
  json: SymbolResource[(typeof PostEffectClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class PostEffectClass extends ResourceClass<PostEffectNode> {
  static readonly resourceType = 'post_effect'

  public postEffectJSON: NonNullable<PostEffectClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: PostEffectClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'json' },
      PostEffectNode,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[PostEffectClass.resourceType].path),
      args,
    )

    this.postEffectJSON = args.json

    this.handleConflicts()
  }
}
