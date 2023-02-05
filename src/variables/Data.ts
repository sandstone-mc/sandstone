import { ConditionTextComponentClass } from './abstractClasses'
import { nbtStringifier } from './nbt/NBTs'
import { Score } from './Score'

import type {
  Coordinates, JSONTextComponent, NBTObject, SingleEntityArgument,
} from '#arguments'
import type { DataModifyTypeCommand, DataModifyValuesCommand, StoreType } from '#commands/implementations'
import type { SandstonePack } from '#pack'

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
      result += nbtStringifier(p)
    }
  }

  return result
}

export class TargetlessDataClass<TYPE extends DATA_TYPES = DATA_TYPES> {
  constructor(protected sandstonePack: SandstonePack, public type: TYPE) {}

  target = (target: DATA_TARGET[TYPE]) => new DataClass(this.sandstonePack, this.type, target)

  select = (...path: DATA_PATH[]) => new TargetlessDataPointClass(this.sandstonePack, this.type, path)
}

export class TargetlessDataPointClass<TYPE extends DATA_TYPES = DATA_TYPES> {
  path

  constructor(protected sandstonePack: SandstonePack, public type: TYPE, path: DATA_PATH[]) {
    this.path = pathToString(path)
  }

  target = (target: DATA_TARGET[TYPE]) => new DataPointClass(this.sandstonePack, this.type, target, [this.path])

  select = (...path: DATA_PATH[]) => new TargetlessDataPointClass(this.sandstonePack, this.type, [this.path, ...path])
}

export class DataClass<TYPE extends DATA_TYPES = DATA_TYPES> {
  currentTarget

  constructor(protected sandstonePack: SandstonePack, public type: TYPE, target: DATA_TARGET[TYPE]) {
    this.currentTarget = target
  }

  /**
   * Merge the given NBT to the current target.
   */
  merge = (value: NBTObject) => {
    this.sandstonePack.commands.data.merge[this.type](this.currentTarget as any, value)
  }

  target = (target: DATA_TARGET[TYPE]) => new DataClass(this.sandstonePack, this.type, target)

  select = (...path: DATA_PATH[]) => new DataPointClass(this.sandstonePack, this.type, this.currentTarget, path)

  toString = () => this.currentTarget

  toJSON = this.toString
}

export class DataPointClass<TYPE extends DATA_TYPES = any> extends ConditionTextComponentClass {
  path

  currentTarget: DATA_TARGET[TYPE]

  constructor(public sandstonePack: SandstonePack, public type: TYPE, target: DATA_TARGET[TYPE], path: DATA_PATH[]) {
    super()
    this.path = pathToString(path)
    this.currentTarget = target
  }

  target = (target: DATA_TARGET[TYPE]) => new DataPointClass(this.sandstonePack, this.type, target, [this.path])

  select = (...path: DATA_PATH[]) => new DataPointClass(this.sandstonePack, this.type, this.currentTarget, [this.path, ...path])

  protected modify = (cb: (data: DataModifyTypeCommand) => DataModifyValuesCommand, value: NBTObject | DataPointClass) => {
    const data = cb(this.sandstonePack.commands.data.modify[this.type](this.currentTarget as any, this.path))

    // The value is another Data Point
    if (value instanceof DataPointClass) {
      data.from[value.type as DATA_TYPES](value.currentTarget as any, value.path)
      return
    }

    // The value is a NBT
    data.value(value)
  }

  protected string = (cb: (data: DataModifyTypeCommand) => DataModifyValuesCommand, value: DataPointClass, start: number, end?: number) => {
    const data = cb(this.sandstonePack.commands.data.modify[this.type](this.currentTarget as any, this.path))

    if (!end) data.string[value.type as DATA_TYPES](value.currentTarget as any, value.path, start)
    else data.string[value.type as DATA_TYPES](value.currentTarget as any, value.path, start, end)
  }

  protected executeStore = (storeType: StoreType, scale: number) => this.sandstonePack.commands.execute.store.result[this.type](this.currentTarget as any, this.path, storeType as StoreType, scale)

  set: (
    /**
     * Set the data point to the given NBT.
     */
    ((value: NBTObject | DataPointClass) => void) &

    /**
     * Set the data point to the given score, with a given type and a scale.
     */
    ((value: Score, storeType: StoreType, scale?: number) => void) &

    /**
     * Set the data point to the given NBT string.
     */
    ((value: StringDataPointClass) => void)
  ) = (value: NBTObject | DataPointClass | Score, storeType?: StoreType, scale: number = 1) => {
      if (value instanceof StringDataPointClass) {
        if (value.sliceBounds[1]) this.string((data) => data.set, value, value.sliceBounds[0], value.sliceBounds[1])
        else this.string((data) => data.set, value, value.sliceBounds[0])
      }
      if (value instanceof Score) {
        this.executeStore(storeType as StoreType, scale).run.scoreboard.players.get(value.target, value.objective)
        return
      }

      this.modify((data) => data.set, value)
    }

  /**
   * Set the data point to the given NBT.
   */
  merge = (value: NBTObject | DataPointClass) => this.modify((data) => data.merge, value)

  /**
   * Append the given NBT to the current data point.
   */
  append = (value: NBTObject | DataPointClass) => this.modify((data) => data.append, value)

  /**
   * Prepend the given NBT to the current data point.
   */
  prepend = (value: NBTObject | DataPointClass) => this.modify((data) => data.prepend, value)

  /**
   * Insert the given NBT to the given index of the current data point.
   */
  insert = (value: NBTObject | DataPointClass, index: number) => this.modify((data) => data.insert(index), value)

  /**
   * Remove the current NBT value.
   */
  remove = () => this.sandstonePack.commands.data.remove[this.type](this.currentTarget as any, this.path)

  /**
   * Extracts a section of a string available for setting to another path, without modifying the original path.
   * @param start Index of first character to include at the start of the string.
   * @param end Optional. Index of the first character to exclude at the end of the string.
   */
  slice = (start: number, end?: number) => new StringDataPointClass(this.sandstonePack, this.type, this.currentTarget, this.path, start, end)

  _toMinecraftCondition = () => ({
    value: ['if', 'data', this.type, this.currentTarget, this.path],
  })

  protected _toChatComponent = () => ({
    nbt: this.path,
    [this.type]: this.currentTarget,
  }) as unknown as JSONTextComponent
}

class StringDataPointClass<TYPE extends DATA_TYPES = any> extends DataPointClass {
  readonly sliceBounds: [number] | [number, number]

  constructor(public sandstonePack: SandstonePack, public type: TYPE, target: DATA_TARGET[TYPE], path: DATA_PATH, start: number, end?: number) {
    super(sandstonePack, type, target, [path])

    this.sliceBounds = [start]
    if (end) this.sliceBounds.push(end)
  }
}
