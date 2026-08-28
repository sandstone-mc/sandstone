import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

/**
 * A node representing a Minecraft particle definition.
 */
export class ParticleNode extends ContainerNode implements ResourceNode<ParticleClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: ParticleClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type ParticleClassArguments = {
  /**
   * The particle's JSON.
   */
  json: JsonSymbolResource[(typeof ParticleClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class ParticleClass extends ResourceClass<ParticleNode> implements JsonResource {
  static readonly resourceType = 'particle'

  public json: NonNullable<ParticleClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: ParticleClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'json' },
      ParticleNode,
      ParticleClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[ParticleClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
