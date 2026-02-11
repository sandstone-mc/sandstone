import { RESOURCE_PATHS } from 'sandstone/arguments'
import type {
  ItemDefinition,
  ItemModel,
  NumericPropertyType,
  RangeDispatch,
  Select,
  SelectPropertyType,
  SpecialModel,
} from 'sandstone/arguments/generated/assets/item_definition'
import type { ModelRef } from 'sandstone/arguments/generated/assets/model'
import type { NBTFloat } from 'sandstone'
import { NBT } from 'sandstone/variables/nbt'
import { ContainerNode } from '../../nodes'
import type { SandstoneCore } from '../../sandstoneCore'
import type { ResourceClassArguments, ResourceNode } from '../resource'
import { ResourceClass, jsonStringify } from '../resource'
import { ModelClass } from './model'
import { ItemPredicateClass } from 'sandstone/variables/ItemPredicate'
import type { SandstonePack } from 'sandstone/pack'

// Helper to normalize model input (string/ModelClass -> { type: 'model', model: ModelRef })
function normalizeModel(input: ItemModel | ModelRef): ItemModel {
  if (typeof input === 'string' || input instanceof ModelClass) {
    return { type: 'model', model: input as ModelRef }
  }
  return input
}

/**
 * Builder for creating item model definitions.
 * Extends ItemPredicateClass to inherit predicate methods (has, without, exact, match, etc.)
 * and adds model-specific methods for building ItemModel JSON.
 */
export class ItemModelBuilder extends ItemPredicateClass {
  private onTrueModel?: ItemModel
  private onFalseModel?: ItemModel
  private explicitModel?: ItemModel

  // ItemModelDefinition-level options
  private _handAnimationOnSwap?: boolean
  private _oversizedInGui?: boolean
  private _swapAnimationScale?: number

  constructor(pack: SandstonePack) {
    super(pack, '*')
  }

  /**
   * Specify the model to use when all conditions match.
   * @param model The ItemModel or model reference string
   */
  onTrue(model: ItemModel | ModelRef): this {
    this.onTrueModel = normalizeModel(model)
    return this
  }

  /**
   * Specify the model to use when any condition fails.
   * @param model The ItemModel or model reference string
   */
  onFalse(model: ItemModel | ModelRef): this {
    this.onFalseModel = normalizeModel(model)
    return this
  }

  /**
   * Create a composite model that renders multiple models layered together.
   * @param models The models to compose
   */
  composite(...models: Array<ItemModel | ModelRef>): this {
    this.explicitModel = {
      type: 'composite',
      models: models.map(normalizeModel),
    }
    return this
  }

  /**
   * Create a select model for value-based branching.
   * @param property The select property type
   * @param config Configuration including cases and optional fallback
   */
  select<P extends SelectPropertyType>(
    property: P,
    config: Omit<Extract<Select, { property: P | `minecraft:${P}` }>, 'type' | 'property'>,
  ): this {
    this.explicitModel = {
      type: 'select',
      property,
      ...config,
    } as ItemModel
    return this
  }

  /**
   * Create a range dispatch model for numeric range-based selection.
   * @param property The numeric property type
   * @param config Configuration including entries and optional fallback
   */
  rangeDispatch<P extends NumericPropertyType>(
    property: P,
    config: Omit<Extract<RangeDispatch, { property: P | `minecraft:${P}` }>, 'type' | 'property'>,
  ): this {
    this.explicitModel = {
      type: 'range_dispatch',
      property,
      ...config,
    } as ItemModel
    return this
  }

  /**
   * Create a special model for hardcoded rendering (heads, banners, etc.).
   * @param model The special model configuration
   * @param base The base model reference providing transformations
   */
  special(model: SpecialModel, base: ModelRef): this {
    this.explicitModel = {
      type: 'special',
      model,
      base,
    }
    return this
  }

  /**
   * Create an empty model that renders nothing.
   */
  empty(): this {
    this.explicitModel = { type: 'empty' }
    return this
  }

  /**
   * Set whether the down-and-up animation should be played when the item stack is changed.
   * @param enabled Whether to enable the animation (defaults to true in Minecraft)
   */
  handAnimationOnSwap(enabled: boolean): this {
    this._handAnimationOnSwap = enabled
    return this
  }

  /**
   * Set whether the item model is allowed to be bigger than its item slot.
   * @param enabled Whether to allow oversized display (defaults to false in Minecraft)
   */
  oversizedInGui(enabled: boolean): this {
    this._oversizedInGui = enabled
    return this
  }

  /**
   * Set how fast the item moves up and down when swapping items in hotbar.
   * @param scale The animation scale (defaults to 1.0 in Minecraft)
   */
  swapAnimationScale(scale: number): this {
    this._swapAnimationScale = scale
    return this
  }

  /**
   * Build the ItemModel JSON from the builder configuration.
   */
  toItemModel(): ItemModel {
    if (this.explicitModel) {
      return this.explicitModel
    }
    return this.buildFromPredicates()
  }

  /**
   * Build the complete ItemModelDefinition JSON including model and options.
   */
  toItemModelDefinition(): ItemDefinition {
    return {
      model: this.toItemModel(),
      ...(this._handAnimationOnSwap !== undefined && { hand_animation_on_swap: this._handAnimationOnSwap }),
      ...(this._oversizedInGui !== undefined && { oversized_in_gui: this._oversizedInGui }),
      ...(this._swapAnimationScale !== undefined && { swap_animation_scale: NBT.float(this._swapAnimationScale) }),
    }
  }

  private buildFromPredicates(): ItemModel {
    // Check for OR groups which are not supported
    for (const group of this.testGroups) {
      if (group.length > 1) {
        throw new Error(
          'ItemModelBuilder does not support OR groups in predicate-to-model conversion. ' +
          'Use multiple chained calls instead of .or(), or use the select/rangeDispatch methods directly.',
        )
      }
    }

    // If no predicates, return empty or throw
    if (this.testGroups.length === 0) {
      if (this.explicitModel) {
        return this.explicitModel
      }
      if (this.onTrueModel) {
        return this.onTrueModel
      }
      throw new Error('ItemModelBuilder requires at least one predicate test or an explicit model type.')
    }

    // Check for count tests and convert to range_dispatch
    const countTests = this.testGroups.filter(g => g[0].component === 'count')
    if (countTests.length > 0) {
      // Convert count test to range_dispatch
      const countTest = countTests[0][0]
      const value = countTest.value as { min?: number; max?: number } | number | undefined

      // Build entries from count range
      const entries: Array<{ threshold: NBTFloat; model: ItemModel }> = []

      if (typeof value === 'number') {
        entries.push({ threshold: NBT.float(value), model: this.onTrueModel || { type: 'empty' } })
      } else if (value && typeof value === 'object') {
        if (value.min !== undefined) {
          entries.push({ threshold: NBT.float(value.min), model: this.onTrueModel || { type: 'empty' } })
        }
      }

      return {
        type: 'range_dispatch',
        property: 'count',
        entries,
        fallback: this.onFalseModel || { type: 'empty' },
      } as ItemModel
    }

    // Build nested conditions from predicates
    const onTrue = this.onTrueModel || { type: 'empty' } as ItemModel
    const onFalse = this.onFalseModel || { type: 'empty' } as ItemModel

    return this.buildNestedConditions(0, onTrue, onFalse)
  }

  private buildNestedConditions(index: number, onTrue: ItemModel, onFalse: ItemModel): ItemModel {
    if (index >= this.testGroups.length) {
      return onTrue
    }

    const test = this.testGroups[index][0]
    const nextCondition = this.buildNestedConditions(index + 1, onTrue, onFalse)

    return this.testToCondition(test, nextCondition, onFalse)
  }

  private testToCondition(
    test: { negated: boolean; component: string; operator: string; value?: unknown },
    onTrue: ItemModel,
    onFalse: ItemModel,
  ): ItemModel {
    // Handle negation by swapping branches
    const [trueModel, falseModel] = test.negated ? [onFalse, onTrue] : [onTrue, onFalse]

    switch (test.operator) {
      case 'exists':
        return {
          type: 'condition',
          property: 'has_component',
          component: test.component,
          on_true: trueModel,
          on_false: falseModel,
        } as ItemModel

      case '=':
      case '~':
        // Both exact (=) and match (~) use the component condition property
        return {
          type: 'condition',
          property: 'component',
          predicate: test.component,
          value: test.value,
          on_true: trueModel,
          on_false: falseModel,
        } as ItemModel

      default:
        throw new Error(`Unknown predicate operator: ${test.operator}`)
    }
  }
}

export class ItemModelDefinitionNode extends ContainerNode implements ResourceNode<ItemModelDefinitionClass> {
  constructor(
    sandstoneCore: SandstoneCore,
    public resource: ItemModelDefinitionClass,
  ) {
    super(sandstoneCore)
  }

  getValue = () => jsonStringify(this.resource.itemDefinitionJSON)
}

export type ItemModelDefinitionInput =
  | ItemDefinition
  | ItemModel
  | ItemModelBuilder
  | ((builder: ItemModelBuilder) => ItemModelBuilder)

export type ItemModelDefinitionClassArguments = {
  definition: ItemModelDefinitionInput
} & ResourceClassArguments<'default'>

/**
 * Resource class for item definitions (items/*.json in resource packs).
 * Controls how items are rendered based on their components and state.
 */
export class ItemModelDefinitionClass extends ResourceClass<ItemModelDefinitionNode> {
  static readonly resourceType = 'item_definition'

  itemDefinitionJSON: ItemDefinition

  constructor(
    core: SandstoneCore,
    name: string,
    args: ItemModelDefinitionClassArguments,
  ) {
    super(
      core,
      { packType: core.pack.resourcePack() },
      ItemModelDefinitionNode,
      core.pack.resourceToPath(name, RESOURCE_PATHS[ItemModelDefinitionClass.resourceType].path),
      args,
    )

    this.itemDefinitionJSON = this.resolveDefinitionInput(args.definition)
    this.handleConflicts()
  }

  private resolveDefinitionInput(input: ItemModelDefinitionInput): ItemDefinition {
    // Callback
    if (typeof input === 'function') {
      const builder = new ItemModelBuilder(this.core.pack)
      return input(builder).toItemModelDefinition()
    }
    // Builder instance
    if (input instanceof ItemModelBuilder) {
      return input.toItemModelDefinition()
    }
    // Full ItemModelDefinition JSON (has 'model' property that is an object with 'type')
    if (input && 'model' in input && input.model && typeof input.model === 'object' && 'type' in input.model) {
      return input as ItemDefinition
    }
    // Raw ItemModel JSON (wrap in definition)
    return { model: input as ItemModel }
  }

  toString = () => `${this.path[0]}:${this.path.slice(2).join('/')}`
}
