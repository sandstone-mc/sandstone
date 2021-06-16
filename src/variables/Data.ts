import { ConditionTextComponentClass } from './abstractClasses'
import { nbtParser } from './NBTs'
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
      result += nbtParser(p)
    }
  }

  return result
}

export class TargetlessDataInstance<TYPE extends DATA_TYPES = DATA_TYPES> {
  protected datapack

  type

  constructor(datapack: Datapack, type: TYPE) {
    this.datapack = datapack
    this.type = type
  }

  target = (target: DATA_TARGET[TYPE]) => new DataInstance(this.datapack, this.type, target)

  select = (...path: DATA_PATH[]) => new TargetlessDataPointInstance(this.datapack, this.type, path)
}

export class TargetlessDataPointInstance<TYPE extends DATA_TYPES = DATA_TYPES> {
  protected datapack

  type

  path

  constructor(datapack: Datapack, type: TYPE, path: DATA_PATH[]) {
    this.datapack = datapack
    this.type = type
    this.path = pathToString(path)
  }

  target = (target: DATA_TARGET[TYPE]) => new DataPointInstance(this.datapack, this.type, target, [this.path])

  select = (...path: DATA_PATH[]) => new TargetlessDataPointInstance(this.datapack, this.type, [this.path, ...path])
}

export class DataInstance<TYPE extends DATA_TYPES = DATA_TYPES> {
  datapack

  type

  currentTarget

  constructor(datapack: Datapack, type: TYPE, target: DATA_TARGET[TYPE]) {
    this.datapack = datapack
    this.type = type
    this.currentTarget = target
  }

  /**
   * Merge the given NBT to the current target.
   */
  merge = (value: NBTObject) => {
    this.datapack.commandsRoot.data.merge[this.type](this.currentTarget as any, value)
  }

  target = (target: DATA_TARGET[TYPE]) => new DataInstance(this.datapack, this.type, target)

  select = (...path: DATA_PATH[]) => new DataPointInstance(this.datapack, this.type, this.currentTarget, path)
}

export class DataPointInstance<TYPE extends DATA_TYPES = DATA_TYPES> extends ConditionTextComponentClass {
  datapack

  type

  path

  currentTarget

  constructor(datapack: Datapack, type: TYPE, target: DATA_TARGET[TYPE], path: DATA_PATH[]) {
    super()
    this.datapack = datapack
    this.type = type
    this.path = pathToString(path)

    this.currentTarget = target
  }

  target = (target: DATA_TARGET[TYPE]) => new DataPointInstance(this.datapack, this.type, target, [this.path])

  select = (...path: DATA_PATH[]) => new DataPointInstance(this.datapack, this.type, this.currentTarget, [this.path, ...path])

  protected modify = (cb: (data: DataModifyType) => DataModifyValues, value: NBTObject | DataPointInstance) => {
    const data = cb(this.datapack.commandsRoot.data.modify[this.type](this.currentTarget as any, this.path))

    // The value is another Data Point
    if (value instanceof DataPointInstance) {
      data.from[value.type](value.currentTarget as any, value.path)
      return
    }

    // The value is a NBT
    data.value(value)
  }

  protected executeStore = (storeType: StoreType, scale: number) => this.datapack.commandsRoot.execute.store.result[this.type](this.currentTarget as any, this.path, storeType as StoreType, scale)

  /**
   * Get the value of the current data point
   */
  get = (scale?: number) => {
    this.datapack.commandsRoot.data.get[this.type](this.currentTarget as any, this.path, scale)
  }

  set: (
    /**
     * Set the data point to the given NBT.
     */
    ((value: NBTObject | DataPointInstance) => void) &

    /**
     * Set the data point to the given score, with a given type and a scale.
     */
    ((value: Score, storeType: StoreType, scale?: number) => void)
  ) = (value: NBTObject | DataPointInstance | Score, storeType?: StoreType, scale = 1) => {
    if (value instanceof Score) {
      this.executeStore(storeType as StoreType, scale).run.scoreboard.players.get(value.target, value.objective)
      return
    }

    this.modify((data) => data.set, value)
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
