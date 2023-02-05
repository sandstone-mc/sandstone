import { toMinecraftResourceName } from '@utils'

import { ContainerNode } from '../nodes'
import { ResourceClass } from './resource'

import type { SandstoneCore } from '../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from './resource'
import type { PredicateJSON, TrimPatternJSON } from '@arguments'
import type { ResourcePath } from '@pack'

type equipmentSlots = 'mainhand' | 'offhand' | 'head' | 'chest' | 'legs' | 'feet'

/**
 * A node representing a Minecraft trim pattern.
 */
export class TrimPatternNode extends ContainerNode implements ResourceNode<TrimPatternClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: TrimPatternClass) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.trimPatternJSON)
}

export type TrimPatternClassArguments = {
  /**
   * The trim pattern's JSON.
   */
  trimPattern: TrimPatternJSON
} & ResourceClassArguments & {
  /**
   * Optional. Defaults to true. Automatically adds armor trim pattern recipe.
   */
  registerPatternRecipe?: boolean
  /**
   * Defaults to all equipment slots. Equipment slots to check in predicate condition, `whole_inventory` will use an `if data` check.
   */
  equipmentCheck?: 'whole_inventory' | equipmentSlots | equipmentSlots[]
}

export class TrimPatternClass extends ResourceClass<TrimPatternNode> {
  public trimPatternJSON: NonNullable<TrimPatternClassArguments['trimPattern']>

  public equipmentCheck

  constructor(sandstoneCore: SandstoneCore, path: ResourcePath, args: TrimPatternClassArguments) {
    super(sandstoneCore, sandstoneCore.pack.dataPack(), 'json', 'utf8', TrimPatternNode, path, args)

    this.trimPatternJSON = args.trimPattern

    this.equipmentCheck = args.equipmentCheck

    if (args.registerPatternRecipe !== false) {
      sandstoneCore.pack.Recipe(sandstoneCore.pack.resourceNameToPath(args.trimPattern.asset_id).slice(1).join('_'), {
        type: 'smithing_trim',
        base: { tag: 'minecraft:trimmable_armor' },
        addition: { tag: 'minecraft:trim_materials' },
        template: { item: args.trimPattern.template_item },
      })
    }
  }

  /** The item used in the smithing table for this pattern. */
  get template() {
    return this.trimPatternJSON.template_item
  }

  /**
   * @internal
   */
  _toMinecraftCondition(): {value: any[]} {
    if (this.equipmentCheck === 'whole_inventory') {
      return {
        value: ['if', 'data', 'entity', '@s', `Inventory[{tag:{Trim:{pattern:"${toMinecraftResourceName(this.path)}"}}}]`],
      }
    }

    // look, this is an incomplete predicate okay, what do you want from me
    const slotCheck: any = {
      condition: 'entity_properties',
      entity: 'this',
      predicate: {
        equipment: {},
      },
    }

    for (const slot of this.equipmentCheck ? [...this.equipmentCheck] : ['mainhand', 'offhand', 'head', 'chest', 'legs', 'feet']) {
      slotCheck[slot] = {
        nbt: `{Trim:{pattern:"${toMinecraftResourceName(this.path)}"}}`,
      }
    }

    const predicate = this.pack.Predicate(`trim_pattern/${this.name}`, slotCheck as PredicateJSON)

    return {
      value: ['if', 'predicate', toMinecraftResourceName(predicate.path)],
    }
  }
}
