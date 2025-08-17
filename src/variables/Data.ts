import type { Coordinates, JSONTextComponent, NBTObject, SingleEntityArgument } from 'sandstone/arguments'
import type { DataModifyTypeCommand, DataModifyValuesCommand, StoreType } from 'sandstone/commands/implementations'
import { ConditionNode } from 'sandstone/flow/index.js'
import type { SandstonePack } from 'sandstone/pack'
import { DataPointPickClass, isMacroArgument, MacroArgument, MacroLiteral } from '../core/Macro.js'
import type { ConditionClass, ConditionTextComponentClass } from './abstractClasses.js'
import { nbtStringifier } from './nbt/NBTs.js'
import { Score } from './Score.js'

export type DATA_TYPES = 'entity' | 'block' | 'storage'

export type DATA_TARGET = {
  entity: SingleEntityArgument<false>
  block: Coordinates<false>
  storage: string
}

export type DATA_PATH = string | MacroArgument | Record<string, NBTObject> | NBTObject[]

export function NBTpathToString(pack: SandstonePack, paths: DATA_PATH[]) {
  const parsedPaths: string[] = []

  // Awful hack
  /* @ts-ignore */
  const parsedMacros: MacroArgument[] = [undefined]

  let hasMacro = false

  for (const [i, path] of paths.entries()) {
    if (typeof path === 'object') {
      if (isMacroArgument(pack.core, path)) {
        hasMacro = true

        if (Object.hasOwn(path, 'macros')) {
          const { strings, macros } = path as MacroLiteral
          for (const [j, macro] of macros.entries()) {
            parsedPaths.push(strings[j])
            if (typeof macro === 'string' || typeof macro === 'number') {
              parsedPaths.push(`${macro}`)
            } else {
              parsedMacros.push(macro)
            }
          }
          const last = strings[strings.length - 1]
          if (last !== '') parsedPaths.push(`${last}.`)
        } else {
          parsedMacros.push(path as MacroArgument)
        }
      } else {
        parsedPaths.push(nbtStringifier(path))
      }
    } else if (path !== '') {
      parsedPaths.push(`${path}${i === paths.length - 1 ? '' : '.'}`)
    }
  }

  if (hasMacro) {
    /*
     * I don't actually use the special properties of TemplateStringsArray, so I can just force cast it
     *
     * Also, since Macro.<command> is just a type-hack, I can just force cast this to string
     */
    return new MacroLiteral(
      pack.core,
      parsedPaths as unknown as TemplateStringsArray,
      parsedMacros,
    ) as unknown as string
  }
  return parsedPaths.join('')
}

export class TargetlessDataClass<TYPE extends DATA_TYPES = DATA_TYPES> {
  constructor(
    protected sandstonePack: SandstonePack,
    public type: TYPE,
  ) {}

  target = (target: DATA_TARGET[TYPE]) => new DataClass(this.sandstonePack, this.type, target)

  select = (...path: DATA_PATH[]) => new TargetlessDataPointClass(this.sandstonePack, this.type, path)
}

export class TargetlessDataPointClass<TYPE extends DATA_TYPES = DATA_TYPES> {
  path

  constructor(
    protected sandstonePack: SandstonePack,
    public type: TYPE,
    path: DATA_PATH[],
  ) {
    this.path = NBTpathToString(sandstonePack, path)
  }

  target = (target: DATA_TARGET[TYPE]) => new DataPointClass(this.sandstonePack, this.type, target, [this.path])

  select = (...path: DATA_PATH[]) => new TargetlessDataPointClass(this.sandstonePack, this.type, [this.path, ...path])
}

export class DataClass<TYPE extends DATA_TYPES = any> {
  currentTarget

  constructor(
    protected sandstonePack: SandstonePack,
    public type: TYPE,
    target: DATA_TARGET[TYPE],
  ) {
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

  toString = () => this.currentTarget.toString()

  toJSON = this.toString
}

export class DataPointClass<TYPE extends DATA_TYPES = any>
  extends MacroArgument
  implements ConditionTextComponentClass
{
  path

  currentTarget: DATA_TARGET[TYPE]

  constructor(
    public sandstonePack: SandstonePack,
    public type: TYPE,
    target: DATA_TARGET[TYPE],
    path: DATA_PATH[],
  ) {
    super(sandstonePack.core)
    this.path = NBTpathToString(sandstonePack, path)
    this.currentTarget = target

    if (this.type === 'storage' && (target as string).indexOf(':') === -1) {
      this.currentTarget = `${this.sandstonePack.core.pack.defaultNamespace}:${target}` as DATA_TARGET[TYPE]
    }
  }

  target = (target: DATA_TARGET[TYPE]) => new DataPointClass(this.sandstonePack, this.type, target, [this.path])

  select = (...path: DATA_PATH[]) =>
    new DataPointClass(this.sandstonePack, this.type, this.currentTarget, [this.path, ...path])

  protected modify = (
    cb: (data: DataModifyTypeCommand<false>) => DataModifyValuesCommand<false>,
    value: NBTObject | DataPointClass | DataPointPickClass,
  ) => {
    const data = cb(this.sandstonePack.commands.data.modify[this.type](this.currentTarget as any, this.path))

    // The value is another Data Point
    if (value instanceof DataPointClass) {
      data.from[value.type as DATA_TYPES](value.currentTarget as any, value.path)
      return this
    }

    if (value instanceof DataPointPickClass) {
      this.set(value._toDataPoint() as any)
      return this
    }

    // The value is a NBT
    data.value(value)
    return this
  }

  protected string = (
    cb: (data: DataModifyTypeCommand<false>) => DataModifyValuesCommand<false>,
    value: DataPointClass,
    start: number,
    end?: number,
  ) => {
    const data = cb(this.sandstonePack.commands.data.modify[this.type](this.currentTarget as any, this.path))

    if (!end) data.string[value.type as DATA_TYPES](value.currentTarget as any, value.path, start)
    else if (start === 0) {
      data.from[value.type as DATA_TYPES](value.currentTarget as any, value.path)
    } else {
      data.string[value.type as DATA_TYPES](value.currentTarget as any, value.path, start, end)
    }
  }

  protected executeStore = (storeType: StoreType, scale: number) =>
    this.sandstonePack.commands.execute.store.result[this.type](
      this.currentTarget as any,
      this.path,
      storeType as StoreType,
      scale,
    )

  set: /**
   * Set the data point to the given NBT.
   */
  ((value: NBTObject | DataPointClass) => DataPointClass) &
    /**
     * Set the data point to the given Data Point Pick
     */
    ((value: DataPointPickClass) => DataPointClass) &
    /**
     * Set the data point to the given score, with a given type and a scale.
     */
    ((value: Score, storeType?: StoreType, scale?: number) => DataPointClass) &
    /**
     * Set the data point to the given NBT string.
     */
    ((value: StringDataPointClass) => DataPointClass) = (
    value: NBTObject | DataPointClass | DataPointPickClass | Score,
    storeType?: StoreType,
    scale: number = 1,
  ) => {
    if (value instanceof StringDataPointClass) {
      if (value.sliceBounds[1]) this.string((data) => data.set, value, value.sliceBounds[0], value.sliceBounds[1])
      else this.string((data) => data.set, value, value.sliceBounds[0])
      return this
    }
    if (value instanceof Score) {
      this.executeStore(storeType || 'int', scale).run.scoreboard.players.get(value.target, value.objective)
      return this
    }

    this.modify((data) => data.set, value)
    return this
  }

  /**
   * Set the data point to the given NBT.
   */
  merge = (value: NBTObject | DataPointClass | DataPointPickClass) => this.modify((data) => data.merge, value)

  /**
   * Append the given NBT to the current data point.
   */
  append = (value: NBTObject | DataPointClass | DataPointPickClass) => this.modify((data) => data.append, value)

  /**
   * Prepend the given NBT to the current data point.
   */
  prepend = (value: NBTObject | DataPointClass | DataPointPickClass) => this.modify((data) => data.prepend, value)

  /**
   * Insert the given NBT to the given index of the current data point.
   */
  insert = (value: NBTObject | DataPointClass | DataPointPickClass, index: number) =>
    this.modify((data) => data.insert(index), value)

  /**
   * Remove the current NBT value.
   */
  remove = () => this.sandstonePack.commands.data.remove[this.type](this.currentTarget as any, this.path)

  /**
   * Extracts a section of a string available for setting to another path, without modifying the original path.
   *
   * Use slice(0) to get a type-safe string data point; it compiles to a regular `from` argument.
   *
   * @param start Index of first character to include at the start of the string.
   * @param end Optional. Index of the first character to exclude at the end of the string.
   */
  slice = (start: number, end?: number) =>
    new StringDataPointClass(this.sandstonePack, this.type, this.currentTarget, this.path, start, end)

  _toMinecraftCondition = () => new this.sandstonePack.conditions.DataPointExists(this.sandstonePack.core, this)

  equals = (value: NBTObject | Score | DataPointClass | DataPointPickClass) =>
    new this.sandstonePack.conditions.DataPointEquals(this.sandstonePack.core, this, value)

  /**
   * @internal
   */
  _toChatComponent = () =>
    ({
      nbt: this.path,
      [this.type]: this.currentTarget,
    }) as unknown as JSONTextComponent
}

export class StringDataPointClass<TYPE extends DATA_TYPES = any> extends DataPointClass {
  readonly sliceBounds: [number] | [number, number]

  constructor(
    public sandstonePack: SandstonePack,
    public type: TYPE,
    target: DATA_TARGET[TYPE],
    path: DATA_PATH,
    start: number,
    end?: number,
  ) {
    super(sandstonePack, type, target, [path])

    this.sliceBounds = [start]
    if (end) this.sliceBounds.push(end)
  }
}
