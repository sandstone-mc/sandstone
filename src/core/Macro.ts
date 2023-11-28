/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { SandstoneCore } from 'sandstone/core'
import type { ConditionNode } from 'sandstone/flow'
import type { ConditionClass, DataPointClass } from 'sandstone/variables'

export class MacroArgument {
  protected local: Map<string, string>

  public toMacro: () => string

  readonly Macro = (strings: TemplateStringsArray, ...macros: (string | number | MacroArgument)[]) => new MacroLiteral(this.sandstoneCore, this.local, strings, macros)

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
  public toMacro: () => string

  constructor(public sandstoneCore: SandstoneCore, public local: Map<string, string>, public strings: TemplateStringsArray, public macros: (MacroArgument | string | number)[]) {
    super(sandstoneCore)

    this.toMacro = () => {
      let result = ''

      for (const [i, string] of this.strings.entries()) {
        result += string

        const macro = this.macros[i]

        if (macro !== undefined && macro !== null) {
          if (typeof macro === 'string' || typeof macro === 'number') {
            result += `${macro}`
          } else {
            const current = this.sandstoneCore.currentNode || this.sandstoneCore.getCurrentMCFunctionOrThrow().resource.name

            macro['local'].set(current, this.local.get(current)!)

            result += macro.toMacro()
          }
        }
      }

      return result
    }
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

export class ConditionalDataPointPickClass extends DataPointPickClass implements ConditionClass {
  /**
   * @internal
   */
  _toMinecraftCondition(): ConditionNode {
    throw new Error('Not implemented')
  }
}
