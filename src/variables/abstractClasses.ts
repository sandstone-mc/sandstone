import type { JSONTextComponent } from 'sandstone/arguments/jsonTextComponent'
import type { ConditionNode } from '../flow'
import type { SelectorClass } from './Selector'
import { NBTSerializable } from 'sandstone/arguments'

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
   * @internal
   */
  _toSelector(): SelectorClass<boolean, IsSingle, IsPlayer> | string {
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
