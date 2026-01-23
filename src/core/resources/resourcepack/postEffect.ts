import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'

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

  getValue = () => JSON.stringify(this.resource.postEffectJSON)
}

export type PostEffectClassArguments = {
  /**
   * The post effect's JSON.
   */
  postEffect: SymbolResource['post_effect']
} & ResourceClassArguments<'default'>

export class PostEffectClass extends ResourceClass<PostEffectNode> {
  public postEffectJSON: NonNullable<PostEffectClassArguments['postEffect']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: PostEffectClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'json' },
      PostEffectNode,
      sandstoneCore.pack.resourceToPath(name, ['post_effect']),
      args,
    )

    this.postEffectJSON = args.postEffect

    this.handleConflicts()
  }
}
