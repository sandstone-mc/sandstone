/* eslint-disable max-len */
import { ConditionalDataPointPickClass } from './abstractClasses.js'

import type { NBTObject, RootNBT } from 'sandstone/arguments'
import type { ConditionNode } from 'sandstone/flow'
import type { LiteralUnion } from 'sandstone/utils'
import type { SandstonePack } from '../pack/index.js'
import type { DataPointPickClass } from './abstractClasses.js'
import type { DataPointClass, StringDataPointClass } from './Data.js'

export abstract class IterableDataClass extends ConditionalDataPointPickClass {
  iterator(callback: (dataPoints: [DataPointClass] | [StringDataPointClass, DataPointClass]) => void): () => void {
    throw new Error('Not implemented')
  }

  size(): DataPointClass<'storage'> {
    throw new Error('Not implemented')
  }

  last(): readonly [StringDataPointClass, DataPointClass] | DataPointClass {
    throw new Error('Not implemented')
  }

  get continue(): ConditionNode {
    throw new Error('Not implemented')
  }
}

type GetKeys<T> = T extends unknown[]
  ? T extends [] // special case empty tuple => no keys
    ? never
    : '0' extends keyof T // any tuple with at least one element
    ? Exclude<keyof T, keyof []>
    : number // other array
  : keyof T; // not an array

export type DataIndexMapInitial = RootNBT | Record<string, DataPointClass | DataPointPickClass>

export class DataIndexMapClass<INITIAL extends DataIndexMapInitial> extends IterableDataClass {
  dataPoint: NonNullable<DataPointClass<'storage'>>

  constructor(private pack: SandstonePack, private initialize: INITIAL, dataPoint?: DataPointClass<'storage'>) {
    super(pack.core)

    if (dataPoint) {
      this.dataPoint = dataPoint
    } else {
      this.dataPoint = this.pack.DataVariable(undefined, 'IndexMap')
    }

    for (const [i, [key, value]] of Object.entries(initialize).entries()) {
      this.dataPoint.select('Index').select(key).set(i)

      this.dataPoint.select('Entries').append([])

      const entry = this.dataPoint.select(`Entries[${i}]`)

      entry.append(key)

      entry.append(value)
    }
  }

  __entryIterator?: DataPointClass<'storage'>

  get entryIterator() {
    if (!this.__entryIterator) {
      this.__entryIterator = this.pack.DataVariable(this.dataPoint.select('Entries')).select('[-1]')
    }

    return this.__entryIterator
  }

  iterator(callback: (data: [key: StringDataPointClass, value: DataPointClass]) => void) {
    this.__entryIterator = undefined

    return () => {
      callback([this.entryIterator.select('[0]').slice(0), this.entryIterator.select('[1]')])

      this.entryIterator.remove()
    }
  }

  get continue() {
    return this.entryIterator._toMinecraftCondition()
  }

  /**
   * Use in conjunction with a Score to get the count of entries.
   *
   * @example
   * Variable(map.size(), 'map_size')
   *
   * @returns The entries of the map.
   */
  size = () => this.dataPoint.select('Entries')

  last = () => [this.dataPoint.select('Entries[-1][0]').slice(0), this.dataPoint.select('Entries[-1][1]')] as readonly [key: StringDataPointClass, value: DataPointClass]

  /**
   * @returns The index of the entry.
   */
  set(key: LiteralUnion<GetKeys<INITIAL>>, value: NBTObject | DataPointClass | DataPointPickClass) {
    if (this.initialize[key]) {
      const index = Object.entries(this.initialize).findIndex(([k]) => k === key)

      this.dataPoint.select(`Entries[${index}]`).set(value as NBTObject)

      return index
    }

    this.dataPoint.select('Keys').append(key)

    this.dataPoint.select('Values').append(value as NBTObject)

    const index = this.pack.Variable(this.size())

    this.dataPoint.select('Index').select(key).set(index)

    this.dataPoint.select('Entries').append([])

    const entry = this.dataPoint.select('Entries[-1]')

    entry.append(key)

    entry.append(value)

    return index
  }

  // If the map was declared with a DataPointClass, return that class type to retain child type safety, otherwise return a normal DataPointClass

  get(key: GetKeys<INITIAL>): INITIAL[typeof key] extends DataPointClass ? INITIAL[typeof key] : DataPointClass<'storage'>

  get(key: string): DataPointClass<'storage'>

  get(key: LiteralUnion<GetKeys<INITIAL>>) {
    if (this.initialize[key]) {
      const index = Object.entries(this.initialize).findIndex(([k]) => k === key)

      return this.dataPoint.select(`Entries[${index}]`)
    }

    const index = this.dataPoint.select('Index').select(key)

    const {
      MCFunction, Macro, DataVariable,
    } = this.pack

    const value = DataVariable()

    MCFunction('__sandstone:variable/index_map/get', [index], () => {
      Macro.data.modify.storage(value.currentTarget, value.path).set.from.storage(this.dataPoint.currentTarget, Macro`Entries[${index}]`)
    })()

    return value
  }

  remove(key: LiteralUnion<GetKeys<INITIAL>>) {
    const index = this.dataPoint.select('Index').select(key)

    const { MCFunction, Macro } = this.pack

    MCFunction('__sandstone:variable/index_map/remove', [index], () => {
      Macro.data.modify.storage(this.dataPoint.currentTarget, Macro`Entries[${index}]`).set.value(0)

      index.remove()
    })()

    return this
  }

  _toDataPoint = () => this.dataPoint

  _toMinecraftCondition() {
    return this.dataPoint._toMinecraftCondition()
  }
}

export type DataArrayInitial = readonly NBTObject[] | readonly [string, DataPointClass | DataPointPickClass]

export class DataArrayClass<INITIAL extends DataArrayInitial> extends IterableDataClass {
  dataPoint: NonNullable<DataPointClass<'storage'>>

  constructor(private pack: SandstonePack, initialize: INITIAL, dataPoint?: DataPointClass<'storage'>) {
    super(pack.core)

    if (dataPoint) {
      this.dataPoint = dataPoint
    } else {
      this.dataPoint = this.pack.DataVariable([], 'Array')
    }

    for (const entry of initialize) {
      this.dataPoint.append(entry)
    }
  }

  __entryIterator?: DataPointClass<'storage'>

  get entryIterator() {
    if (!this.__entryIterator) {
      this.__entryIterator = this.pack.DataVariable(this.dataPoint).select('[-1]')
    }

    return this.__entryIterator
  }

  iterator(callback: (data: [entry: DataPointClass]) => void) {
    this.__entryIterator = undefined

    return () => {
      callback([this.entryIterator])

      this.entryIterator.remove()
    }
  }

  get continue() {
    return this.entryIterator._toMinecraftCondition()
  }

  /**
   * Use in conjunction with a Score to get the count of entries.
   *
   * @example
   * Variable(array.size(), 'array_size')
   *
   * @returns The entries of the array.
   */
  size = () => this.dataPoint

  last = () => this.dataPoint.select('[-1]')

  set(index: number, value: NBTObject | DataPointClass | DataPointPickClass) {
    this.dataPoint.select(`[${index}]`).set(value as NBTObject)

    return this
  }

  push(value: NBTObject | DataPointClass | DataPointPickClass) {
    this.dataPoint.append(value as NBTObject)

    return this
  }

  unshift(value: NBTObject | DataPointClass | DataPointPickClass) {
    this.dataPoint.prepend(value as NBTObject)

    return this
  }

  get(index: number) {
    return this.dataPoint.select(`[${index}]`)
  }

  remove(index: number) {
    this.dataPoint.select(`[${index}]`).remove()

    return this
  }

  _toDataPoint = () => this.dataPoint

  _toMinecraftCondition() {
    return this.dataPoint._toMinecraftCondition()
  }
}

export function DataIndexMap<INITIAL extends DataIndexMapInitial>(pack: SandstonePack, initialize: INITIAL, dataPoint?: DataPointClass<'storage'>) {
  const indexMap = new DataIndexMapClass(pack, initialize, dataPoint)

  return new Proxy(indexMap, {
    get(target, p, receiver) {
      if (p in target) {
        return Reflect.get(target, p, receiver)
      }

      return target.get(p as string)
    },

    set(target, p, value, receiver) {
      if (p in target) {
        return Reflect.set(target, p, value, receiver)
      }

      target.set(p as string, value)

      return true
    },
  }) as DataIndexMapClass<INITIAL> & { [K in keyof INITIAL]: DataIndexMapInitial[string] } & { [K in string]: DataIndexMapInitial[string] }
}

export type DataIndexMap<INITIAL extends DataIndexMapInitial> = DataIndexMapClass<INITIAL> & { [K in keyof INITIAL]: DataIndexMapInitial[string] } & { [K in string]: DataIndexMapInitial[string] }

export function DataArray<INITIAL extends DataArrayInitial>(
  pack: SandstonePack,
  initialize: INITIAL,
  dataPoint?: DataPointClass<'storage'>,
) {
  const array = new DataArrayClass(pack, initialize, dataPoint)

  return new Proxy(array, {
    get(target, p, receiver) {
      if (typeof p === 'string' && p in target) {
        return Reflect.get(target, p, receiver)
      }

      return target.get(Number(p))
    },

    set(target, p, value, receiver) {
      if (typeof p === 'string' && p in target) {
        return Reflect.set(target, p, value, receiver)
      }

      target.set(Number(p), value)

      return true
    },
  }) as DataArrayClass<INITIAL> & { [K in keyof INITIAL]: DataArrayInitial[number] } & { [K in number]: DataArrayInitial[number] }
}

export type DataArray<INITIAL extends DataArrayInitial> = DataArrayClass<INITIAL> & { [K in keyof INITIAL]: DataArrayInitial[number] } & { [K in number]: DataArrayInitial[number] }
