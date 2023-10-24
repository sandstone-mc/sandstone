/* eslint-disable max-len */
import * as util from 'util'

import { capitalize } from '../utils.js'
import { DataPointPickClass } from './abstractClasses.js'
import { StringDataPointClass } from './Data.js'
import {
  NBTAnyValue,
  NBTClass, NBTInt, NBTIntArray, NBTPrimitive,
} from './nbt/index.js'
import { Score } from './Score.js'

import type { NBTObject } from '../arguments/nbt.js'
import type { SandstonePack } from '../pack/index.js'
import type { DataPointClass } from './Data.js'
import type {
  NBTAllArrays, NBTAllNumbers,
  NBTAllValues, NBTString,
} from './nbt/index.js'

export class ResolveNBTClass extends DataPointPickClass {
  dataPoint: NonNullable<DataPointClass<'storage'>>

  constructor(private pack: SandstonePack, nbt: NBTObject, dataPoint?: DataPointClass<'storage'>) {
    super(pack.core)
    if (dataPoint) {
      this.dataPoint = dataPoint
    } else {
      this.dataPoint = this.pack.Data('storage', '__sandstone:temp', 'Resolve')
    }

    const out = this._resolveNBT(nbt)

    if (Object.keys(out).length !== 0) {
      pack.commands.data.modify.storage(this.dataPoint.currentTarget, this.dataPoint.path).merge.value(this._resolveNBT(nbt))
    }
  }

  /**
   * @internal
   */
  _resolveNBT(nbt: NBTObject, path?: string, index?: number): NBTObject {
    let resolvedNBT: NBTObject = {}

    if (typeof nbt !== 'object') {
      throw new Error(`ResolveNBT expected an object or array, received ${typeof nbt}!`)
    }
    if (Array.isArray(nbt)) {
      resolvedNBT = []

      this.dataPoint.set([])

      if (resolvedNBT.length !== 0) {
        for (const [i, value] of nbt.entries()) {
          const resolved = this._resolveNBT(value, `${path === undefined ? '' : path}`, i)

          if (resolved !== undefined) {
            resolvedNBT.push(resolved)
          }
        }
      }

      return resolvedNBT
    }
    if (nbt instanceof ResolveNBTPartClass) {
      /* @ts-ignore */
      return this[`_resolve${capitalize(nbt.type)}`](nbt, path, index)
    }
    if (nbt instanceof NBTPrimitive) {
      return resolvedNBT
    }
    this.dataPoint.set({})

    for (const [key, value] of Object.entries(nbt)) {
      const resolved = this._resolveNBT(value, `${path === undefined ? '' : `${path}.`}${key}`)
      if (resolved !== undefined) {
        resolvedNBT[key] = resolved
      }
    }
    return resolvedNBT
  }

  /**
   * @internal
   */
  _resolveData(part: ResolveNBTPartClass<'data', NBTAllValues>, path: string, index?: number) {
    const { value } = part
    const dataPoint = this.dataPoint.select(path)

    if (index) {
      let _value = value
      if (value instanceof StringDataPointClass) {
        _value = this.pack.DataVariable(value)
      }
      dataPoint.insert(_value as DataPointClass, index)
      return undefined
    }
    if (value instanceof StringDataPointClass) {
      dataPoint.set(value)
      return undefined
    }
    dataPoint.set(value as DataPointClass)
    return undefined
  }

  /**
   * @internal
   */
  _resolveScore(value: ResolveNBTPartClass<'score', NBTAllNumbers>, path: string, index?: number) {
    const dataPoint = this.dataPoint.select(path)

    // Yes this is cursed
    const args = [value.value, value.primitive.toString().split(' ')[1].slice(3).toLowerCase(), value.scale]

    if (index) {
      const temp = this.pack.getTempStorage('Score')
      /* @ts-ignore */
      temp.set(...args)
      dataPoint.insert(temp, index)
    }
    /* @ts-ignore */
    dataPoint.set(...args)
    return undefined
  }

  /**
   * @internal
   */
  _resolveScores(value: ResolveNBTPartClass<'scores', NBTAllArrays>, path: string, index?: number) {
    const temp = this.pack.getTempStorage('Score')

    const args = [value.primitive.constructor.name.slice(3).slice(0, -5).toLowerCase(), value.scale]

    const dataPoint = this.dataPoint.select(path)

    if (index) {
      /* @ts-ignore */
      // eslint-disable-next-line new-cap
      dataPoint.insert(new value.primitive([]), index)

      const _dataPoint = dataPoint.select([index])

      for (const score of value as unknown as Score[]) {
        /* @ts-ignore */
        temp.set(score, ...args)
        _dataPoint.append(temp)
      }
    }
    /* @ts-ignore */
    // eslint-disable-next-line new-cap
    dataPoint.set(new value.primitive([]))

    for (const score of value as unknown as Score[]) {
      /* @ts-ignore */
      temp.set(score, ...args)
      dataPoint.append(temp)
    }
  }

  /**
   * @internal
   */
  _toDataPoint() {
    return this.dataPoint
  }
}

export class ResolveNBTPartClass<ValueType extends 'data' | 'score' | 'scores', Primitive extends NBTAllValues> extends NBTClass {
  value

  type: ValueType

  primitive: Primitive

  scale?: number

  constructor(value: StringDataPointClass | DataPointClass | Score | Score[], type: ValueType, primitive: Primitive, scale?: number) {
    super()

    this.value = value

    this.type = type

    this.primitive = primitive

    if (type.indexOf('score') !== -1) {
      this.scale = scale
    }
  }

  [util.inspect.custom] = () => 'Unresolved NBT! Make sure to run ResolveNBT on the nbt before use.'
}

export function ResolveNBTPart(data: StringDataPointClass): ResolveNBTPartClass<'data', typeof NBTString>

export function ResolveNBTPart(data: DataPointClass<any>, type: NBTAllValues): ResolveNBTPartClass<'data', NBTAllValues>

export function ResolveNBTPart(score: Score, scale?: number, type?: NBTAllNumbers): ResolveNBTPartClass<'score', typeof NBTInt | NBTAllNumbers>

export function ResolveNBTPart(scores: Score[], scale?: number, type?: NBTAllArrays): ResolveNBTPartClass<'scores', typeof NBTIntArray | NBTAllArrays>

export function ResolveNBTPart<ValueType extends 'data' | 'score' | 'scores', Primitive extends NBTAllValues>(value: StringDataPointClass | DataPointClass<any> | Score | Score[], option1?: number | Primitive, option2?: Primitive) {
  if (Array.isArray(value)) {
    return new ResolveNBTPartClass<ValueType, Primitive>(value, 'scores' as ValueType, (option2 || NBTIntArray) as Primitive, (option1 || 1) as number)
  }
  if (value instanceof Score) {
    return new ResolveNBTPartClass<ValueType, Primitive>(value, 'score' as ValueType, (option2 || NBTInt) as Primitive, (option1 || 1) as number)
  }

  return new ResolveNBTPartClass<ValueType, Primitive>(value, 'data' as ValueType, (option1 || NBTAnyValue) as Primitive)
}
