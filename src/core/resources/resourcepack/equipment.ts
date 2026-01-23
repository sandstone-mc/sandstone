import type { SymbolResource } from 'sandstone/arguments'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass } from '../resource'

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

  getValue = () => JSON.stringify(this.resource.equipmentJSON)
}

export type EquipmentClassArguments = {
  /**
   * The equipment's JSON.
   */
  equipment: SymbolResource['equipment']
} & ResourceClassArguments<'default'>

export class EquipmentClass extends ResourceClass<EquipmentNode> {
  public equipmentJSON: NonNullable<EquipmentClassArguments['equipment']>

  constructor(sandstoneCore: SandstoneCore, name: string, args: EquipmentClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.resourcePack(), extension: 'json' },
      EquipmentNode,
      sandstoneCore.pack.resourceToPath(name, ['equipment']),
      args,
    )

    this.equipmentJSON = args.equipment

    this.handleConflicts()
  }
}
