import type { JSONTextComponent } from 'src/arguments'

export class JSONTextComponentClass {
  jsonTextComponent: JSONTextComponent

  constructor(jsonTextComponent: JSONTextComponent) {
    this.jsonTextComponent = jsonTextComponent
  }

  toString() {
    // We want a compact output
    return JSON.stringify(this.jsonTextComponent, function (key: string, value: any) {
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
        const realValue = this[parseInt(key, 10)]
        return realValue._toChatComponent?.() ?? realValue.toJSON?.() ?? realValue
      }

      return value._toChatComponent?.() ?? value.toJSON?.() ?? value
    }, 0)
  }

  toJSON() {
    return JSON.parse(this.toString())
  }
}
