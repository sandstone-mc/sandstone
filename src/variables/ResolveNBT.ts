/* eslint-disable max-len */
import * as util from 'util'
import type { NBTObject } from '../arguments/nbt'
import { DataPointPickClass, type MacroArgument } from '../core/Macro'
import { ContainerCommandNode } from '../core/nodes'
import type { SandstonePack } from '../pack'
import { capitalize } from '../utils'
import type { DataPointClass } from './Data'
import { StringDataPointClass } from './Data'
import type { NBTAllArrays, NBTAllNumbers, NBTAllValues, NBTString } from './nbt'
import { NBTAnyValue, NBTClass, NBTInt, NBTIntArray, NBTPrimitive } from './nbt'
import { Score } from './Score'

/**
 * Single AST node that wraps every command produced by `ResolveNBT`.
 *
 * While `_resolveNBT` runs we push this node onto the current MCFunction's
 * `contextStack` (via `enterContext(this, addNode=true)`), so the
 * `data modify` / `execute store` commands it emits commit into our body
 * instead of escaping into the caller's MCFunction body. After the resolve
 * we `exitContext()` and the node — already added to the parent context's
 * body — serializes as one block of lines when `getValue()` runs.
 *
 * Modelled on `ExecuteCommandNode` / `FlowClauseNode`: a `ContainerCommandNode`
 * whose `command` field reflects the first command in its body.
 */
export class ResolveNBTNode extends ContainerCommandNode {
  dataPoint: DataPointClass<'storage'>

  /**
   * The NBT object the resolve was called with. Visitors that need to
   * correlate a `ResolveNBTNode` against an outer scope (e.g. matching
   * the resolved env vars against a `_.with(env, ...)`'s env list) read
   * this rather than descending into the command body.
   */
  nbt: NBTObject

  constructor(sandstonePack: SandstonePack, dataPoint: DataPointClass<'storage'>, nbt: NBTObject) {
    super(sandstonePack)
    this.dataPoint = dataPoint
    this.nbt = nbt
  }

  /**
   * `command` is whatever the first command in the body serializes to.
   * Lets visitors / loggers inspect the leading command without walking
   * the body.
   */
  get command(): string {
    const first = this._body[0]
    if (!first) return ''
    const value = first.getValue()
    return typeof value === 'string' ? value : ''
  }

  getValue = () => {
    this.sandstoneCore.currentNode = 'ResolveNBTNode'

    const serialized = this._body
      .map((n) => n.getValue())
      .filter((v) => v !== null && v !== undefined && v !== '')

    return serialized.length === 0 ? '' : serialized.join('\n')
  }

  [util.inspect.custom](_depth: number, _options: any) {
    return `${this.constructor.name}(dataPoint=${this.dataPoint.currentTarget} ${this.dataPoint.path})`
  }
}

export class ResolveNBTClass extends DataPointPickClass {
  dataPoint: NonNullable<DataPointClass<'storage'>>

  /**
   * Skip emitting the leading `data modify ... set value {}` / `set value []`
   * reset. Always true when ResolveNBT created its own internal dataPoint
   * (the temp storage is known empty). Callers passing an existing dataPoint
   * may opt in by passing `true` to suppress the reset.
   */
  skipReset: boolean

  constructor(
    private pack: SandstonePack,
    nbt: any,
    dataPoint?: DataPointClass<'storage'>,
    skipReset?: boolean,
  ) {
    super(pack.core)
    if (dataPoint) {
      this.dataPoint = dataPoint
      this.skipReset = skipReset ?? false
    } else {
      this.dataPoint = this.pack.DataVariable()
      // Auto-skip when ResolveNBT owns the temp storage (known empty).
      // Explicit `skipReset: false` forces the reset even with our own dataPoint.
      this.skipReset = skipReset ?? true
    }

    // Single AST node collecting every command the resolve would emit.
    const node = new ResolveNBTNode(pack, this.dataPoint, nbt)

    // Make our node the active context of the current MCFunction so command
    // commits during the resolve land in `node.body`. `enterContext(..., true)`
    // also appends the node to the previous current context's body, which
    // is where we ultimately want it to live.
    const realMCFunction = pack.core.getCurrentMCFunctionOrThrow()
    realMCFunction.enterContext(node, true)
    try {
      const out = this._resolveNBT(nbt)

      if (out !== undefined && Object.keys(out).length !== 0) {
        pack.commands.data.modify
          .storage(this.dataPoint.currentTarget, this.dataPoint.path)
          .merge.value(out)
      }
    } finally {
      realMCFunction.exitContext()
    }
  }

  /**
   * @internal
   */
  _resolveNBT(nbt: NBTObject, path?: string, index?: number): NBTObject {
    let resolvedNBT: NBTObject = {}

    if (typeof nbt !== 'object' || nbt === null || typeof nbt === 'function') {
      // Primitive values (string, number, boolean) pass through to the
      // outer merge step which writes them as literal NBT.
      return nbt
    }
    if (Array.isArray(nbt)) {
      resolvedNBT = []

      if (!this.skipReset) this.dataPoint.set([])

      if (nbt.length !== 0) {
        for (const [i, value] of nbt.entries()) {
          const childPath = path === undefined ? `[${i}]` : `${path}[${i}]`
          const resolved = this._resolveNBT(value, childPath, i)

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
      // Serialize the primitive (NBT.byte(1) → "1b") for the outer merge.
      return nbt
    }
    if (!this.skipReset) this.dataPoint.set({})

    for (const [key, value] of Object.entries(nbt)) {
      const childPath = path === undefined ? key : `${path}.${key}`
      const resolved = this._resolveNBT(value, childPath)
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

export class ResolveNBTPartClass<
  ValueType extends 'data' | 'score' | 'scores',
  Primitive extends NBTAllValues,
> extends NBTClass {
  value

  type: ValueType

  primitive: Primitive

  scale?: number

  constructor(
    value: StringDataPointClass | MacroArgument | DataPointClass | Score | Score[],
    type: ValueType,
    primitive: Primitive,
    scale?: number,
  ) {
    super()

    this.value = value

    this.type = type

    this.primitive = primitive

    if (type.indexOf('score') !== -1) {
      this.scale = scale
    }
  }

  public get mock() {
    return this as unknown as InstanceType<Exclude<Primitive, NBTAnyValue>>
  }

  [util.inspect.custom] = () => 'Unresolved NBT! Make sure to run ResolveNBT on the nbt before use.'
}

export function ResolveNBTPart(data: StringDataPointClass): ResolveNBTPartClass<'data', typeof NBTString>

export function ResolveNBTPart(data: MacroArgument): ResolveNBTPartClass<'data', NBTAllValues>

export function ResolveNBTPart(data: DataPointClass<any>, type: NBTAllValues): ResolveNBTPartClass<'data', NBTAllValues>

export function ResolveNBTPart<T extends NBTAllNumbers>(
  score: Score,
  scale?: number,
  type?: T,
): ResolveNBTPartClass<'score', T>

export function ResolveNBTPart<T extends NBTAllArrays>(
  scores: Score[],
  scale?: number,
  type?: T,
): ResolveNBTPartClass<'scores', T>

export function ResolveNBTPart<ValueType extends 'data' | 'score' | 'scores', Primitive extends NBTAllValues>(
  value: StringDataPointClass | MacroArgument | DataPointClass<any> | Score | Score[],
  option1?: number | Primitive,
  option2?: Primitive,
) {
  if (Array.isArray(value)) {
    return new ResolveNBTPartClass<ValueType, Primitive>(
      value,
      'scores' as ValueType,
      (option2 || NBTIntArray) as Primitive,
      (option1 || 1) as number,
    )
  }
  if (value instanceof Score) {
    return new ResolveNBTPartClass<ValueType, Primitive>(
      value,
      'score' as ValueType,
      (option2 || NBTInt) as Primitive,
      (option1 || 1) as number,
    )
  }

  return new ResolveNBTPartClass<ValueType, Primitive>(
    value,
    'data' as ValueType,
    (option1 || NBTAnyValue) as Primitive,
  )
}
