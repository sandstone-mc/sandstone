import { SandstoneCommands } from "sandstone/commands/commands.js";
import { SandstoneCore } from "sandstone/core/sandstoneCore.js";

export class MacroArgument<LOCAL extends string> {
  protected local: LOCAL

  constructor(local: LOCAL) {
    this.local = local
  }

  /** @internal */
  get toString() {
    return `\${${this.local}}`
  }
}

export type Macroable<T, MACRO extends boolean> = MACRO extends true ? (T | MacroArgument<string>) : T;

class _Macro {
  commands: SandstoneCommands<true>

  constructor(core: SandstoneCore) {
    this.commands = core.pack.commands as unknown as SandstoneCommands<true>
  }
}
