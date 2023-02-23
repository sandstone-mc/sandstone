import { ContainerNode } from '../nodes'
import { ResourceClass } from './resource'

import type { ConditionClass } from 'sandstone/variables/index'
import type { TagClass } from '../index'
import type { SandstoneCore } from '../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from './resource'
import type { TrimMaterialJSON } from '#arguments'

let trimMaterials: undefined | TagClass<'items'>

type equipmentSlots = 'mainhand' | 'offhand' | 'head' | 'chest' | 'legs' | 'feet'

/**
 * A node representing a Minecraft trim material.
 */
export class TrimMaterialNode extends ContainerNode implements ResourceNode<TrimMaterialClass> {
  constructor(sandstoneCore: SandstoneCore, public resource: TrimMaterialClass) {
    super(sandstoneCore)
  }

  getValue = () => JSON.stringify(this.resource.trimMaterialJSON)
}

export type TrimMaterialClassArguments = {
  /**
   * The trim material's JSON.
   */
  trimMaterial?: TrimMaterialJSON
} & ResourceClassArguments<'default'> & {
  /**
   * Optional. Defaults to true. Automatically adds trim material to #minecraft:trim_materials.
   */
  registerMaterial?: boolean
  /**
   * Defaults to all equipment slots. Equipment slots to check in predicate condition, `whole_inventory` will use an `if data` check.
   */
  equipmentCheck?: 'whole_inventory' | equipmentSlots | equipmentSlots[]
}

export class TrimMaterialClass extends ResourceClass<TrimMaterialNode> implements ConditionClass {
  public trimMaterialJSON: NonNullable<TrimMaterialClassArguments['trimMaterial']>

  readonly equipmentCheck

  constructor(sandstoneCore: SandstoneCore, name: string, args: TrimMaterialClassArguments) {
    super(sandstoneCore, { packType: sandstoneCore.pack.dataPack, extension: 'json' }, TrimMaterialNode, sandstoneCore.pack.resourceToPath(name, ['trim_materials']), args)

    this.trimMaterialJSON = args.trimMaterial as TrimMaterialJSON

    this.equipmentCheck = args.equipmentCheck

    if (args.registerMaterial !== false) {
      if (!trimMaterials) trimMaterials = sandstoneCore.pack.Tag('items', 'minecraft:trim_materials', [this.material])
      else trimMaterials.push(this.material)
    }

    this.handleConflicts()
  }

  /** String which will be used in the resource pack. */
  get assetName() {
    return this.trimMaterialJSON.asset_name
  }

  /** Model override predicate float between 1 & 0. */
  get overrideIndex() {
    return this.trimMaterialJSON.item_model_index
  }

  /** The item used in the smithing table for this material. */
  get material() {
    return this.trimMaterialJSON.ingredient
  }

  /**
   * @internal
   */
  _toMinecraftCondition = () => new this.pack.conditions.TrimMaterial(this.core, this)
}
