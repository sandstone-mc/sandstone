import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'

/**
 * A node representing a Minecraft trim material.
 */
export class TrimMaterialNode extends ContainerNode implements ResourceNode<TrimMaterialClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: TrimMaterialClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.trimMaterialJSON)
}

// TODO: Investigate potential abstractions
export type TrimMaterialClassArguments = {
  /**
   * The trim material's JSON.
   */
  trimMaterial: SymbolResource['trim_material']
} & ResourceClassArguments<'default'>

export class TrimMaterialClass extends ResourceClass<TrimMaterialNode> {
  public trimMaterialJSON: NonNullable<TrimMaterialClassArguments['trimMaterial']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TrimMaterialClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TrimMaterialNode,
      sandstoneCore.pack.resourceToPath(name, ['trim_material']),
      args,
    )

    this.trimMaterialJSON = args.trimMaterial

    this.handleConflicts()
  }

  /** String which will be used in the resource pack. */
  get assetName() {
    return this.trimMaterialJSON.asset_name
  }
}
