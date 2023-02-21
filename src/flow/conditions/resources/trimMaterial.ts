import { SingleConditionNode } from '../condition'

import type { SandstoneCore, TrimMaterialClass } from '#core'

export class TrimMaterialConditionNode extends SingleConditionNode {
  constructor(sandstoneCore: SandstoneCore, readonly trimMaterial: TrimMaterialClass) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    const { trimMaterial } = this
    if (trimMaterial.equipmentCheck === 'whole_inventory') {
      return ['data', 'entity', '@s', `Inventory[{tag:{Trim:{material:"${trimMaterial.name}"}}}]`]
    }

    // look, this is an incomplete predicate okay, what do you want from me
    const slotCheck: any = {
      condition: 'entity_properties',
      entity: 'this',
      predicate: {
        equipment: {},
      },
    }

    for (const slot of trimMaterial.equipmentCheck ? [...trimMaterial.equipmentCheck] : ['mainhand', 'offhand', 'head', 'chest', 'legs', 'feet']) {
      slotCheck[slot] = {
        nbt: `{Trim:{material:"${trimMaterial.name}"}}`,
      }
    }

    const predicate = this.sandstoneCore.pack.Predicate(`trim_material/${trimMaterial.path.slice(1).join('/')}`, slotCheck)

    return ['predicate', predicate.name]
  }
}
