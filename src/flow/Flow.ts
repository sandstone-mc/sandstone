import type {
  BLOCKS,
  Coordinates,
  JSONTextComponent,
  MultipleEntitiesArgument,
  MultiplePlayersArgument,
  NBTObject,
  WORLDGEN_BIOMES,
} from 'sandstone/arguments'
import type {
  ConditionClass,
  DataArray,
  DataArrayInitial,
  DataIndexMap,
  DataIndexMapInitial,
  DataPointClass,
  IterableDataClass,
  StringDataPointClass,
} from 'sandstone/variables'
import { parseJSONText, Score } from 'sandstone/variables'
import type { DataPointPickClass, MCFunctionClass, PredicateClass, SandstoneCore } from '../core/index.js'
import type { LiteralUnion } from '../utils.js'
import { AndNode, ConditionNode, NotNode, OrNode, SandstoneConditions } from './conditions/index.js'
import { IfStatement } from './if_else.js'
import type { ForOfIterator } from './loops/index.js'
import { binaryFor, ForIStatement, ForOfStatement, WhileStatement } from './loops/index.js'
import type { DefaultType } from './switch_case.js'
import { CaseStatement } from './switch_case.js'

let switches = 0

export type Condition = ConditionNode | ConditionClass
export class Flow {
  constructor(public sandstoneCore: SandstoneCore) {}

  conditionToNode(condition: Condition) {
    if (!(condition instanceof ConditionNode)) {
      return condition._toMinecraftCondition()
    }
    return condition
  }

  if = (condition: Condition, callback: () => void) =>
    new IfStatement(this.sandstoneCore, this.conditionToNode(condition), callback)

  and = (...conditions: Condition[]) =>
    new AndNode(
      this.sandstoneCore,
      conditions.map((condition) => this.conditionToNode(condition)),
    )

  or = (...conditions: Condition[]) =>
    new OrNode(
      this.sandstoneCore,
      conditions.map((condition) => this.conditionToNode(condition)),
    )

  not = (condition: Condition) => new NotNode(this.sandstoneCore, this.conditionToNode(condition))

  get return() {
    return this.sandstoneCore.pack.commands.returnCmd
  }

  /**
   * Logs an error in data storage and chat by default and `return fail`'s from the context.
   *
   * @param error Error to log before `return`.
   * @param broadcast Whether to scope the broadcast of the error (from `@a`) or disable it.
   *
   * @returns DataPoint where error was stored.
   */
  throw(error?: JSONTextComponent, broadcast?: MultiplePlayersArgument<false> | false): DataPointClass

  /**
   * Logs an error in data storage and chat by default and `return fail`'s from the context.
   *
   * @param error Error to log before `return`.
   * @param broadcast Whether to scope the broadcast of the error (from `@a`) or disable it.
   * @param dataPoint Disable storing to data point.
   *
   * @returns The full error text component string.
   */
  throw(
    error: JSONTextComponent | undefined,
    broadcast: MultiplePlayersArgument<false> | false | undefined,
    dataPoint: false,
  ): string

  /**
   * Logs an error in data storage and chat by default and `return fail`'s from the context.
   *
   * @param error Error to log before `return`.
   * @param broadcast Whether to scope the broadcast of the error (from `@a`) or disable it.
   * @param dataPoint Specific point to store the error to.
   *
   * @returns DataPoint that was set.
   */
  throw(
    error: JSONTextComponent | undefined,
    broadcast: MultiplePlayersArgument<false> | false | undefined,
    dataPoint: DataPointClass,
  ): DataPointClass

  public throw(
    error?: JSONTextComponent,
    broadcast?: MultiplePlayersArgument<false> | false,
    dataPoint?: DataPointClass | false,
  ) {
    const { pack, getCurrentMCFunctionOrThrow } = this.sandstoneCore
    const { DataVariable, commands } = pack
    const { tellraw, returnCmd } = commands

    const node = getCurrentMCFunctionOrThrow()

    const fullError: JSONTextComponent = [
      { text: '\nSandstone Pack Error:\n', color: 'yellow' },
      error || '[Function Threw]',
      '\n\n',

      `@ Function ${node.resource.name}. Node ${node.body.length - 1}.\n`,
    ]

    if (broadcast !== false) {
      tellraw(broadcast || '@a', fullError)
    }

    const errorString = parseJSONText(this.sandstoneCore, fullError) as unknown as string

    if (dataPoint !== false) {
      let point
      if (dataPoint === undefined) {
        point = DataVariable(parseJSONText(this.sandstoneCore, fullError) as unknown as string)
      } else {
        point = dataPoint.set(errorString)
      }
      returnCmd.fail()

      return point
    }

    returnCmd.fail()

    return errorString
  }

  while(condition: Condition, callback: () => void) {
    return new WhileStatement(this.sandstoneCore, this.conditionToNode(condition), callback)
  }

  doWhile(condition: Condition, callback: () => void) {
    callback()
    return new WhileStatement(this.sandstoneCore, this.conditionToNode(condition), callback)
  }

  for(
    initial: number | Score,
    end: (iterator: Score) => Condition,
    iterate: (iterator: Score) => Score,
    callback: (iterator: Score | number, _continue: () => void) => any,
  ): ForIStatement

  for(
    range: [start: number | Score, end: number | Score],
    type: 'iterate',
    callback: (iterator: Score, _continue: () => void) => any,
  ): ForIStatement

  for(
    range: [start: number | Score, end: number | Score, maximum?: number],
    type: 'binary',
    callback: (num: number) => any,
  ): void

  for(
    type: 'entry',
    _: 'of',
    iterable: IterableDataClass,
    callback: (entry: DataPointClass) => any,
  ): ForOfStatement<'entry', [entry: DataPointClass]>

  for(
    type: ['key', 'value'],
    _: 'of',
    iterable: DataIndexMap<DataIndexMapInitial>,
    callback: (key: StringDataPointClass, value: DataPointClass) => any,
  ): ForOfStatement<['key', 'value'], [key: StringDataPointClass, value: DataPointClass]>

  for(
    type: ['i', 'entry'],
    _: 'of',
    iterable: DataArray<DataArrayInitial>,
    callback: (i: Score, entry: DataPointClass) => any,
  ): ForOfStatement<['i', 'entry'], [i: Score, entry: DataPointClass]>

  for(
    arg1: (number | Score) | ForOfIterator | [start: number | Score, end: number | Score, maximum?: number],
    arg2: ((iterator: Score) => Condition) | 'of' | 'iterate' | 'binary',
    arg3:
      | ((iterator: Score) => Score)
      | IterableDataClass
      | ((num: number) => any)
      | ((iterator: Score, _continue: () => void) => any),
    // eslint-disable-next-line max-len
    arg4?:
      | ((iterator: Score, _continue: () => void) => any)
      | ((entry: DataPointClass) => any)
      | ((key: StringDataPointClass, value: DataPointClass) => any)
      | ((i: Score, value: DataPointClass) => any),
  ) {
    if (typeof arg1 === 'number' || arg1 instanceof Score) {
      return new ForIStatement(
        this.sandstoneCore,
        arg1,
        arg2 as (iterator: Score) => Condition,
        arg3 as (iterator: Score) => Score,
        arg4 as (iterator: Score | number) => any,
      )
    }
    // Yes these are dumb. Blame TypeScript. Yes I tried a generic, it didn't work.
    if (arg1 === 'entry') {
      return new ForOfStatement(
        this.sandstoneCore,
        arg1,
        arg3 as IterableDataClass,
        arg4 as (entry: DataPointClass) => any,
      )
    }
    if (arg1[0] === 'key') {
      return new ForOfStatement(
        this.sandstoneCore,
        arg1,
        arg3 as IterableDataClass,
        arg4 as (key: StringDataPointClass, value: DataPointClass) => any,
      )
    }
    if (typeof arg1[0] === 'number' || arg1[0] instanceof Score) {
      if (arg2 === 'iterate') {
        return new ForIStatement(
          this.sandstoneCore,
          arg1[0],
          (i) => i['<='](arg1[1] as Score | number),
          (i) => i['++'],
          arg3 as (iterator: unknown) => any,
        )
      }
      return binaryFor(this, arg1[0], arg1[1] as Score | number, arg3 as (num: number) => any, arg1[2])
    }

    return new ForOfStatement(
      this.sandstoneCore,
      arg1 as ForOfIterator,
      arg3 as IterableDataClass,
      arg4 as (i: Score, value: DataPointClass) => any,
    )
  }

  switch<
    ValueType extends DataPointClass | DataPointPickClass | Score,
    CheckType extends ValueType extends Score ? number : NBTObject,
  >(value: ValueType, cases: CaseStatement<CheckType> | DefaultType<CheckType>): void

  switch<
    ValueType extends DataPointClass | DataPointPickClass | Score,
    CheckType extends ValueType extends Score ? number : NBTObject,
  >(value: ValueType, cases: ['case', CheckType, () => any][], _default?: ['default', () => any]): void

  switch<
    ValueType extends DataPointClass | DataPointPickClass | Score,
    CheckType extends ValueType extends Score ? number : NBTObject,
  >(
    value: ValueType,
    _cases: ['case', CheckType, () => any][] | CaseStatement<CheckType> | DefaultType<CheckType>,
    _default?: ['default', () => any],
  ) {
    let cases: (readonly ['case', CheckType, () => any])[]

    if (_cases instanceof CaseStatement) {
      cases = _cases.getCases().map((c) => c.getValue())
    } else if (Array.isArray(_cases)) {
      cases = _cases
    } else {
      cases = _cases.cases.map((c) => c.getValue())
      _default = ['default', _cases.default]
    }
    const { Data, initMCFunction, MCFunction, Macro } = this.sandstoneCore.pack

    // eslint-disable-next-line no-plusplus
    const id = switches++

    const values = Data('storage', `__sandstone:switch_${id}`, 'Values')

    initMCFunction.push(() =>
      values.set(
        cases.map(([_, v, callback], i) => {
          MCFunction(`__sandstone:switch_${id}_case_${i}`, [], () => callback())

          return { Value: v, Index: i }
        }),
      ),
    )

    const flow = this

    MCFunction(`__sandstone:switch_${id}`, [value], () => {
      const index = Data('storage', `__sandstone:switch_${id}`, 'Index')

      Macro.data.modify
        .storage(index.currentTarget, 'Index')
        .set.from.storage(values.currentTarget, Macro`Values[{Value:${value}}}].Index`)

      const _if = flow.if(index, () => {
        MCFunction(`__sandstone:switch_${id}_inner`, [index], () => {
          Macro.functionCmd(Macro`__sandstone:switch_${id}_case_${index}`)
        })()
      })
      if (_default) _if.else(() => _default?.[1]())
    })()
  }

  case<ValueType extends number | NBTObject>(value: ValueType, callback: () => any) {
    return new CaseStatement(value, callback)
  }

  // Conditions
  /**
   * Checks for a specific biome in a given position.
   * @param coordinates Position to test.
   * @param biome Biome(s) to test for (can be a tag).
   */
  biome = (coordinates: Coordinates, biome: LiteralUnion<WORLDGEN_BIOMES>) => {
    return new SandstoneConditions.Biome(this.sandstoneCore, coordinates, biome)
  }

  /**
   * Compares the block at a given position to a given block ID.
   * @param position Position of a target block to test.
   * @param block Block(s) to test for (can be a tag).
   */
  block = (position: Coordinates, block: LiteralUnion<BLOCKS>) => {
    return new SandstoneConditions.Block(this.sandstoneCore, position, block)
  }

  /**
   * Compares the blocks in two equally sized volumes.
   * @param start Start position of the first volume.
   * @param end End position of the first volume.
   * @param destination Start position of the second volume.
   * @param scan_mode Specifies whether all blocks in the source volume should be compared, or if air blocks should be masked/ignored
   */
  blocks = (start: Coordinates, end: Coordinates, destination: Coordinates, scan_mode: 'all' | 'masked' = 'all') => {
    return new SandstoneConditions.Blocks(this.sandstoneCore, start, end, destination, scan_mode)
  }

  /**
   * Checks whether the targeted block, entity or storage has any data tag for a given path.
   *
   * You must provide a Data instance.
   *
   * ⚠️ You should prefer using the Data instance as a direct condition, as this function is only here for completeness.
   *
   * @example
   * _.if(_.data(Data('entity', '@s', 'myData')), () => {
   *   // Do something if the data exists
   * })
   *
   * // You should however prefer using the Data instance directly:
   * _.if(Data('entity', '@s', 'myData'), () => {
   *  // Do something if the data exists
   * })
   *
   * @param data Data instance to check.
   */
  data = (data: DataPointClass) => {
    return new SandstoneConditions.DataPointExists(this.sandstoneCore, data)
  }

  /**
   * Checks if the execution is in a matching dimension.
   * @param dimension Dimension to check for.
   */
  dimension = (dimension: LiteralUnion<string>) => {
    return new SandstoneConditions.Dimension(this.sandstoneCore, dimension)
  }

  /**
   * Checks a function or function tag and matches the return value(s). If a tag is given, all functions run regardless of the results of prior functions.
   * @param function_ Function to check for.
   */
  function_ = (function_: LiteralUnion<string> | MCFunctionClass<any, any>) => {
    if (typeof function_ === 'string') {
      return new SandstoneConditions.Function(this.sandstoneCore, function_)
    }
    return new SandstoneConditions.Function(this.sandstoneCore, function_.name)
  }

  /**
   * Checks whether one or more entities exist.
   *
   * @example
   * _.if(_.entity('@a[tag=example]'), () => {
   *   // Do something if the entity exists
   * })
   *
   * // ⚠️ You can use a Selector directly to achieve the same result:
   * _.if(Selector('@a', {tag: 'example'}), () => {
   *   // Do something if the entity exists
   * })
   *
   * @param targets Entity targets to check for.
   */
  entity = (targets: MultipleEntitiesArgument) => {
    return new SandstoneConditions.Selector(this.sandstoneCore, targets.toString())
  }

  /**
   * Checks if chunks at a given position is fully loaded.
   * @param position Position to check.
   */
  chunksLoaded = (position: Coordinates) => {
    return new SandstoneConditions.Loaded(this.sandstoneCore, position)
  }

  /**
   * Checks whether the predicate successes.
   *
   * @param predicate Predicate to check.
   */
  predicate = (predicate: LiteralUnion<string> | PredicateClass) => {
    if (typeof predicate === 'string') {
      return new SandstoneConditions.Predicate(this.sandstoneCore, predicate)
    }
    return new SandstoneConditions.Predicate(this.sandstoneCore, predicate.name)
  }
}
