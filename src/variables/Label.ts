/* eslint-disable max-len */

import type { MakeInstanceCallable } from 'sandstone/utils'
import { makeClassCallable } from 'sandstone/utils'
import type { SandstonePack } from '../pack'
import type { ConditionClass, SelectorPickClass } from './abstractClasses'
import type { SelectorEntityType, SelectorProperties } from './Selector'
import { SelectorClass } from './Selector'
import { NBTSerializable } from 'sandstone/arguments';

type SingleEntity = SelectorClass<false, true, boolean> | SelectorPickClass<true, boolean>

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

  public LabelHolder = (entity: SingleEntity | '@s' | '@p' | '@r') => {
    if (typeof entity === 'string') return new EntityLabel(this.pack, new SelectorClass(this.pack, entity), this)
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

  /**
   * @internal
   */
  __call__ = (entity: SingleEntity | '@s' | '@p' | '@r') => this.LabelHolder(entity)
}

export const LabelClass = makeClassCallable(_RawLabelClass)
export type LabelClass = MakeInstanceCallable<_RawLabelClass>

export class EntityLabel implements ConditionClass, SelectorPickClass<true, false> {
  /**
   * Phantom brand property for TypeScript type discrimination.
   */
  declare readonly __selectorPickBrand: { single: true; player: false }

  /** Label */
  public label

  /**
   * Selects entity with the label
   */
  public selector: SelectorClass<false, true, false>

  /**
   * Selects entity
   */
  public originalSelector: string | SelectorClass<false, true, true> | SelectorClass<false, true, false> | SelectorClass<false, true, boolean>

  /** Test for label on entity */
  public test = this as ConditionClass

  constructor(
    private pack: SandstonePack,
    entity: SingleEntity,
    label: _RawLabelClass,
  ) {
    this.originalSelector = entity._toSelector()
    this.label = label

    // Haha brrrrrrr
    const selector = (
      typeof this.originalSelector === 'string'
        ? new SelectorClass(this.pack, '@s')
        : new SelectorClass(this.pack, this.originalSelector.target, { ...this.originalSelector.arguments })
    ) as SelectorClass<false, true, false>

    if (selector.arguments) {
      if (selector.arguments.tag) {
        if (typeof selector.arguments.tag === 'string' || !Array.isArray(selector.arguments.tag)) {
          selector.arguments.tag = [selector.arguments.tag, label.fullName]
        } else {
          selector.arguments.tag = [...selector.arguments.tag, label.fullName]
        }
      } else selector.arguments.tag = [label.fullName]
    } else selector.arguments = { tag: [label.fullName] } as SelectorProperties<true, false, SelectorEntityType, false>

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
