/* eslint-disable max-len */

import type { NBTSerializable } from 'sandstone/arguments'
import type { MakeInstanceCallable } from 'sandstone/utils'
import { makeClassCallable } from 'sandstone/utils'
import type { SandstonePack } from '../pack'
import type { ConditionClass, SelectorPickClass } from './abstractClasses'
import type { SelectorEntityType, SelectorProperties } from './Selector'
import { SelectorClass } from './Selector'

/**
 * Label tag (/tag) handler
 */
export class _RawLabelClass implements NBTSerializable {
  /**
   * Label name
   */
  public name: `${any}${string}`

  /**
   * Label Tag name with namespace
   */
  public fullName: `${string}.${string}`

  /**
   * Label Description (optional)
   */
  public description?: `${any}${string}`

  constructor(
    private pack: SandstonePack,
    name: `${any}${string}` | `${string}:${string}`,
    description?: `${any}${string}`,
  ) {
    if (name.includes(':')) {
      this.name = name.split(':')[1] as `${any}${string}`
      this.fullName = name.replace(':', '.') as `${string}.${string}`
    } else {
      this.name = name
      this.fullName = `${pack.defaultNamespace}.${name}`
    }

    if (description) this.description = description
  }

  public LabelHolder<IS_SINGLE extends boolean, IS_PLAYER extends boolean>(entity: SelectorClass<false, IS_SINGLE, IS_PLAYER> | SelectorPickClass<IS_SINGLE, IS_PLAYER>): EntityLabel<IS_SINGLE, IS_PLAYER>

  public LabelHolder(target: '@e'): EntityLabel<false, false>

  public LabelHolder(target: '@a'): EntityLabel<false, true>

  public LabelHolder(target: '@s' | '@n'): EntityLabel<true, false>

  public LabelHolder<ENTITY_TYPE extends SelectorEntityType>(target: '@p' | '@r', selectorArguments?: Omit<Omit<SelectorProperties<false, false, ENTITY_TYPE, false>, 'type'>, 'limit'>): EntityLabel<true, true>

  public LabelHolder<ENTITY_TYPE extends SelectorEntityType, PROPERTIES extends Omit<SelectorProperties<false, false, ENTITY_TYPE, false>, 'limit'>>(target: '@s' | '@n', selectorArguments: PROPERTIES):
    EntityLabel<true, PROPERTIES['type'] extends ('player' | 'minecraft:player') ? true : false>

  public LabelHolder<ENTITY_TYPE extends SelectorEntityType, const PROPERTIES extends Omit<SelectorProperties<false, false, ENTITY_TYPE, false>, 'type'>>(target: '@a', selectorArguments: PROPERTIES):
    EntityLabel<PROPERTIES['limit'] extends 1 ? true : false, true>

  public LabelHolder<ENTITY_TYPE extends SelectorEntityType, const PROPERTIES extends SelectorProperties<false, false, ENTITY_TYPE, false>>(target: '@e', selectorArguments: PROPERTIES):
    EntityLabel<PROPERTIES['limit'] extends 1 ? true : false, PROPERTIES['type'] extends ('player' | 'minecraft:player') ? true : false>

  public LabelHolder(entity: '@s' | '@p' | '@a' | '@e' | '@n' | '@r' | SelectorPickClass<boolean, boolean>, selectorArguments?: SelectorProperties<boolean, boolean, SelectorEntityType, false>): EntityLabel<boolean, boolean> {
    if (typeof entity === 'string') {
      return new EntityLabel(this.pack, new SelectorClass(this.pack, entity, selectorArguments), this)
    }
    return new EntityLabel(this.pack, entity, this)
  }

  /**
   * Contains the name and description of the Label (eg. 'wasd:is_walking; Whether the player is not mounted')
   */
  toString = () => `${this.fullName}${this.description ? `; ${this.description}` : ''}`

  /**
   * @internal
   */
  toNBT = () => `'${this.fullName}'`

  __call__<IS_SINGLE extends boolean, IS_PLAYER extends boolean>(entity: SelectorClass<false, IS_SINGLE, IS_PLAYER> | SelectorPickClass<IS_SINGLE, IS_PLAYER>): EntityLabel<IS_SINGLE, IS_PLAYER>

  __call__(target: '@e'): EntityLabel<false, false>

  __call__(target: '@a'): EntityLabel<false, true>

  __call__(target: '@s' | '@n'): EntityLabel<true, false>

  __call__<ENTITY_TYPE extends SelectorEntityType>(target: '@p' | '@r', selectorArguments?: Omit<Omit<SelectorProperties<false, false, ENTITY_TYPE, false>, 'type'>, 'limit'>): EntityLabel<true, true>

  __call__<ENTITY_TYPE extends SelectorEntityType, PROPERTIES extends Omit<SelectorProperties<false, false, ENTITY_TYPE, false>, 'limit'>>(target: '@s' | '@n', selectorArguments: PROPERTIES):
    EntityLabel<true, PROPERTIES['type'] extends ('player' | 'minecraft:player') ? true : false>

  __call__<ENTITY_TYPE extends SelectorEntityType, const PROPERTIES extends Omit<SelectorProperties<false, false, ENTITY_TYPE, false>, 'type'>>(target: '@a', selectorArguments: PROPERTIES):
    EntityLabel<PROPERTIES['limit'] extends 1 ? true : false, true>

  __call__<ENTITY_TYPE extends SelectorEntityType, const PROPERTIES extends SelectorProperties<false, false, ENTITY_TYPE, false>>(target: '@e', selectorArguments: PROPERTIES):
    EntityLabel<PROPERTIES['limit'] extends 1 ? true : false, PROPERTIES['type'] extends ('player' | 'minecraft:player') ? true : false>

  __call__(entity: '@s' | '@p' | '@a' | '@e' | '@n' | '@r' | SelectorPickClass<boolean, boolean>, selectorArguments?: SelectorProperties<boolean, boolean, SelectorEntityType, false>): EntityLabel<boolean, boolean> {
    if (typeof entity === 'string') {
      return new EntityLabel(this.pack, new SelectorClass(this.pack, entity, selectorArguments), this)
    }
    return new EntityLabel(this.pack, entity, this)
  }
}

export const LabelClass = makeClassCallable(_RawLabelClass)
export type LabelClass = MakeInstanceCallable<_RawLabelClass>

export class EntityLabel<IS_SINGLE extends boolean = boolean, IS_PLAYER extends boolean = boolean> implements ConditionClass, SelectorPickClass<IS_SINGLE, IS_PLAYER> {
  declare readonly __componentClassBrand: true
  declare readonly __conditionClassBrand: true

  /**
   * Phantom brand property for TypeScript type discrimination.
   */
  declare readonly __selectorPickBrand: { single: IS_SINGLE; player: IS_PLAYER }

  /** Label */
  public label

  /**
   * Selects entity with the label
   */
  public selector: SelectorClass<false, IS_SINGLE, IS_PLAYER>

  /**
   * Selects entity
   */
  public originalSelector: string | SelectorClass<false, IS_SINGLE, IS_PLAYER>

  /** Test for label on entity */
  public test = this as ConditionClass

  constructor(
    private pack: SandstonePack,
    entity: SelectorClass<false, IS_SINGLE, IS_PLAYER> | SelectorPickClass<IS_SINGLE, IS_PLAYER>,
    label: _RawLabelClass,
  ) {
    this.originalSelector = entity._toSelector()
    this.label = label

    // Haha brrrrrrr
    const selector = (
      typeof this.originalSelector === 'string'
        ? new SelectorClass(this.pack, '@s')
        : new SelectorClass(this.pack, this.originalSelector.target, { ...this.originalSelector.arguments })
    ) as SelectorClass<false, IS_SINGLE, IS_PLAYER>

    if (selector.arguments) {
      if (selector.arguments.tag) {
        if (typeof selector.arguments.tag === 'string' || !Array.isArray(selector.arguments.tag)) {
          selector.arguments.tag = [selector.arguments.tag, label.fullName]
        } else {
          selector.arguments.tag = [...selector.arguments.tag, label.fullName]
        }
      } else selector.arguments.tag = [label.fullName]
    } else selector.arguments = { tag: [label.fullName] } as SelectorProperties<IS_SINGLE, IS_PLAYER, SelectorEntityType, false>

    this.selector = selector
  }

  /**
   * Add label to entity
   */
  public add = () => this.pack.commands.tag(this.originalSelector).add(this.label.fullName)

  /**
   * Remove label from entity
   */
  public remove = () => this.pack.commands.tag(this.originalSelector).remove(this.label.fullName)

  /**
   * Set label on/off for entity
   */
  public set(set: boolean | ConditionClass) {
    if (typeof set === 'boolean') {
      if (set) this.add()
      else this.remove()
    } else {
      this.pack._.if(set, () => this.add()).else(() => this.remove())
    }
  }

  /**
   * Toggle label on/off for entity
   */
  public toggle() {
    this.pack._.if(this.test, () => this.remove()).else(() => this.add())
  }

  /**
   * Contains the selector, and the name/description of the Label (eg. 'Whether @s has the label wasd:is_walking; Whether the player is not mounted')
   */
  public toString = () => `Whether ${this.originalSelector.toString()} has the label ${this.label.toString()}`

  /**
   * @internal
   */
  _toMinecraftCondition = () => new this.pack.conditions.Label(this.pack.core, this)

  /**
   * @internal
   */
  _toSelector = () => this.selector._toSelector()

  /**
   * @internal
   */
  toNBT = () => this.selector._toSelector().toNBT()
}
