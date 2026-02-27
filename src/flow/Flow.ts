import type {
  Registry,
  ContainerSlotSelector,
  Coordinates,
  EntitySlotSelector,
  JSONTextComponent,
  MultipleEntitiesArgument,
  MultiplePlayersArgument,
  NBTObject,
  MultiplePlayersArgumentOf,
  SymbolBlock,
  SymbolMcdocBlockStates,
} from 'sandstone/arguments'
import type {
  BlockEntity,
  BlockStatic,
  ParseBlockState,
} from 'sandstone/commands/implementations/block/setblock'
import type {
  ConditionClass,
  DataPointClass,
  IterableDataClass,
  JSONTextComponentClass,
  StringDataPointClass,
} from 'sandstone/variables'
import { parseJSONText, Score } from 'sandstone/variables'
import type { DataPointPickClass, MCFunctionClass, PredicateClass, SandstoneCore } from '../core'
import type { LiteralUnion } from '../utils'
import { AndNode, ConditionNode, NotNode, OrNode, SandstoneConditions, type BlockConditionNode, type ItemsBlockConditionNode, type ItemsEntityConditionNode } from './conditions'
import type { ItemPredicate } from './conditions/variables/items'
import { IfStatement } from './if_else'
import type { ForOfIterator } from './loops'
import { binaryFor, ForIStatement, ForOfStatement, WhileStatement } from './loops'
import type { ConditionCallback, DefaultType, SwitchCase } from './switch_case'
import { CaseStatement, executeSwitch } from './switch_case'

export type Condition = ConditionNode | ConditionClass

export function conditionToNode(condition: Condition) {
  if (!(condition instanceof ConditionNode)) {
    return condition._toMinecraftCondition()
  }
  return condition
}

export class Flow {
  constructor(public sandstoneCore: SandstoneCore) {}

  if = (condition: Condition, callback: () => void) =>
    new IfStatement(this.sandstoneCore, conditionToNode(condition), callback)

  and = (...conditions: Condition[]) =>
    new AndNode(
      this.sandstoneCore,
      conditions.map((condition) => conditionToNode(condition)),
    )

  or = (...conditions: Condition[]) =>
    new OrNode(
      this.sandstoneCore,
      conditions.map((condition) => conditionToNode(condition)),
    )

  not = (condition: Condition) => new NotNode(this.sandstoneCore, conditionToNode(condition))

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
   * @returns The full error text component.
   */
  throw(
    error: JSONTextComponent | undefined,
    broadcast: MultiplePlayersArgument<false> | false | undefined,
    dataPoint: false,
  ): JSONTextComponentClass

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

  public throw<T extends string>(
    error?: JSONTextComponent,
    broadcast?: MultiplePlayersArgumentOf<false, T> | false,
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
      tellraw(broadcast || '@a' as MultiplePlayersArgumentOf<false, T>, fullError)
    }

    const errorSerializable = parseJSONText(this.sandstoneCore, fullError)! as JSONTextComponentClass

    if (dataPoint !== false) {
      let point
      if (dataPoint === undefined) {
        point = DataVariable(errorSerializable.toJSON() as NBTObject)
      } else {
        point = dataPoint.set(errorSerializable.toJSON() as NBTObject)
      }
      returnCmd.fail()

      return point
    }

    returnCmd.fail()

    return errorSerializable
  }

  while(condition: Condition, callback: () => void) {
    return new WhileStatement(this.sandstoneCore, conditionToNode(condition), callback)
  }

  doWhile(condition: Condition, callback: () => void) {
    callback()
    return new WhileStatement(this.sandstoneCore, conditionToNode(condition), callback)
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
    type: 'entry',
    _: 'of' | 'of-reverse',
    iterable: IterableDataClass<'list' | 'map'>,
    callback: (entry: DataPointClass) => any,
  ): ForOfStatement<'entry', [entry: DataPointClass]>

  for(
    type: ['key', 'value'],
    _: 'of' | 'of-reverse',
    iterable: IterableDataClass<'map'>,
    callback: (key: StringDataPointClass, value: DataPointClass) => any,
  ): ForOfStatement<['key', 'value'], [key: StringDataPointClass, value: DataPointClass]>

  for(
    type: ['i', 'entry'],
    _: 'of' | 'of-reverse',
    iterable: IterableDataClass<'list' | 'map'>,
    callback: (i: Score, entry: DataPointClass) => any,
  ): ForOfStatement<['i', 'entry'], [i: Score, entry: DataPointClass]>

  for(
    arg1: (number | Score) | ForOfIterator | [start: number | Score, end: number | Score],
    arg2: ((iterator: Score) => Condition) | 'of' | 'of-reverse' | 'iterate',
    arg3:
      | ((iterator: Score) => Score)
      | IterableDataClass<'list' | 'map'>
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
        arg2 === 'of-reverse' ? 'reverse' : 'normal',
        arg3 as IterableDataClass<'map' | 'list'>,
        arg4 as (entry: DataPointClass) => any,
      )
    }
    if (arg1[0] === 'key') {
      return new ForOfStatement(
        this.sandstoneCore,
        arg1,
        arg2 === 'of-reverse' ? 'reverse' : 'normal',
        arg3 as IterableDataClass<'map'>,
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
    }

    return new ForOfStatement(
      this.sandstoneCore,
      arg1 as ForOfIterator,
      arg2 === 'of-reverse' ? 'reverse' : 'normal',
      arg3 as IterableDataClass<'list' | 'map'>,
      arg4 as (i: Score, value: DataPointClass) => any,
    )
  }

  switch<
    ValueType extends DataPointClass | DataPointPickClass | Score,
    CheckType extends ValueType extends Score ? number : NBTObject,
  >(value: ValueType, cases: CaseStatement<CheckType, ValueType> | DefaultType<CheckType, ValueType>): void

  switch<
    ValueType extends DataPointClass | DataPointPickClass | Score,
    CheckType extends ValueType extends Score ? number : NBTObject,
  >(value: ValueType, cases: SwitchCase<ValueType, CheckType>[] | [...SwitchCase<ValueType, CheckType>[], ['default', () => any]]): void

  switch<
    ValueType extends DataPointClass | DataPointPickClass | Score,
    CheckType extends ValueType extends Score ? number : NBTObject,
  >(
    value: ValueType,
    cases: SwitchCase<ValueType, CheckType>[] | [...SwitchCase<ValueType, CheckType>[], ['default', () => any]] | CaseStatement<CheckType, ValueType> | DefaultType<CheckType, ValueType>,
  ) {
    executeSwitch(this.sandstoneCore, value, cases)
  }

  /** Create a static value case for switch statements */
  case(value: number, callback: () => any): CaseStatement<number>

  /** Create a static value case for switch statements */
  case(value: NBTObject, callback: () => any): CaseStatement<NBTObject>

  /** Create a condition case for switch statements - checked after static cases fail */
  case<SwitchValueType>(condition: ConditionCallback<SwitchValueType>, callback: () => any): CaseStatement<never, SwitchValueType>

  case<SwitchValueType>(value: number | NBTObject | ConditionCallback<SwitchValueType>, callback: () => any) {
    if (typeof value === 'function') {
      return new CaseStatement<never, SwitchValueType>([
        { type: 'condition', condition: value, callback },
      ])
    }
    return new CaseStatement([
      { type: 'static', value, callback },
    ])
  }

  // Conditions
  /**
   * Checks for a specific biome in a given position.
   * @param coordinates Position to test.
   * @param biome Biome(s) to test for (can be a tag).
   */
  biome = (coordinates: Coordinates, biome: Registry['minecraft:worldgen/biome']) => {
    return new SandstoneConditions.Biome(this.sandstoneCore, coordinates, biome)
  }

  /**
   * Compares the block at a given position to a given block.
   *
   * @param position Position of a target block to test.
   * @param block Block to test for (can be a tag).
   * @param state Optional block state properties to match.
   *
   * @example
   * ```ts
   * // Simple block check
   * _.if(_.block(abs(0, 64, 0), 'minecraft:stone'), () => { ... })
   *
   * // Check block with specific state
   * _.if(_.block(abs(0, 64, 0), 'minecraft:oak_log', { axis: 'y' }), () => { ... })
   * ```
   */
  block<BLOCK extends BlockStatic>(
    position: Coordinates,
    block: BLOCK,
    state?: BLOCK extends keyof SymbolMcdocBlockStates
      ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[BLOCK]>>
      : Record<string, string | boolean | number>,
  ): BlockConditionNode

  /**
   * Compares the block at a given position to a given block with NBT data.
   *
   * @param position Position of a target block to test.
   * @param block Block to test for (must be a block entity).
   * @param state Optional block state properties to match.
   * @param nbt NBT data to match against the block entity.
   *
   * @example
   * ```ts
   * // Check chest with specific NBT
   * _.if(_.block(abs(0, 64, 0), 'minecraft:chest', { facing: 'north' }, { Items: [] }), () => { ... })
   *
   * // Check command block
   * _.if(_.block(['~', '~', '~1'], 'minecraft:command_block', {}, { Command: 'say Hello' }), () => { ... })
   * ```
   */
  block<BLOCK extends BlockEntity>(
    position: Coordinates,
    block: BLOCK,
    state: BLOCK extends keyof SymbolMcdocBlockStates
      ? ParseBlockState<NonNullable<SymbolMcdocBlockStates[BLOCK]>>
      : Record<string, string | boolean | number> | undefined,
    nbt: BLOCK extends keyof SymbolBlock
      ? NonNullable<SymbolBlock[BLOCK]>
      : SymbolBlock<'%fallback'>,
  ): BlockConditionNode

  block(
    position: Coordinates,
    block: Registry['minecraft:block'],
    state?: Record<string, string | boolean | number>,
    nbt?: NBTObject,
  ) {
    return new SandstoneConditions.Block(this.sandstoneCore, position, block, state, nbt)
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
  dimension = (dimension: Registry['minecraft:dimension']) => {
    return new SandstoneConditions.Dimension(this.sandstoneCore, dimension)
  }

  /**
   * Checks a function or function tag and matches the return value(s). If a tag is given, all functions run regardless of the results of prior functions.
   * @param function_ Function to check for.
   */
  function_ = (function_: `${string}:${string}` | MCFunctionClass<undefined, undefined>) => {
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
   * Tests for items in block entity or entity inventory slots.
   *
   * @example
   * ```ts
   * // Check if chest has any diamonds
   * _.if(_.items.block(abs(0, 64, 0), 'container.*', 'minecraft:diamond'), () => { ... })
   *
   * // Check if player has any diamonds
   * _.if(_.items.entity('@p', 'inventory.*', 'minecraft:diamond'), () => { ... })
   *
   * // Check for enchanted sword with builder
   * _.if(_.items.entity('@p', 'weapon.mainhand',
   *   ItemPredicate('minecraft:diamond_sword').has('minecraft:enchantments')
   * ), () => { ... })
   * ```
   */
  get items(): {
    /**
     * Test for items in a block entity's inventory slots.
     *
     * @param sourcePos Position of the block entity to test.
     * @param slots Slots to test (e.g., `'container.*'`, `'container.0'`).
     * @param itemPredicate Item predicate to match against.
     */
    block: (sourcePos: Coordinates, slots: ContainerSlotSelector, itemPredicate: ItemPredicate) => ItemsBlockConditionNode
    /**
     * Test for items in an entity's inventory slots.
     *
     * @param source Entity to test.
     * @param slots Slots to test (e.g., `'inventory.*'`, `'hotbar.0'`, `'armor.chest'`).
     * @param itemPredicate Item predicate to match against.
     */
    entity: (source: MultipleEntitiesArgument, slots: EntitySlotSelector, itemPredicate: ItemPredicate) => ItemsEntityConditionNode
  } {
    return {
      block: (sourcePos: Coordinates, slots: ContainerSlotSelector, itemPredicate: ItemPredicate) =>
        new SandstoneConditions.ItemsBlock(this.sandstoneCore, sourcePos, slots, itemPredicate),
      entity: (source: MultipleEntitiesArgument, slots: EntitySlotSelector, itemPredicate: ItemPredicate) =>
        new SandstoneConditions.ItemsEntity(this.sandstoneCore, source, slots, itemPredicate),
    }
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
