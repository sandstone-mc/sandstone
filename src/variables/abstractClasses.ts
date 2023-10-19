import { MacroArgument } from './Macro.js'

import type { JSONTextComponent } from 'sandstone/arguments/jsonTextComponent'
import type { ConditionNode } from '../flow/index.js'
import type { DataPointClass } from './Data.js'
import type { SelectorClass } from './Selector.js'

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
  _toSelector(): SelectorClass<boolean, IsSingle, IsPlayer> | string {
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

export class DataPointPickClass extends MacroArgument {
  /**
   * @internal
   */
  _toDataPoint(): DataPointClass<'storage'> {
    throw new Error('Not implemented')
  }
}
