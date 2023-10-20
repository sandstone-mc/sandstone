import type { SandstoneCommands } from 'sandstone/commands'
import type { SandstoneCore } from 'sandstone/core'

export class MacroArgument {
  protected local: Map<string, string>

  public toMacro: () => string

  constructor(protected sandstoneCore: SandstoneCore) {
    this.local = new Map()

    this.toMacro = () => `$(${this.local.get(this.sandstoneCore.currentNode)})`
  }
}

export type Macroable<T, MACRO extends boolean> = MACRO extends true ? (T | MacroArgument) : T;

export type MacroString<T, MACRO extends boolean> = MACRO extends true ? (T | string) : T

export class MacroClass {
  commands: SandstoneCommands<true>

  constructor(commands: SandstoneCommands<false>) {
    this.commands = commands as unknown as SandstoneCommands<true>
  }
}
