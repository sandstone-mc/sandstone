import type { ConditionNode } from '../flow/index.js'
import type { DataPointClass } from './index.js'
import type { SelectorClass } from './Selector.js'
import type { JSONTextComponent } from 'sandstone/arguments/jsonTextComponent.js'

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

export class SelectorPickClass<IsSingle extends boolean, IsPlayer extends boolean> {
  /**
   * @internal
   */
  _toSelector(): SelectorClass<IsSingle, IsPlayer> | string {
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

export class DataPointPickClass {
  /**
   * @internal
   */
  _toDataPoint(): DataPointClass<'storage'> {
    throw new Error('Not implemented')
  }
}
