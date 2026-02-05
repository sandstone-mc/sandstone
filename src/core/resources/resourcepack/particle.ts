import type { SymbolResource } from 'sandstone/arguments'
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
  particle: SymbolResource['particle']
} & ResourceClassArguments<'default'>

export class ParticleClass extends ResourceClass<ParticleNode> {
  public particleJSON: NonNullable<ParticleClassArguments['particle']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: ParticleClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'json' },
      ParticleNode,
      sandstoneCore.pack.resourceToPath(name, ['particles']),
      args,
    )

    this.particleJSON = args.particle

    this.handleConflicts()
  }
}
