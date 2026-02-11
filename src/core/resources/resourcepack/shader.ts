import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

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

  getValue = () => jsonStringify(this.resource.shaderJSON)
}

export type ShaderClassArguments = {
  /**
   * The shader's JSON.
   */
  json: SymbolResource[(typeof ShaderClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class ShaderClass extends ResourceClass<ShaderNode> {
  static readonly resourceType = 'shader'

  public shaderJSON: NonNullable<ShaderClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: ShaderClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'json' },
      ShaderNode,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[ShaderClass.resourceType].path),
      args,
    )

    this.shaderJSON = args.json

    this.handleConflicts()
  }
}