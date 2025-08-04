import type { NBTObject } from 'sandstone/arguments'

export type DefaultType<ValueType extends number | NBTObject> = {
  cases: CaseStatement<ValueType>[]
  default: () => any
}

export class CaseStatement<ValueType extends number | NBTObject> {
  constructor(
    readonly value: ValueType,
    readonly callback: () => any,
    readonly previous?: CaseStatement<ValueType>[],
  ) {}

  /** @internal */
  getCases = () => (this.previous ? [...this.previous, this] : [this])

  /** @internal */
  getValue(): readonly ['case', ValueType, () => any] {
    return ['case', this.value, this.callback]
  }

  case(value: ValueType, callback: () => any) {
    return new CaseStatement(value, callback, this.getCases())
  }

  default(callback: () => any) {
    return {
      cases: this.getCases(),
      default: callback,
    }
  }
}
