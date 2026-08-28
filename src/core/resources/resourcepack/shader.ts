import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

/**
 * A node representing a Minecraft shader program.
 */
export class ShaderNode extends ContainerNode implements ResourceNode<ShaderClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: ShaderClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type ShaderClassArguments = {
  /**
   * The shader's JSON.
   */
  json: JsonSymbolResource[(typeof ShaderClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class ShaderClass extends ResourceClass<ShaderNode> implements JsonResource {
  static readonly resourceType = 'shader'

  public json: NonNullable<ShaderClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: ShaderClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'json' },
      ShaderNode,
      ShaderClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[ShaderClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
