import { RESOURCE_PATHS, type SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'

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

  getValue = () => jsonStringify(this.resource.equipmentJSON)
}

export type EquipmentClassArguments = {
  /**
   * The equipment's JSON.
   */
  json: SymbolResource[(typeof EquipmentClass)['resourceType']]
} & ResourceClassArguments<'default'>

export class EquipmentClass extends ResourceClass<EquipmentNode> {
  static readonly resourceType = 'equipment'

  public equipmentJSON: NonNullable<EquipmentClassArguments['json']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: EquipmentClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'json' },
      EquipmentNode,
      EquipmentClass.resourceType,
      sandstoneCore.pack.resourceToPath(name, RESOURCE_PATHS[EquipmentClass.resourceType].path),
      args,
    )

    this.equipmentJSON = args.json

    this.handleConflicts()
  }
}
