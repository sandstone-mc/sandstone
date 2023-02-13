import type { DataPointClass } from './index'
import type { SelectorClass } from './Selector'
import type { JSONTextComponent } from '#arguments/jsonTextComponent'

export class ComponentClass {
  _toChatComponent(): JSONTextComponent {
    throw new Error('Not implemented')
  }
}

// TODO: Update all of these to return a ConditionNode instead
export class ConditionClass {
  /**
   * @internal
   */
  _toMinecraftCondition(): {value: any[]} {
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
  _toMinecraftCondition(): {value: any[]} {
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
