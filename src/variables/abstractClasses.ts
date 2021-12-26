import type { RawJSONTextComponent } from '@arguments/jsonTextComponent'

export class TextComponentClass {
  toJSONTextComponent(): RawJSONTextComponent {
    throw new Error('Not implemented')
  }
}

export class ConditionClass {
  /**
   * @internal
   */
  _toMinecraftCondition(): {value: any[]} {
    throw new Error('Not implemented')
  }
}

export class ConditionTextComponentClass extends TextComponentClass implements ConditionClass {
  _toMinecraftCondition(): {value: any[]} {
    throw new Error('Not implemented')
  }
}
