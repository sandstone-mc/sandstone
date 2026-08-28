import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../../nodes'
import type { SandstoneCore } from '../../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

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

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

// TODO: Investigate potential abstractions
export type TrimMaterialClassArguments = {
  /**
   * The trim material's JSON.
   */
  json: JsonSymbolResource[(typeof TrimMaterialClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class TrimMaterialClass extends ResourceClass<TrimMaterialNode> implements JsonResource {
  static readonly resourceType = 'trim_material' as const

  public json: NonNullable<TrimMaterialClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: TrimMaterialClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TrimMaterialNode,
      TrimMaterialClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[TrimMaterialClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }

  /** Palette ID which will be used in the resource pack */
  get palette() {
    return this.json.palette
  }
}
