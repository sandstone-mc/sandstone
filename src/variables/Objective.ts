import type { JsonTextComponent } from '../arguments'
import { JsonTextComponentClass } from './JsonTextComponentClass'

export class ObjectiveClass {
    name: string

    criterion: string

    display: JsonTextComponentClass | undefined

    constructor(name: string, criterion: string, display?: JsonTextComponentClass) {
      this.name = name
      this.criterion = criterion
      this.display = display
    }

    toString() {
      return this.name
    }
}

export function Objective(name: string, criterion: string, display?: JsonTextComponent) {
  return new ObjectiveClass(name, criterion, display === undefined ? undefined : new JsonTextComponentClass(display))
}
