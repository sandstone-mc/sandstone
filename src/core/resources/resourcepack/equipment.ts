import { RESOURCE_PATHS } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { JsonResource, ResourceClass, jsonStringify } from '../resource'
import type { JsonSymbolResource } from 'sandstone/arguments/generated/_json/dispatcher'

/**
 * A node representing a Minecraft equipment definition.
 */
export class EquipmentNode extends ContainerNode implements ResourceNode<EquipmentClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: EquipmentClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.json, this.resource._resourceType as keyof typeof RESOURCE_PATHS)
}

export type EquipmentClassArguments = {
  /**
   * The equipment's JSON.
   */
  json: JsonSymbolResource[(typeof EquipmentClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class EquipmentClass extends ResourceClass<EquipmentNode> implements JsonResource {
  static readonly resourceType = 'equipment'

  public json: NonNullable<EquipmentClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: EquipmentClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'json' },
      EquipmentNode,
      EquipmentClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[EquipmentClass.resourceType].path),
      args,
    )

    this.json = args.json

    this.handleConflicts()
  }
}
