import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

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

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type PostEffectClassArguments = {
  /**
   * The post effect's JSON.
   */
  json: JsonSymbolResource[(typeof PostEffectClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class PostEffectClass extends ResourceClass<PostEffectNode> implements JsonResource {
  static readonly resourceType = 'post_effect'

  public json: NonNullable<PostEffectClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: PostEffectClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'json' },
      PostEffectNode,
      PostEffectClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[PostEffectClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
