import type { JsonTextComponent } from 'src/arguments/jsonTextComponent'

export class ComponentClass {
  protected _toChatComponent(): JsonTextComponent {
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

export class ConditionTextComponentClass {
  protected _toChatComponent(): JsonTextComponent {
    throw new Error('Not implemented')
  }

  _toMinecraftCondition(): {value: any[]} {
    throw new Error('Not implemented')
  }
}
