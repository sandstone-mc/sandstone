import type { JSONTextComponent } from 'sandstone/arguments/jsonTextComponent'
import type { ConditionNode } from '../flow'
import type { SelectorClass } from './Selector'
import type { NBTSerializable } from 'sandstone/arguments'

export class ComponentClass {
  /**
   * @internal
   */
  _toChatComponent(): JSONTextComponent {
    throw new Error('Not implemented')
  }
}
export class ConditionClass {
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
