import type { SandstoneCommands } from 'sandstone/commands'
import type { SandstoneCore } from 'sandstone/core'

export class MacroArgument {
  protected local?: string

  public toMacro: () => string

  constructor() {
    this.toMacro = () => {
      if (!this.local) {
        throw Error('Macro variables must be placed in environment or parameters!')
      }
      return `$(${this.local})`
    }
  }
}

export type Macroable<T, MACRO extends boolean> = MACRO extends true ? (T | MacroArgument) : T;

export type MacroString<T, MACRO extends boolean> = MACRO extends true ? (T | string) : T

export class _Macro {
  commands: SandstoneCommands<true>

  constructor(core: SandstoneCore) {
    this.commands = core.pack.commands as unknown as SandstoneCommands<true>
  }
}
