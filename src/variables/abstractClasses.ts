import type { JSONTextComponent } from 'sandstone/arguments/jsonTextComponent'
import type { ConditionNode } from '../flow'
import type { SelectorClass } from './Selector'
import type { NBTSerializable } from 'sandstone/arguments'

export class TextComponentClass {
  /**
   * Phantom brand property for TypeScript to identify instances of `TextComponentClass`
   * (and subclasses). Does not exist at runtime.
   */
  declare readonly __textComponentClassBrand: true

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
   * (and subclasses). Does not exist at runtime.
   */
  declare readonly __conditionClassBrand: true

  /**
   * @internal
   */
  _toMinecraftCondition(): ConditionNode {
    throw new Error('Not implemented')
  }
}

export class SelectorPickClass<IsSingle extends boolean, IsPlayer extends boolean> implements NBTSerializable, TextComponentClass {
  /**
   * Phantom brand property for TypeScript to distinguish between different
   * SelectorPickClass type parameter combinations. Does not exist at runtime.
   */
  declare readonly __selectorPickBrand: { single: IsSingle; player: IsPlayer }

  /**
   * Phantom brand property for TypeScript to identify instances of `TextComponentClass`
   * (and subclasses). Does not exist at runtime.
   */
  declare readonly __textComponentClassBrand: true

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
  /**
   * @internal
   */
  _toChatComponent(): JSONTextComponent {
    throw new Error('Not implemented')
  }
}

export class ConditionTextComponentClass extends TextComponentClass implements ConditionClass {
  /**
   * Phantom brand property for TypeScript to identify instances of `TextComponentClass`
   * (and subclasses). Does not exist at runtime.
   */
  declare readonly __textComponentClassBrand: true

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
