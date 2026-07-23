import type { JSONTextComponent } from 'sandstone/arguments/jsonTextComponent'
import type { ConditionNode } from '../flow'
import type { SelectorClass } from './Selector'
import type { NBTSerializable } from 'sandstone/arguments'

export class ComponentClass {
  /**
   * Phantom brand property for TypeScript to identify instances of `ComponentClass`
   * (and subclasses). Does not exist at runtime. Preserved when `@internal` members
   * are stripped, so structural type checks (e.g. `Exclude<T, ComponentClass>`)
   * behave correctly.
   */
  declare readonly __componentClassBrand: true

  /**
   * @internal
   */
  _toChatComponent(): JSONTextComponent {
    throw new Error('Not implemented')
  }
}
export class ConditionClass {
  /**
   * Phantom brand property for TypeScript to identify instances of `ConditionClass`
   * (and subclasses). Does not exist at runtime. Preserved when `@internal` members
   * are stripped.
   */
  declare readonly __conditionClassBrand: true

  /**
   * @internal
   */
  _toMinecraftCondition(): ConditionNode {
    throw new Error('Not implemented')
  }
}

export class SelectorPickClass<IsSingle extends boolean, IsPlayer extends boolean> implements NBTSerializable {
  /**
   * Phantom brand property for TypeScript to distinguish between different
   * SelectorPickClass type parameter combinations. Does not exist at runtime.
   */
  declare readonly __selectorPickBrand: { single: IsSingle; player: IsPlayer }

  /**
   * @internal
   */
  _toSelector(): SelectorClass<false, IsSingle, IsPlayer> | string {
    throw new Error('Not implemented')
  }
  /**
   * @internal
   */
  toNBT(): string {
    throw new Error('Not implemented')
  }
}

export class ConditionTextComponentClass extends ComponentClass implements ConditionClass {
  /**
   * Phantom brand property for TypeScript to identify instances of `ComponentClass`
   * (and subclasses). Does not exist at runtime.
   */
  declare readonly __componentClassBrand: true

  /**
   * Phantom brand property for TypeScript to identify instances of `ConditionClass`
   * (and subclasses). Does not exist at runtime.
   */
  declare readonly __conditionClassBrand: true

  /**
   * @internal
   */
  _toChatComponent(): JSONTextComponent {
    throw new Error('Not implemented')
  }

  /**
   * @internal
   */
  _toMinecraftCondition(): ConditionNode {
    throw new Error('Not implemented')
  }
}
