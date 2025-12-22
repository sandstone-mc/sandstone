import type { Dispatcher } from 'sandstone/arguments'
import type { ConditionClass } from 'sandstone/variables'
import { ContainerNode } from '../../nodes.js'
import type { SandstoneCore } from '../../sandstoneCore.js'
import type { ResourceClassArguments, ResourceNode } from '../resource.js'
import { ResourceClass } from '../resource.js'
import type { EquipmentSlots } from './trimMaterial.js'

/**
 * A node representing a Minecraft trim pattern.
 */
export class TrimPatternNode extends ContainerNode implements ResourceNode<TrimPatternClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: TrimPatternClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.trimPatternJSON)
}

export type TrimPatternClassArguments = {
  /**
   * The trim pattern's JSON.
   */
  trimPattern?: Dispatcher<'minecraft:resource'>['trim_pattern']
} & ResourceClassArguments<'default'> & {
    /**
     * Optional. Defaults to true. Automatically adds trim pattern to #minecraft:trim_templates.
     */
    registerPatternTag?: boolean
    /**
     * Optional. Defaults to true. Automatically adds armor trim pattern recipe.
     */
    registerPatternRecipe?: boolean
    /**
     * Defaults to all equipment slots. Equipment slots to check in predicate condition, `whole_inventory` will use an `if data` check.
     */
    equipmentCheck?: 'whole_inventory' | EquipmentSlots | EquipmentSlots[]
  }

export class TrimPatternClass extends ResourceClass<TrimPatternNode> implements ConditionClass {
  public trimPatternJSON: NonNullable<TrimPatternClassArguments['trimPattern']>

  readonly equipmentCheck

  constructor(sandstoneCore: SandstoneCore, name: string, args: TrimPatternClassArguments) {
    super(
      sandstoneCore,
      { packType: sandstoneCore.pack.dataPack(), extension: 'json' },
      TrimPatternNode,
      sandstoneCore.pack.resourceToPath(name, ['trim_pattern']),
      args,
    )

    this.trimPatternJSON = args.trimPattern

    this.equipmentCheck = args.equipmentCheck

    if (args.registerPatternTag !== false) {
      sandstoneCore.pack.Tag('item', 'minecraft:trim_templates', [this.template], { onConflict: 'append' })
    }

    if (args.registerPatternRecipe !== false) {
      let assetID = this.trimPatternJSON.asset_id as string

      if (assetID.includes(':')) {
        assetID = assetID.split(':')[1]
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
