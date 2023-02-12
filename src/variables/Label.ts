import { makeClassCallable } from 'sandstone/utils'

import { Flow } from '../flow/Flow'
import { SelectorClass } from './Selector'

import type { MakeInstanceCallable } from 'sandstone/utils'
import type { SandstonePack } from '../pack'
import type { ConditionClass, SelectorPickClass } from './abstractClasses'
import type { SelectorProperties } from './Selector'

type SingleEntity = SelectorClass<true, boolean> | SelectorPickClass<true, boolean>

/**
 * Label tag (/tag) handler
 */
export class _RawLabelClass {
  /**
   * Label name
   */
  public name: string

  /**
   * Label Tag name with namespace
   */
  public fullName: string

  /**
   * Label Description (optional)
   */
  public description?: string

  constructor(private pack: SandstonePack, name: string, description?: string) {
    if (name.includes('.')) {
      this.name = name.split('.').slice(1).join('.')
      this.fullName = name
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
  public toString = () => `${this.name}${this.description ? `; ${this.description}` : ''}`

  /**
   * @internal
   */
  __call__ = (entity: SingleEntity | '@s' | '@p' | '@r') => this.LabelHolder(entity)
}

export const LabelClass = makeClassCallable(_RawLabelClass)
export type LabelClass = MakeInstanceCallable<_RawLabelClass>

export class EntityLabel implements ConditionClass, SelectorPickClass<true, false> {
  /** Label */
  public label

  /**
   * Selects entity with the label
   */
  public selector: SelectorClass<true, false>

  /**
   * Selects entity
   */
  public originalSelector: SelectorClass<true, false>

  /** Test for label on entity */
  public test = this as ConditionClass

  constructor(private pack: SandstonePack, entity: SingleEntity, label: _RawLabelClass) {
    this.originalSelector = entity._toSelector()
    this.label = label

    // Haha brrrrrrr
    const selector = new SelectorClass(this.pack, entity._toSelector().target, { ...entity._toSelector().arguments }) as SelectorClass<true, false>

    if (selector.arguments) {
      if (selector.arguments.tag) {
        if (typeof selector.arguments.tag === 'string') { selector.arguments.tag = [selector.arguments.tag, label.name] } else { selector.arguments.tag = [...selector.arguments.tag, label.name] }
      } else selector.arguments.tag = label.name
    } else selector.arguments = { tag: label.name } as SelectorProperties<true, false>

    this.selector = selector
  }

  /**
   * Add label to entity
   */
  public add = () => this.pack.commands.tag(this.originalSelector).add(this.label.name)

  /**
   * Remove label from entity
   */
  public remove = () => this.pack.commands.tag(this.originalSelector).remove(this.label.name)

  /**
   * Set label on/off for entity
   */
  public set(set: boolean | ConditionClass) {
    if (typeof set === 'boolean') {
      if (set) this.add()
      else this.remove()
    } else {
      (new Flow(this.pack.core)).if(set, () => this.add())
        .else(() => this.remove())
    }
  }

  /**
   * Toggle label on/off for entity
   */
  public toggle() {
    (new Flow(this.pack.core)).if(this.test, () => this.remove())
      .else(() => this.add())
  }

  /**
   * Contains the selector, and the name/description of the Label (eg. 'Whether @s has the label wasd:is_walking; Whether the player is not mounted')
   */
  public toString = () => `Whether ${this.originalSelector.toString()} has the label ${this.label.toString()}`

  /**
   * @internal
   */
  public _toMinecraftCondition() {
    return { value: ['if', 'entity', this.selector.toString()] as any[] }
  }

  /**
   * @internal
   */
  public _toSelector() {
    return this.selector._toSelector()
  }
}
