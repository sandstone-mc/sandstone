import { ConditionTextComponentClass } from './abstractClasses'
import { nbtStringifier } from './nbt/NBTs'
import { Score } from './Score'

import type {
  Coordinates, JSONTextComponent, NBTObject, SingleEntityArgument,
} from '@arguments'
import type {
  DataModify, DataModifyType, DataModifyValues, StoreType,
} from '@commands/implementations'
import type { Datapack } from '@datapack'

export type DATA_TYPES = 'entity' | 'block' | 'storage'

export type DATA_TARGET = {
  'entity': SingleEntityArgument,
  'block': Coordinates,
  'storage': string,
}

export type DATA_SOURCES = 'default' | 'string'

type DATA_PATH = string | Record<string, NBTObject> | NBTObject[]

function pathToString(path: DATA_PATH[]) {
  let result = ''
  for (const p of path) {
    if (typeof p === 'string') {
      if (result.length > 0) {
        result += '.'
      }
      result += p
    } else {
      result += nbtStringifier(p)
    }
  }

  return result
}

export class TargetlessDataInstance<TYPE extends DATA_TYPES = DATA_TYPES, SOURCE extends DATA_SOURCES = DATA_SOURCES> {
  protected datapack

  type: TYPE

  source: SOURCE

  constructor(datapack: Datapack, type: TYPE, source: SOURCE) {
    this.datapack = datapack
    this.type = type
    this.source = source
  }

  target = (target: DATA_TARGET[TYPE]) => new DataInstance(this.datapack, this.type, this.source, target)

  select = (...path: DATA_PATH[]) => new TargetlessDataPointInstance(this.datapack, this.type, this.source, path)
}

export class TargetlessDataPointInstance<TYPE extends DATA_TYPES = DATA_TYPES, SOURCE extends DATA_SOURCES = DATA_SOURCES> {
  protected datapack

  type: TYPE

  source: SOURCE

  path

  constructor(datapack: Datapack, type: TYPE, source: SOURCE, path: DATA_PATH[]) {
    this.datapack = datapack
    this.type = type
    this.source = source
    this.path = pathToString(path)
  }

  target = (target: DATA_TARGET[TYPE]) => new DataPointInstance(this.datapack, this.type, this.source, target, [this.path])

  select = (...path: DATA_PATH[]) => new TargetlessDataPointInstance(this.datapack, this.type, this.source, [this.path, ...path])
}

export class DataInstance<TYPE extends DATA_TYPES = DATA_TYPES, SOURCE extends DATA_SOURCES = DATA_SOURCES> {
  datapack

  type: TYPE

  source: SOURCE

  currentTarget: DATA_TARGET[TYPE]

  constructor(datapack: Datapack, type: TYPE, source: SOURCE, target: DATA_TARGET[TYPE]) {
    this.datapack = datapack
    this.type = type
    this.source = source
    this.currentTarget = target
  }

  /**
   * Merge the given NBT to the current target.
   */
  merge = (value: NBTObject) => {
    this.datapack.commandsRoot.data.merge[this.type](this.currentTarget as any, value)
  }

  target = (target: DATA_TARGET[TYPE]) => new DataInstance(this.datapack, this.type, this.source, target)

  select = (...path: DATA_PATH[]) => new DataPointInstance(this.datapack, this.type, this.source, this.currentTarget, path)

  toString = () => this.currentTarget

  toJSON = this.toString
}

type sliceType = {
  /**
   * Optional. Index of first character to include at the start of the string.
   */
  start?: number,
  /**
   * Optional. Index of the first character to exclude at the end of the string.
   */
  end?: number
}

type scaleType = {type: StoreType, scale?: number}

export class DataPointInstance<TYPE extends DATA_TYPES = any, SOURCE extends DATA_SOURCES = any> extends ConditionTextComponentClass {
  datapack

  type: TYPE

  source: SOURCE

  path

  currentTarget: DATA_TARGET[TYPE]

  constructor(datapack: Datapack, type: TYPE, source: SOURCE, target: DATA_TARGET[TYPE], path: DATA_PATH[]) {
    super()
    this.datapack = datapack
    this.type = type
    this.source = source
    this.path = pathToString(path)

    this.currentTarget = target
  }

  target = (target: DATA_TARGET[TYPE]) => new DataPointInstance(this.datapack, this.type, this.source, target, [this.path])

  select = (...path: DATA_PATH[]) => new DataPointInstance(this.datapack, this.type, this.source, this.currentTarget, [this.path, ...path])

  protected modify = (cb: (data: DataModifyType) => DataModifyValues, value: NBTObject | DataPointInstance, sliceString?: [number] | [number, number]) => {
    if (this.source === 'default') {
      const data = cb(this.datapack.commandsRoot.data.modify[this.type](this.currentTarget as any, this.path))

      // The value is another Data Point
      if (value instanceof DataPointInstance) {
        data.from[value.type as DATA_TYPES](value.currentTarget as any, value.path)
        return
      }

      // The value is a NBT
      data.value(value)
    } else {
      const data = cb(this.datapack.commandsRoot.data.modify[this.type](this.currentTarget as any, this.path))

      // The value is another Data Point
      if (value instanceof DataPointInstance) {
        if (sliceString) {
          data.fromString[value.type as DATA_TYPES](value.currentTarget as any, value.path, ...sliceString)
          return
        }

        data.fromString[value.type as DATA_TYPES](value.currentTarget as any, value.path)
        return
      }

      // The value is a NBT
      data.value(value)
    }
  }

  protected executeStore = (storeType: StoreType, scale: number) => this.datapack.commandsRoot.execute.store.result[this.type](this.currentTarget as any, this.path, storeType as StoreType, scale)

  /**
   * Set the data point to the given NBT.
   */
  set(value: NBTObject): void

  /**
   * Set the data point to the given data point.
   * @param value A non-string data point.
   */
  set(value: DataPointInstance<DATA_TYPES, 'default'>): void

  /**
   * Set the data point to the given data point string.
   * @param value A string data point.
   * @param slice Optional. Where to slice the string.
   */
  set(value: DataPointInstance<DATA_TYPES, 'string'>, slice?: sliceType): void

  /**
   * Set the data point to the given score, with a given type & scale.
   * @param value A score.
   * @param typeAndScale Number type & scale that will default to 1.
   */
  set(value: Score, typeAndScale: scaleType): void

  set(value: NBTObject | DataPointInstance<DATA_TYPES, 'default'> | DataPointInstance<DATA_TYPES, 'string'> | Score, sliceOrScale?: sliceType | scaleType): void {
    if (value instanceof Score && sliceOrScale) {
      this.executeStore((sliceOrScale as scaleType).type, (sliceOrScale as scaleType).scale || 1).run.scoreboard.players.get(value.target, value.objective)
    } else if (sliceOrScale === undefined) {
      this.modify((data) => data.set, value as DataPointInstance)
    } else {
      this.modify(
        (data) => data.set,
        value as DataPointInstance,
        (sliceOrScale as sliceType).end ? [(sliceOrScale as sliceType).start as number || 0, (sliceOrScale as sliceType).end as number] : [(sliceOrScale as sliceType).start as number],
      )
    }
  }

  /**
   * Set the data point to the given NBT.
   */
  merge = (value: NBTObject | DataPointInstance) => this.modify((data) => data.merge, value)

  /**
   * Append the given NBT to the current data point.
   */
  append = (value: NBTObject | DataPointInstance) => this.modify((data) => data.append, value)

  /**
   * Prepend the given NBT to the current data point.
   */
  prepend = (value: NBTObject | DataPointInstance) => this.modify((data) => data.prepend, value)

  /**
   * Insert the given NBT to the given index of the current data point.
   */
  insert = (value: NBTObject | DataPointInstance, index: number) => this.modify((data) => data.insert(index), value)

  /**
   * Remove the current NBT value.
   */
  remove = () => this.datapack.commandsRoot.data.remove[this.type](this.currentTarget as any, this.path)

  _toMinecraftCondition = () => ({
    value: ['if', 'data', this.type, this.currentTarget, this.path],
  })

  protected _toChatComponent = () => ({
    nbt: this.path,
    [this.type]: this.currentTarget,
  }) as unknown as JSONTextComponent
}
