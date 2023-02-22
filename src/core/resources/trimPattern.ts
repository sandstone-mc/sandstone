import { ContainerNode } from '../nodes'
import { ResourceClass } from './resource'

import type { ConditionClass } from 'sandstone/variables/index'
import type { SandstoneCore } from '../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from './resource'
import type { TrimPatternJSON } from '#arguments'

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
  trimPattern?: TrimPatternJSON
} & ResourceClassArguments<'default'> & {
  /**
   * Optional. Defaults to true. Automatically adds armor trim pattern recipe.
   */
  registerPatternRecipe?: boolean
  /**
   * Defaults to all equipment slots. Equipment slots to check in predicate condition, `whole_inventory` will use an `if data` check.
   */
  equipmentCheck?: 'whole_inventory' | equipmentSlots | equipmentSlots[]
}

export class TrimPatternClass extends ResourceClass<TrimPatternNode> implements ConditionClass {
  public trimPatternJSON: NonNullable<TrimPatternClassArguments['trimPattern']>

  readonly equipmentCheck

  constructor(sandstoneCore: SandstoneCore, name: string, args: TrimPatternClassArguments) {
    super(sandstoneCore, { packType: sandstoneCore.pack.dataPack(), extension: 'json' }, TrimPatternNode, sandstoneCore.pack.resourceToPath(name, ['trim_patterns']), args)

    this.trimPatternJSON = args.trimPattern as TrimPatternJSON

    this.equipmentCheck = args.equipmentCheck

    if (args.registerPatternRecipe !== false) {
      let assetID = this.trimPatternJSON.asset_id

      if (assetID.includes(':')) {
        assetID = assetID.split(':')[1]
      }

      if (assetID.includes('/')) {
        assetID = assetID.split('/').join('/')
      }

      sandstoneCore.pack.Recipe(assetID, {
        type: 'smithing_trim',
        base: { tag: 'minecraft:trimmable_armor' },
        addition: { tag: 'minecraft:trim_materials' },
        template: { item: this.trimPatternJSON.template_item },
      })
    }

    this.handleConflicts()
  }

  /** The item used in the smithing table for this pattern. */
  get template() {
    return this.trimPatternJSON.template_item
  }

  /**
   * @internal
   */
  _toMinecraftCondition = () => new this.pack.conditions.TrimPattern(this.core, this)
}
