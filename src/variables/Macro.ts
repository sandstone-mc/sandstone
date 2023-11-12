import { makeCallable } from 'sandstone/utils'

import type { SandstoneCommands } from 'sandstone/commands'
import type { SandstoneCore } from 'sandstone/core'

export class MacroArgument {
  protected local: Map<string, string>

  public toMacro: () => string

  constructor(protected sandstoneCore: SandstoneCore) {
    this.local = new Map()

    this.toMacro = () => `$(${this.local.get(this.sandstoneCore.currentNode) || this.local.get(this.sandstoneCore.getCurrentMCFunctionOrThrow().resource.name)})`
  }
}

export type Macroable<T, MACRO extends boolean> = MACRO extends true ? (T | MacroArgument) : T;

export type MacroString<T, MACRO extends boolean> = MACRO extends true ? (T | string) : T

export function isMacroArgument(core: SandstoneCore, arg: any) {
  if (typeof arg === 'object' && Object.hasOwn(arg, 'toMacro')) {
    // eslint-disable-next-line prefer-destructuring
    const local = (arg as MacroArgument)['local']
    if (local.has(core.getCurrentMCFunctionOrThrow().resource.name) || local.has(core.currentNode)) return arg as MacroArgument
  }
  return undefined
}

class MacroLiteral extends MacroArgument {
  public local: Map<string, string> = new Map()

  public toMacro: () => string

  constructor(public sandstoneCore: SandstoneCore, public strings: TemplateStringsArray, public macros: MacroArgument[]) {
    super(sandstoneCore)

    this.toMacro = () => {
      let result = ''

      for (const [i, string] of this.strings.entries()) {
        result += string

        const macro = this.macros[i]

        if (macro) {
          result += macro.toMacro()
        }
      }

      return result
    }
  }
}

export class MacroClass {
  readonly commands: SandstoneCommands<true> & this['__call__']

  __call__ = (strings: TemplateStringsArray, ...macros: MacroArgument[]) => new MacroLiteral(this.sandstoneCore, strings, macros)

  constructor(protected sandstoneCore: SandstoneCore, commands: SandstoneCommands<false>) {
    this.commands = makeCallable(commands, this.__call__) as unknown as SandstoneCommands<true> & this['__call__']
  }
}
