import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

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

  getValue = () => jsonStringify(this.resource.particleJSON)
}

export type ParticleClassArguments = {
  /**
   * The particle's JSON.
   */
  json: SymbolResource[(typeof ParticleClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class ParticleClass extends ResourceClass<ParticleNode> {
  static readonly resourceType = 'particle'

  public particleJSON: NonNullable<ParticleClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: ParticleClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'json' },
      ParticleNode,
      ParticleClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[ParticleClass.resourceType].path),
      args,
    )

    this.particleJSON = args.json

    this.handleConflicts()
  }
}
