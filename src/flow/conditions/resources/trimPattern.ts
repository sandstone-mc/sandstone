import { SingleConditionNode } from '../condition.js'

import type { SandstoneCore, TrimPatternClass } from 'sandstone/core/index.js'

export class TrimPatternConditionNode extends SingleConditionNode {
  constructor(sandstoneCore: SandstoneCore, readonly trimPattern: TrimPatternClass) {
    super(sandstoneCore)
  }

  getCondition(): unknown[] {
    const { trimPattern } = this

    if (trimPattern.equipmentCheck === 'whole_inventory') {
      return ['data', 'entity', '@s', `Inventory[{tag:{Trim:{pattern:"${trimPattern.name}"}}}]`]
    }

    // look, this is an incomplete predicate okay, what do you want from me
    const slotCheck: any = {
      condition: 'entity_properties',
      entity: 'this',
      predicate: {
        equipment: {},
      },
    }

    for (const slot of trimPattern.equipmentCheck ? [...trimPattern.equipmentCheck] : ['mainhand', 'offhand', 'head', 'chest', 'legs', 'feet']) {
      slotCheck[slot] = {
        nbt: `{Trim:{pattern:"${trimPattern.name}"}}`,
      }
    }

    const predicate = this.sandstoneCore.pack.Predicate(`trim_pattern/${trimPattern.path.slice(1).join('/')}`, slotCheck)

    return ['predicate', predicate.name]
  }
}
