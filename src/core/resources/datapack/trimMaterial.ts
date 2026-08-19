import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

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

  getValue = () => jsonStringify(this.resource.trimMaterialJSON, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

// TODO: Investigate potential abstractions
export type TrimMaterialClassArguments = {
  /**
   * The trim material's JSON.
   */
  json: /*Json*/SymbolResource[(typeof TrimMaterialClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class TrimMaterialClass extends ResourceClass<TrimMaterialNode> {
  static readonly resourceType = 'trim_material' as const

  public trimMaterialJSON: NonNullable<TrimMaterialClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TrimMaterialClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TrimMaterialNode,
      TrimMaterialClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[TrimMaterialClass.resourceType].path),
      args,
    )

    this.trimMaterialJSON = args.json

    this.handleConflicts()
  }

  /** Palette ID which will be used in the resource pack */
  get palette() {
    return this.trimMaterialJSON.palette
  }
}
