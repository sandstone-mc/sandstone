import type { JSONTextComponent } from 'sandstone/arguments'
import { isMacroArgument, type MacroArgument } from 'sandstone/core'
import type { SandstoneCore } from 'sandstone/core/sandstoneCore'
import * as util from 'util'
import { formatDebugString } from '../utils'

function toComponent(c: any): JSONTextComponent {
  // Prefer _toChatComponent for JSON serialization - _toSelector may return objects with circular references
  return c._toChatComponent?.() ?? c.toJSON?.() ?? c
}

export function parseJSONText(
  core: SandstoneCore,
  jsonText: undefined | MacroArgument | JSONTextComponent,
): undefined | MacroArgument | JSONTextComponentClass {
  if (jsonText === undefined) return undefined

  if (isMacroArgument(core, jsonText)) {
    return jsonText as MacroArgument
  }

  return new JSONTextComponentClass(jsonText as JSONTextComponent)
}

export class JSONTextComponentClass {
  jsonTextComponent: JSONTextComponent

  constructor(jsonTextComponent: JSONTextComponent) {
    this.jsonTextComponent = jsonTextComponent
  }

  toString() {
    // We want a compact output
    return JSON.stringify(
      toComponent(this.jsonTextComponent),
      (key: string, value: any) => {
        /*
         * If we are in an array, our component could be a custom object (like a Selector) that is directly used as a chat component.
         * Therefore, we must try to transform it into a chat component, or a json object.
         * If not possible, we fallback on the original value.
         */
        if (Array.isArray(this)) {
          /*
           * The value given is not the real original value, but sometimes it is the stringified value.
           * Therefore, we must get back the real one.
           */
          const realValue = this[Number.parseInt(key, 10)] as any
          return toComponent(realValue)
        }

        return toComponent(value)
      },
      0,
    )
  }

  toJSON() {
    return JSON.parse(this.toString())
  }

  [util.inspect.custom](depth: number, options: any) {
    return formatDebugString(this.constructor.name, this.toString(), undefined, options.indent)
  }
}
