import type { SandstoneCommands } from 'sandstone/commands'
import type { SandstoneCore } from 'sandstone/core'

export class MacroArgument<LOCAL extends string> {
  protected local: LOCAL

  constructor(local: LOCAL) {
    this.local = local
  }

  /** @internal */
  get toString(): `\${${LOCAL}}` {
    return `\${${this.local}}`
  }
}

export type Macroable<T, MACRO extends boolean> = MACRO extends true ? (T | MacroArgument<string>) : T;

export type MacroString<T, MACRO extends boolean> = MACRO extends true ? (T | string) : T

class _Macro {
  commands: SandstoneCommands<true>

  constructor(core: SandstoneCore) {
    this.commands = core.pack.commands as unknown as SandstoneCommands<true>
  }
}
